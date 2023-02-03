import express from 'express';
import jwt from 'jsonwebtoken';
import vars from '../../../../config/vars';
import {User} from '../../../../entities';
import {Response, ResponseStatusCode, TokenType} from '../../../../entities/networking';

const generateToken = (type: TokenType, payload: User): string => {
    const secret = type === TokenType.Access ? vars.accessSecret : vars.refreshSecret;
    const expiration = type === TokenType.Access ? '1h' : '30d';

    return jwt.sign({...payload}, secret, {expiresIn: expiration});
};

const checkToken = (ofType: TokenType, withToken: string): jwt.JwtPayload | string | null => {
    const secret = ofType === TokenType.Access ? vars.accessSecret : vars.refreshSecret;
    try {
        const decoded: jwt.JwtPayload | string = jwt.verify(withToken, secret);
        return decoded;
    } catch (_) {
        return null;
    }
};

const handleUnauthorizedAccess = (response: express.Response): void => {
    const json: Response = {
        status: ResponseStatusCode.NotFound,
        error: 'Resource Not Found'
    };
    response.status(ResponseStatusCode.NotFound);
    response.json(json);
};

const generateServerError = (): Response => {
    return {
        status: ResponseStatusCode.InternalServerError,
        message: `Internal Server Error`,
    };
};

export {
    generateToken,
    checkToken,
    handleUnauthorizedAccess,
    generateServerError
};
