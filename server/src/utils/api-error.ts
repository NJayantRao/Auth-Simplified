class ApiError extends Error {
  statusCode: number;
  message: string;
  success: boolean;
  data: any;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.success = false;
    this.data = null;
  }
}

export default ApiError;

//TO-DO: learn about error-stack
