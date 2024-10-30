import {NextFunction, Request, Response} from "express";

export class ApiError extends Error {
    public statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.name = this.constructor.name;
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}
export class BadRequestError extends ApiError {
    constructor(message = 'Bad request') {
        super(message, 400);
    }
}
export class UnauthorizedError extends ApiError {
    constructor(message = 'Unauthorized') {
        super(message, 401);
    }
}
export class NotFoundError extends ApiError {
    constructor(message = 'Resource not found') {
        super(message, 404);
    }
}
export class InternalServerError extends ApiError {
    constructor(message = 'Internal server error') {
        super(message, 500);
    }
}

export const errorHandler = (err: ApiError, response: Response) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Default error';

    response.status(statusCode).json({
        error: {
            statusCode,
            message
        }
    });
}