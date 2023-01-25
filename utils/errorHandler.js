class ErrorHandler extends Error {
  constructor(message, statuscode) {
    super(message, statuscode);
    this.statuscode = statuscode;
  }
}

export default ErrorHandler;
