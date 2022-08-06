class ServerError extends Error {
  constructor(message, code = 500) {
    super(message);
    if (Error.captureStackTrace) Error.captureStackTrace(this, this.constructor);
    this.code = code;
    this.name = "ServerError";
  }
}

export default ServerError;
