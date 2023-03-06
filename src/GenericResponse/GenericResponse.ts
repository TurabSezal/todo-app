import { HttpException, HttpStatus } from '@nestjs/common';

export class GenericResponse<T> extends HttpException {
  data: T;

  constructor(
    data: T,
    message = 'Forbidden',
    statuscode = HttpStatus.FORBIDDEN,
  ) {
    super(null, statuscode);
    this.message = message;
    this.data = data;
  }
  /**
   *
   * @param data
   * @param message
   * @param status
   * @returns {GenericResponse<T>}
   */
  static success<T>(
    data: T,
    message = 'success',
    status = HttpStatus.OK,
  ): GenericResponse<T> {
    return new GenericResponse(data, message, status);
  }

  /**
   *
   * @param data
   * @param message
   * @param status
   * @returns {GenericResponse<T>}
   */
  static created<T>(
    data: T,
    message = 'created',
    status = HttpStatus.CREATED,
  ): GenericResponse<T> {
    return new GenericResponse(data, message, status);
  }

  /**
   *
   * @param data
   * @param message
   * @param status
   * @returns {GenericResponse<T>}
   */
  static noContent<T>(
    data: T,
    message = 'no content',
    status = HttpStatus.NO_CONTENT,
  ): GenericResponse<T> {
    return new GenericResponse(data, message, status);
  }

  /**
   *
   * @param data
   * @param message
   * @param status
   * @returns {GenericResponse<T>}
   */
  static badRequest<T>(
    data: T,
    message = 'bad request',
    status = HttpStatus.BAD_REQUEST,
  ): GenericResponse<T> {
    return new GenericResponse(data, message, status);
  }

  /**
   *
   * @param data
   * @param message
   * @param status
   * @returns {GenericResponse<T>}
   */
  static notFound<T>(
    data: T,
    message = 'not found',
    status = HttpStatus.NOT_FOUND,
  ): GenericResponse<T> {
    return new GenericResponse(data, message, status);
  }

  /**
   *
   * @param data
   * @param message
   * @param status
   * @returns {GenericResponse<T>}
   */
  static notAcceptable<T>(
    data: T,
    message = 'not acceptable',
    status = HttpStatus.NOT_ACCEPTABLE,
  ): GenericResponse<T> {
    return new GenericResponse(data, message, status);
  }

  /**
   *
   * @param data
   * @param message
   * @param status
   * @returns {GenericResponse<T>}
   */
  static internalServerError<T>(
    data: T,
    message = 'internal server error',
    status = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    return new GenericResponse(data, message, status);
  }
}
