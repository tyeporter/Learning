import Joi from 'joi';
import {Order} from '../entities';
import {OrderProduct} from '../entities/auxiliary';
import {ValidationError} from '../entities/networking';
import {BusinessUsable, Dependable} from '../entities/protocols';
import {generateRejection, generateValidationError} from './helper-functions';

const OrderUseCase: BusinessUsable<Order> = {
    add(dependencies: Dependable<Order>): {execute: (order: Order, options?:{protected:boolean}) => Promise<Order>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (order: Order): ValidationError | null => {
            const schema = Joi.object({
                status: Joi.string().length(1).regex(/[ai]/).required(),
                userId: Joi.string().guid({version:'uuidv4'}).required()
            });

            const result = schema.validate(order);

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (order: Order, options?:{protected:boolean}): Promise<Order> => {
            const validationError = getValidationErrors(order);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                return await repository.add(order,options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error adding order'));
            }
        };

        return {execute};
    },
    update(dependencies: Dependable<Order>): {execute: (order: Order, options?:{protected:boolean}) => Promise<Order | null>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (order: Order): ValidationError | null => {
            const schema = Joi.object({
                id: Joi.number().required(),
                status: Joi.string().length(1).regex(/[ai]/).required(),
                userId: Joi.string().guid({version:'uuidv4'}).required()
            });

            const result = schema.validate(order);

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (order: Order, options?:{protected:boolean}): Promise<Order | null> => {
            const validationError = getValidationErrors(order);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                return await repository.update(order,options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error updating order'));
            }
        };

        return {execute};
    },
    delete(dependencies: Dependable<Order>): {execute: (id: string | number, options?:{protected:boolean}) => Promise<Order | null>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (id: string | number): ValidationError | null => {
            const schema = Joi.object({
                id: Joi.number().required()
            });

            const result = schema.validate({id});

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (id: string | number, options?:{protected:boolean}): Promise<Order | null> => {
            const validationError = getValidationErrors(id);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                return await repository.delete(id,options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error deleting order'));
            }
        };

        return {execute};
    },
    getById(dependencies: Dependable<Order>): {execute: (id: string | number, options?:{protected:boolean}) => Promise<Order | null>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (id: string | number): ValidationError | null => {

            const schema = Joi.object({
                id: Joi.number().required(),
            });

            const result = schema.validate({id});

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (id: string | number, options?:{protected:boolean}): Promise<Order | null> => {
            const validationError = getValidationErrors(id);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                return await repository.getById(id,options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting order by id'));
            }
        };
        return {execute};
    },
    getAll(dependencies: Dependable<Order>): {execute: (options?:{protected:boolean}) => Promise<Order[]>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const execute = async (options?:{protected:boolean}): Promise<Order[]> => {
            try {
                return await repository.getAll(options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting all orders'));
            }
        };

        return {execute};
    },
    deleteAll(dependencies: Dependable<Order>): {execute: (options?:{protected:boolean}) => Promise<Order[]>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const execute = async (options?:{protected:boolean}): Promise<Order[]> => {
            try {
                return await repository.deleteAll(options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error deleting all orders'));
            }
        };

        return {execute};
    },
    getOrdersForUser(dependencies: Dependable<Order>): {execute: (userId: string, options?:{protected:boolean}) => Promise<Order[]>} {
        const {
            repository
        } = dependencies;

        if (!repository) {
            throw new Error('repository should be passed as a dependency');
        }

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

        const execute = async (userId: string, options?:{protected:boolean}): Promise<Order[]> => {
            const validationError = getValidationErrors(userId);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.getOrdersForUser) throw new Error();
                return await repository.getOrdersForUser(userId,options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting orders for user'));
            }
        };

        return {execute};
    },
    getActiveOrderForUser(dependencies: Dependable<Order>): {execute: (userId: string, options?:{protected:boolean}) => Promise<Order>} {
        const {
            repository
        } = dependencies;

        if (!repository) {
            throw new Error('repository should be passed as a dependency');
        }

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

        const execute = async (userId: string, options?:{protected:boolean}): Promise<Order> => {
            const validationError = getValidationErrors(userId);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.getActiveOrderForUser) throw new Error();
                return await repository.getActiveOrderForUser(userId,options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting active order for user'));
            }
        };

        return {execute};
    },
    getUserOrder(dependencies: Dependable<Order>): {execute: (orderId: number, userId: string, options?:{protected:boolean}) => Promise<Order | null>} {
        const {
            repository
        } = dependencies;

        if (!repository) {
            throw new Error('repository should be passed as a dependency');
        }

        const getValidationErrors = (orderId: number, userId: string): ValidationError | null => {
            const schema = Joi.object({
                orderId: Joi.number().min(0).required(),
                userId: Joi.string().guid({version:'uuidv4'}).required()
            });

            const result = schema.validate({orderId,userId});

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };

            return null;
        };

        const execute = async (orderId: number, userId: string, options?:{protected:boolean}): Promise<Order | null> => {
            const validationError = getValidationErrors(orderId,userId);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.getUserOrder) throw new Error();
                return await repository.getUserOrder(orderId,userId,options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting user order'));
            }
        };

        return {execute};
    },
    addProductToOrder(dependencies: Dependable<Order>): {execute: (quantity: number, orderId: number, productId: string) => Promise<{name: string, quantity: number, price: number} | null>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (quantity: number, orderId: number, productId: string): ValidationError | null => {
            const schema = Joi.object({
                quantity: Joi.number().min(1).required(),
                orderId: Joi.number().min(0).required(),
                productId: Joi.string().guid({version:'uuidv4'}).required()
            });

            const result = schema.validate({quantity,orderId,productId});

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };

            return null;
        };

        const execute = async (quantity: number, orderId: number, productId: string): Promise<{name: string, quantity: number, price: number} | null> => {
            const validationError = getValidationErrors(quantity,orderId,productId);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.addProductToOrder) throw new Error();
                return await repository.addProductToOrder(quantity,orderId,productId);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error adding product to order'));
            }
        };

        return {execute};
    },
    removeProductFromOrder(dependencies: Dependable<Order>): {execute: (orderId: number, productId: string) => Promise<{name: string, quantity: number, price: number} | null>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (orderId: number, productId: string): ValidationError | null => {
            const schema = Joi.object({
                orderId: Joi.number().min(0).required(),
                productId: Joi.string().guid({version:'uuidv4'}).required()
            });

            const result = schema.validate({orderId,productId});

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (orderId: number, productId: string): Promise<{name: string, quantity: number, price: number} | null> => {
            const validationError = getValidationErrors(orderId,productId);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.removeProductFromOrder) throw new Error();
                return await repository.removeProductFromOrder(orderId,productId);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error removing product from order'));
            }
        };

        return {execute};
    },
    getProductsInOrder(dependencies: Dependable<Order>): {execute: (orderId: number) => Promise<{name: string, quantity: number, price: number}[]>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (orderId: number): ValidationError | null => {
            const schema = Joi.object({
                orderId: Joi.number().min(0).required()
            });

            const result = schema.validate({orderId});

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };

            return null;
        };

        const execute = async (orderId: number): Promise<{name: string, quantity: number, price: number}[]> => {
            const validationError = getValidationErrors(orderId);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.getProductsInOrder) throw new Error();
                return await repository.getProductsInOrder(orderId);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting products in order'));
            }
        };

        return {execute};
    },
    deleteAllOrdersForUser(dependencies: Dependable<Order>): {execute: (userId: string, options?:{protected:boolean}) => Promise<Order[]>} {
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

        const execute = async (userId: string, options?: {protected:boolean}): Promise<Order[]> => {
            const validationError = getValidationErrors(userId);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.deleteAllOrdersForUser) throw new Error();
                return await repository.deleteAllOrdersForUser(userId,options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error deleting all orders for user'));
            }
        };

        return {execute};
    },
    deleteAllProductsInOrder(dependencies: Dependable<Order>): {execute: (orderId: number) => Promise<{name: string, quantity: number, price: number}[]>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (orderId: number): ValidationError | null => {
            const schema = Joi.object({
                orderId: Joi.number().min(0).required()
            });

            const result = schema.validate({orderId});

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (orderId: number): Promise<{name: string, quantity: number, price: number}[]> => {
            const validationError = getValidationErrors(orderId);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.deleteAllProductsInOrder) throw new Error();
                return await repository.deleteAllProductsInOrder(orderId);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error deleting all products in order'));
            }
        };

        return {execute};
    },
    getAllOrderProducts(dependencies: Dependable<Order>): {execute: () => Promise<OrderProduct[]>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const execute = async (): Promise<OrderProduct[]> => {
            try {
                if (!repository.getAllOrderProducts) throw new Error();
                return await repository.getAllOrderProducts();
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting all order products'));
            }
        };

        return {execute};
    },
    deleteAllOrderProducts(dependencies: Dependable<Order>): {execute: () => Promise<OrderProduct[]>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const execute = async (): Promise<OrderProduct[]> => {
            try {
                if (!repository.deleteAllOrderProducts) throw new Error();
                return await repository.deleteAllOrderProducts();
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error deleting all order products'));
            }
        };

        return {execute};
    }
};

Object.freeze(OrderUseCase);
export default OrderUseCase;
