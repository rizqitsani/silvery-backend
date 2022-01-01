import { StatusCodes } from 'http-status-codes';

/**
 * @extends Error
 */
class ExtendableError extends Error {
  status: StatusCodes;
  isPublic: boolean;

  constructor({
    message,
    status,
    isPublic,
  }: {
    message: string;
    status: StatusCodes;
    isPublic: boolean;
  }) {
    super(message);
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    this.isPublic = isPublic;
  }
}

export default ExtendableError;
