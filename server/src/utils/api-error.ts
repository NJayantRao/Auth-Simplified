class ApiError extends Error {
  statusCode: number;
  success: boolean;
  message: string;
  data: any;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.success = false;
    this.message = message;
    this.data = null;
  }
}

export default ApiError;

//TO-DO: learn about error-stack
