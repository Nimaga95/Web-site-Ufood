export class AccessDeniedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AccessDeniedError';
  }
}

export function createError(status, message) {
  if (status === 401) {
    return new AccessDeniedError(message);
  }
  else {
    return new Error(message);
  }
}
