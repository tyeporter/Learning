import Joi from 'joi';
import {User} from '../entities';
import {BusinessUsable, Dependable} from '../entities/protocols';
import {ValidationError} from '../entities/networking';
import {UserSession} from '../entities/auxiliary';
import {generateRejection, generateValidationError} from './helper-functions';

const UserUseCase: BusinessUsable<User> = {
    add(dependencies: Dependable<User>): {execute: (user: User, options?:{protected:boolean}) => Promise<User>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (user: User): ValidationError | null => {
            const schema = Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required(),
                firstName: Joi.string().optional(),
                lastName: Joi.string().optional(),
                level: Joi.number().min(0).max(1).required()
            });

            const result = schema.validate(user);

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (user: User, options?: {protected:boolean}): Promise<User> => {
            const validationError = getValidationErrors(user);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                return await repository.add(user,options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error adding user'));
            }
        };

        return {execute};
    },
    update(dependencies: Dependable<User>): {execute: (user: User, options?:{protected:boolean}) => Promise<User | null>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (user: User): ValidationError | null => {
            const schema = Joi.object({
                id: Joi.string().guid({version:'uuidv4'}).required(),
                username: Joi.string().required(),
                firstName: Joi.string().required(),
                lastName: Joi.string().required(),
                level: Joi.number().min(0).max(1).required()
            });

            const result = schema.validate(user);

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (user: User, options?: {protected:boolean}): Promise<User | null> => {
            const validationError = getValidationErrors(user);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                return await repository.update(user,options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error updating user'));
            }
        };

        return {execute};
    },
    delete(dependencies: Dependable<User>): {execute: (id: string | number, options?:{protected:boolean}) => Promise<User | null>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (id: string | number): ValidationError | null => {
            const schema = Joi.object({
                id: Joi.string().guid({version:'uuidv4'}).required()
            });

            const result = schema.validate({id});

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (id: string | number, options?: {protected:boolean}): Promise<User | null> => {
            const validationError = getValidationErrors(id);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                return await repository.delete(id,options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error deleting user'));
            }
        };

        return {execute};
    },
    getById(dependencies: Dependable<User>): {execute: (id: string | number, options?:{protected:boolean}) => Promise<User | null>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (id: string | number): ValidationError | null => {
            const schema = Joi.object({
                id: Joi.string().guid({version:'uuidv4'}).required(),
            });

            const result = schema.validate({id});

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (id: string | number, options?: {protected:boolean}): Promise<User | null> => {
            const validationError = getValidationErrors(id);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                return await repository.getById(id,options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting user by id'));
            }
        };
        return {execute};
    },
    getUserByUsername(dependencies: Dependable<User>): {execute: (username: string, options?:{protected:boolean}) => Promise<User | null>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (username: string): ValidationError | null => {
            const schema = Joi.object({
                username: Joi.string().required()
            });

            const result = schema.validate({username});

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (username: string, options?:{protected:boolean}): Promise<User | null> => {
            const validationError = getValidationErrors(username);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.getUserByUsername) throw new Error();
                return await repository.getUserByUsername(username,options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting user by username'));
            }
        };
        return {execute};
    },
    getAll(dependencies: Dependable<User>): {execute: (options?:{protected:boolean}) => Promise<User[]>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const execute = async (options?:{protected:boolean}): Promise<User[]> => {
            try {
                return await repository.getAll(options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting all users'));
            }
        };

        return {execute};
    },
    deleteAll(dependencies: Dependable<User>): {execute: (options?:{protected:boolean}) => Promise<User[]>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const execute = async (options?:{protected:boolean}): Promise<User[]> => {
            try {
                return await repository.deleteAll(options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error deleting all users'));
            }
        };

        return {execute};
    },
    authenticate(dependencies: Dependable<User>): {execute: (username: string, password: string) => Promise<User | null>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (username: string, password: string): ValidationError | null => {
            const schema = Joi.object({
                username: Joi.string().required(),
                password: Joi.string().required()
            });

            const result = schema.validate({username,password});

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (username: string, password: string): Promise<User | null> => {
            const validationError = getValidationErrors(username, password);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.authenticate) throw new Error();
                return await repository.authenticate(username, password);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error authenticating user'));
            }
        };

        return {execute};
    },
    addSession(dependencies: Dependable<User>): {execute: (secret: string, userId: string) => Promise<UserSession>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (secret: string, userId: string): ValidationError | null => {
            const schema = Joi.object({
                secret: Joi.string().regex(/^(?:[\w-]*\.){2}[\w-]*$/).required(),
                userId: Joi.string().guid({version:'uuidv4'}).required()
            });
            const result = schema.validate({secret,userId});

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (secret: string, userId: string): Promise<UserSession> => {
            const validationError = getValidationErrors(secret,userId);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.addSession) throw new Error();
                return await repository.addSession(secret,userId);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error adding session'));
            }
        };

        return {execute};
    },
    deleteSession(dependencies: Dependable<User>): {execute: (secret: string, userId: string) => Promise<UserSession | null>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (secret: string, userId: string): ValidationError | null => {
            const schema = Joi.object({
                secret: Joi.string().regex(/^(?:[\w-]*\.){2}[\w-]*$/).required(),
                userId: Joi.string().guid({version:'uuidv4'}).required()
            });
            const result = schema.validate({secret,userId});

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (secret: string, userId: string): Promise<UserSession | null> => {
            const validationError = getValidationErrors(secret,userId);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.deleteSession) throw new Error();
                return await repository.deleteSession(secret,userId);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error deleting session'));
            }
        };

        return {execute};
    },
    getSession(dependencies: Dependable<User>): {execute: (sessionId: number) => Promise<UserSession | null>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (sessionId: number): ValidationError | null => {
            const schema = Joi.object({
                sessionId: Joi.number().required(),
            });
            const result = schema.validate({sessionId});

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (sessionId: number): Promise<UserSession | null> => {
            const validationError = getValidationErrors(sessionId);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.getSession) throw new Error();
                return await repository.getSession(sessionId);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting session'));
            }
        };

        return {execute};
    },
    getSessionForUser(dependencies: Dependable<User>): {execute: (userId: string) => Promise<UserSession | null>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (userId: string): ValidationError | null => {
            const schema = Joi.object({
                userId: Joi.string().guid({version:'uuidv4'}).required()
            });
            const result = schema.validate({userId});

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (userId: string): Promise<UserSession | null> => {
            const validationError = getValidationErrors(userId);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.getSessionForUser) throw new Error();
                return await repository.getSessionForUser(userId);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting session for user'));
            }
        };

        return {execute};
    },
    getAllSessions(dependencies: Dependable<User>): {execute: () => Promise<UserSession[]>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const execute = async (): Promise<UserSession[]> => {
            try {
                if (!repository.getAllSessions) throw new Error();
                return await repository.getAllSessions();
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting all sessions'));
            }
        };

        return {execute};
    },
    deleteAllSessions(dependencies: Dependable<User>): {execute: () => Promise<UserSession[]>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const execute = async (): Promise<UserSession[]> => {
            try {
                if (!repository.deleteAllSessions) throw new Error();
                return await repository.deleteAllSessions();
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error deleting all sessions'));
            }
        };

        return {execute};
    }
};

Object.freeze(UserUseCase);
export default UserUseCase;
