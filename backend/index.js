require('dotenv').config();
const { chromium } = require("playwright");
const express = require("express");
const cors = require("cors");

const app = express();
const router = express.Router();

const API_KEY = process.env.ZOOM_API_KEY;
let ZOOM_LINK = "";
const BOT_LIMIT = 7;

const USER_AGENTS = [
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/123.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 Version/15.1 Safari/605.1.15",
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/122.0.0.0 Safari/537.36",
  "Mozilla/5.0 (iPhone; CPU iPhone OS 16_4 like Mac OS X) AppleWebKit/605.1.15 Mobile/15E148",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:125.0) Gecko/20100101 Firefox/125.0",
];

const bots = new Map();

// Middleware: API key check
router.use((req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || auth !== `Bearer ${API_KEY}`) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
});

// Set Zoom link
router.post("/set-link", (req, res) => {
  const { link } = req.body;
  if (!link) return res.status(400).json({ error: "Missing link" });
  ZOOM_LINK = link;
  console.log(`[EVENT] Zoom link set to: ${link}`);
  res.json({ success: true });
});

// Join bot
router.post("/join", async (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: "Missing name" });
  if (!ZOOM_LINK) return res.status(400).json({ error: "Zoom link not set" });
  if (bots.has(name)) return res.status(400).json({ error: "Name already in use" });
  if (bots.size >= BOT_LIMIT) return res.status(429).json({ error: "Bot limit reached" });

  const success = await joinZoomBot(name);
  if (success) res.json({ success: true });
  else res.status(500).json({ error: "Failed to join" });
});

// Get active bots
router.get("/bots", (req, res) => {
  res.json({ count: bots.size, names: Array.from(bots.keys()) });
});

// Kill bot
router.post("/kill", async (req, res) => {
  const { name } = req.body;
  const bot = bots.get(name);
  if (!bot) return res.status(404).json({ error: "Bot not found" });
  try {
    // Close page and browser, then clean up references
    if (bot.page && !bot.page.isClosed()) {
      await bot.page.close();
    }
    if (bot.browser && bot.browser.isConnected()) {
      await bot.browser.close();
    }
  } catch (err) {
    console.error(`[ERROR] Error closing bot '${name}':`, err);
  }
  bots.delete(name);
  // Explicitly nullify references for GC
  if (bot.page) bot.page = null;
  if (bot.browser) bot.browser = null;
  res.json({ success: true });
});

// Kill all bots
router.post("/kill-all", async (_req, res) => {
  for (const [name, bot] of bots.entries()) {
    try {
      if (bot.page && !bot.page.isClosed()) {
        await bot.page.close();
      }
      if (bot.browser && bot.browser.isConnected()) {
        await bot.browser.close();
      }
    } catch (err) {
      console.error(`[ERROR] Error closing bot '${name}':`, err);
    }
    // Explicitly nullify references for GC
    if (bot.page) bot.page = null;
    if (bot.browser) bot.browser = null;
    bots.delete(name);
  }
  res.json({ success: true });
});

// Get Zoom link
router.get("/get-link", (req, res) => {
  if (!ZOOM_LINK) return res.status(404).json({ error: "Zoom link not set" });
  res.json({ link: ZOOM_LINK });
});


// Core bot logic
async function joinZoomBot(name) {
  const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
  const browser = await chromium.launch({
    headless: true,
    args: [
      "--use-fake-ui-for-media-stream",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--disable-extensions",
      "--disable-infobars",
    ],
  });

  const context = await browser.newContext({
    permissions: [],
    userAgent,
    viewport: { width: 1280, height: 720 },
  });

  const page = await context.newPage();

  try {
    console.log(`[EVENT] Bot '${name}' is navigating to Zoom link.`);
    await page.goto(ZOOM_LINK, {
      waitUntil: "domcontentloaded",
      timeout: 20000,
    });

    let frame = page;
    try {
      await page.waitForSelector("iframe#webclient", { timeout: 10000 });
      const webclientElement = await page.$("iframe#webclient");
      const webclientFrame =
        (await page.frame({ name: "webclient" })) ||
        (await page.frame({ url: /webclient/ })) ||
        (webclientElement ? await webclientElement.contentFrame() : null);
      if (webclientFrame) frame = webclientFrame;
    } catch {}

    try {
      const nameInput = await frame.waitForSelector("#input-for-name", { timeout: 10000 });
      await nameInput.fill(name);
    } catch (err) {
      console.log(`[ERROR] Bot '${name}' could not fill name:`, err);
    }

    try {
      const joinBtn = await frame.waitForSelector("#root > div > div.preview-new-flow > div > div.preview-meeting-info > button", { timeout: 10000 });
      await joinBtn.click();
    } catch (err) {
      console.log(`[ERROR] Bot '${name}' could not click join:`, err);
    }

    bots.set(name, { browser, page });
    console.log(`[SUCCESS] Bot '${name}' joined.`);
    return true;
  } catch (err) {
    console.log(`[FATAL] Bot '${name}' failed:`, err);
    await browser.close();
    return false;
  }
}

// CORS: Safe for browser access from your domain only
app.use(cors({
  origin: [
    "http://budd.systems",
    "http://budd.systems:5000"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Parse JSON
app.use(express.json());

// Mount router at /zoom-api
app.use("/zoom-api", router);

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Zoom bot API listening on http://localhost:${PORT}/zoom-api`);
});
