import { StatusCodes } from 'http-status-codes';

import ExtendableError from '@/errors/ExtendableError';

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class ApiError extends ExtendableError {
  stack: string | undefined;

  /**
   * Creates an API error.
   * @param {string} message - Error message.
   * @param {number} status - HTTP status code of error.
   * @param {boolean} isPublic - Whether the message should be visible to user or not.
   */
  constructor({
    message,
    stack,
    status = StatusCodes.INTERNAL_SERVER_ERROR,
    isPublic = true,
  }: {
    message: string;
    stack?: string;
    status?: StatusCodes;
    isPublic?: boolean;
  }) {
    super({
      message,
      status,
      isPublic,
    });

    this.stack = stack;
  }
}

export default ApiError;
