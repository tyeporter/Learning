import express from 'express';

type MiddlewareFuncAsync = (request: express.Request, response: express.Response, next: express.NextFunction) => Promise<void>;

export default MiddlewareFuncAsync;
