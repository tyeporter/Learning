import jwt from 'jsonwebtoken';
import vars from '../../config/vars';
import {User} from '../../entities';
import {Response, ResponseStatusCode, TokenType} from '../../entities/networking';

const generateToken = (type: TokenType, payload: User): string => {
    const secret = type === TokenType.Access ? vars.accessSecret : vars.refreshSecret;
    const expiration = type === TokenType.Access ? '1h' : '30d';

    return jwt.sign({...payload}, secret, {expiresIn: expiration});
};

const checkToken = (type: TokenType, token: string): jwt.JwtPayload | string | null => {
    const secret = type === TokenType.Access ? vars.accessSecret : vars.refreshSecret;
    try {
        const decoded: jwt.JwtPayload | string = jwt.verify(token, secret);
        return decoded;
    } catch (_) {
        return null;
    }
};

const generateOKResponse = (message: string | object): Response => {
    return {
        status: ResponseStatusCode.OK,
        message
    };
};

const generateRequestError = (message: string, code: ResponseStatusCode): Response => {
    return {
        status: code,
        message: message
    };
};

const generateServerError = (action: string): Response => {
    return {
        status: ResponseStatusCode.InternalServerError,
        message: `Error ${action}`,
        reason: 'Internal Server Error'
    };
};

export {
    generateToken,
    checkToken,
    generateOKResponse,
    generateRequestError,
    generateServerError
};
