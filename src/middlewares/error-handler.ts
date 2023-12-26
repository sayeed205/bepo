import type { NextFunction, Request, Response } from 'express';

import { ErrorResponse } from '@/utils';

export const errorHandler = (
    err: ErrorResponse,
    _req: Request,
    res: Response,
    _next: NextFunction,
) => {
    let error = { ...err };
    error.message = err.message;
    let message;

    if (err.name === 'CastError') {
        message = `Resource not found`;
        error = new ErrorResponse(message, 404);
    } else if (err.name === 'TypeError') {
        console.log('error:', err);
        message = `An unknown error occurred while processing your request. Please try again later.`;
    } else if (err.name === 'JsonWebTokenError') {
        message = `Invalid token or Token expired. Please log in again.`;
        error = new ErrorResponse(message, 401);
    } else {
        console.log('error:', err);
        message = '';
    }

    // todo)) add more generic errors
    return res.status(error.statusCode || 500).json({
        success: false,
        error: message || error.message || 'Server Error',
    });
};
