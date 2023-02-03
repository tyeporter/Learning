import express from 'express';
import {Response, ResponseStatusCode} from '../../../entities/networking';

const NotFoundErrorHandler = (
    request: express.Request,
    response: express.Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: express.NextFunction
): void => {
    const json: Response = {
        status: ResponseStatusCode.NotFound,
        error: 'Resource Not Found',
        url: request.url
    };
    response.status(404);
    response.json(json);
};

export default NotFoundErrorHandler;
