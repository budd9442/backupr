export interface Bot {
  name: string;
}

export interface ApiResponse {
  success?: boolean;
  error?: string;
  count?: number;
  names?: string[];
}

export interface ApiError {
  message: string;
  status?: number;
}