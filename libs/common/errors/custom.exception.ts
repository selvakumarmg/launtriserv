import { HttpException, HttpStatus } from '@nestjs/common';
import { ERROR_MESSAGES, HTTP_STATUS } from './error.interface';

export class CustomException extends HttpException {
  constructor(
    message: string,
    status: number = HTTP_STATUS.INTERNAL_SERVER_ERROR,
  ) {
    super(
      {
        message,
        statusCode: status,
        timestamp: new Date().toISOString(),
      },
      status,
    );
  }
}

export class BadRequestException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.BAD_REQUEST) {
    super(message, HTTP_STATUS.BAD_REQUEST);
  }
}

export class UnauthorizedException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, HTTP_STATUS.UNAUTHORIZED);
  }
}

export class ForbiddenException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.FORBIDDEN) {
    super(message, HTTP_STATUS.FORBIDDEN);
  }
}

export class NotFoundException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND);
  }
}

export class ConflictException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.CONFLICT) {
    super(message, HTTP_STATUS.CONFLICT);
  }
}

export class InternalServerErrorException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.INTERNAL_SERVER_ERROR) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
  }
}

export class ServiceUnavailableException extends CustomException {
  constructor(message: string = ERROR_MESSAGES.SERVICE_UNAVAILABLE) {
    super(message, HTTP_STATUS.SERVICE_UNAVAILABLE);
  }
} 