import { ApiResponse, ApiError } from '../types';

const API_BASE_URL = 'https://budd.systems/zoom-api';
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

class ApiClient {
  private apiKey: string = '';

  setApiKey(key: string) {
    this.apiKey = key;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private async fetchWithRetry(url: string, options: RequestInit, retries: number = 0): Promise<Response> {
    try {
      const response = await fetch(url, options);
      return response;
    } catch (error) {
      if (retries < MAX_RETRIES) {
        await this.delay(RETRY_DELAY * Math.pow(2, retries)); // Exponential backoff
        return this.fetchWithRetry(url, options, retries + 1);
      }
      throw error;
    }
  }

  private async fetchWithAuth(endpoint: string, options: RequestInit = {}): Promise<ApiResponse> {
    if (!this.apiKey) {
      throw new Error('API key not set');
    }

    if (this.apiKey.trim().length < 32) {
      throw new Error('Invalid API key format');
    }

    const headers = {
      'Authorization': `Bearer ${this.apiKey}`,
      'Content-Type': 'application/json',
      ...options.headers,
    };

    try {
      const response = await this.fetchWithRetry(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });

      // Handle non-JSON responses
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Invalid response format from server');
      }

      const data = await response.json();

      if (!response.ok) {
        const error: ApiError = {
          message: data.error || `Server error: ${response.status} ${response.statusText}`,
          status: response.status,
        };
        throw error;
      }

      return data;
    } catch (error) {
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        throw new Error('Unable to connect to the API. Please check your internet connection and try again.');
      } else if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected network error occurred');
    }
  }

  async getBots(): Promise<ApiResponse> {
    return this.fetchWithAuth('/bots', { method: 'GET' });
  }

  async getLink(): Promise<ApiResponse> {
    return this.fetchWithAuth('/get-link', { method: 'GET' });
  }

  async setLink(link: string): Promise<ApiResponse> {
    return this.fetchWithAuth('/set-link', {
      method: 'POST',
      body: JSON.stringify({ link }),
    });
  }

  async joinBot(name: string): Promise<ApiResponse> {
    return this.fetchWithAuth('/join', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async killBot(name: string): Promise<ApiResponse> {
    return this.fetchWithAuth('/kill', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  async killAllBots(): Promise<ApiResponse> {
    return this.fetchWithAuth('/kill-all', { method: 'POST' });
  }
}

export const apiClient = new ApiClient();