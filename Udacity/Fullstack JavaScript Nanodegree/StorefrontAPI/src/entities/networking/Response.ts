import StatusCode from './ResponseStatusCode';
import ValidationError from './ValidationError';

type Response = {
    status: StatusCode;
    message?: object | string | null;
    error?: object | string | null | undefined;
    reason?: string;
    url?: string;
    ip?: string;
    validationError?: ValidationError
};

export default Response;
