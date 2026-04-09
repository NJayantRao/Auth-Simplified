class ApiResponse<T> {
  statusCode: number;
  message: string;
  success: boolean;
  data?: T | undefined;

  constructor(statusCode: number, message: string, data?: T) {
    this.statusCode = statusCode;
    this.message = message;
    this.success = statusCode < 400;
    this.data = data;
  }
}

export default ApiResponse
