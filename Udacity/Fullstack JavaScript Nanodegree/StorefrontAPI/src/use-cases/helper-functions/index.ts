import {Response, ResponseStatusCode, ValidationError} from '../../entities/networking';

const generateRejection = (message: string): Response => {
    return {
        status: ResponseStatusCode.InternalServerError,
        message,
        reason: 'Internal Server Error',
    };
};

const generateValidationError = (validationError: ValidationError): Response => {
    return {
        status: ResponseStatusCode.BadRequest,
        message: 'Validation Error',
        reason: 'Bad Request Sent',
        validationError
    };
};

export {
    generateRejection,
    generateValidationError
};
