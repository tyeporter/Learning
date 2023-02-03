import express from 'express';
import {Response} from '../../../entities/networking';

const ValidationErrorHandler = (
    error: Response,
    request: express.Request,
    response: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction
): void => {
    const responseError: Response = {
        status: error.status,
        error: error.message,
    };

    if (error.reason) {
        responseError.reason = error.reason;
    }

    responseError.url = request.url;

    if (error.validationError) {
        responseError.validationError = error.validationError;
    };

    response.status(error.status);
    response.json(responseError);
};

export default ValidationErrorHandler;
