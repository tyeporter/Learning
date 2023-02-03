import Joi from 'joi';
import {Product} from '../entities';
import {ProductCategory} from '../entities/auxiliary';
import {ValidationError} from '../entities/networking';
import {BusinessUsable, Dependable} from '../entities/protocols';
import {generateRejection, generateValidationError} from './helper-functions';

const ProductUseCase: BusinessUsable<Product> = {
    add(dependencies: Dependable<Product>): {execute: (product: Product, options?:{protected:boolean}) => Promise<Product>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (product: Product): ValidationError | null=> {
            const schema = Joi.object({
                name: Joi.string().required(),
                description: Joi.string().optional(),
                price: Joi.number().required(),
                categoryId: Joi.any().optional()
            });

            const result = schema.validate(product);

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (product: Product, options?: {protected:boolean}): Promise<Product> => {
            const validationError = getValidationErrors(product);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                return await repository.add(product,options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error adding product'));
            }
        };

        return {execute};
    },
    update(dependencies: Dependable<Product>): {execute: (product: Product, options?:{protected:boolean}) => Promise<Product | null>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (product: Product): ValidationError | null => {
            const schema = Joi.object({
                id: Joi.string().guid({version:'uuidv4'}).required(),
                name: Joi.string().required(),
                description: Joi.string().optional(),
                price: Joi.number().required(),
                categoryId: Joi.any().optional()
            });

            const result = schema.validate(product);

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (product: Product, options?: {protected:boolean}): Promise<Product | null> => {
            const validationError = getValidationErrors(product);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                return await repository.update(product,options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error updating product'));
            }
        };

        return {execute};
    },
    delete(dependencies: Dependable<Product>): {execute: (id: string | number, options?:{protected:boolean}) => Promise<Product | null>} {
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

        const execute = async (id: string | number, options?: {protected:boolean}): Promise<Product | null> => {
            const validationError = getValidationErrors(id);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                return await repository.delete(id,options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error deleting product'));
            }
        };

        return {execute};
    },
    getById(dependencies: Dependable<Product>): {execute: (id: string | number, options?:{protected:boolean}) => Promise<Product | null>} {
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

        const execute = async (id: string | number, options?: {protected:boolean}): Promise<Product | null> => {
            const validationError = getValidationErrors(id);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                return await repository.getById(id,options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting product by id'));
            }
        };
        return {execute};
    },
    getAll(dependencies: Dependable<Product>): {execute: (options?:{protected:boolean}) => Promise<Product[]>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const getValidationErrors = (): ValidationError | null => {
            return null;
        };

        const execute = async (options?: {protected:boolean}): Promise<Product[]> => {
            const validationError = getValidationErrors();
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                return await repository.getAll(options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting all products'));
            }
        };

        return {execute};
    },
    deleteAll(dependencies: Dependable<Product>): {execute: (options?:{protected:boolean}) => Promise<Product[]>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const execute = async (options?:{protected:boolean}): Promise<Product[]> => {
            try {
                return await repository.deleteAll(options);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error deleting all products'));
            }
        };

        return {execute};
    },
    getProductsByCategory(dependencies: Dependable<Product>): {execute: (categoryId: number) => Promise<Product[]>} {
        const {
            repository
        } = dependencies;

        if (!repository) {
            throw new Error('repository should be passed as a dependency');
        }

        const getValidationErrors = (categoryId: number): ValidationError | null => {
            const schema = Joi.object({
                categoryId: Joi.number().required(),
            });

            const result = schema.validate({
                categoryId
            });

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (categoryId: number): Promise<Product[]> => {
            const validationError = getValidationErrors(categoryId);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.getProductsByCategory) throw new Error();
                return await repository.getProductsByCategory(categoryId);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting product by category'));
            }
        };

        return {execute};
    },
    addCategory(dependencies: Dependable<Product>): {execute: (categoryName: string) => Promise<ProductCategory>} {
        const {
			repository
		} = dependencies;

		if (!repository) {
			throw new Error('repository should be passed as a dependency');
		}

        const getValidationErrors = (categoryName: string): ValidationError | null => {
            const schema = Joi.object({
                categoryName: Joi.string().required()
            });

            const result = schema.validate({categoryName});

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (categoryName: string): Promise<ProductCategory> => {
            const validationError = getValidationErrors(categoryName);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.addCategory) throw new Error();
                return await repository.addCategory(categoryName);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error adding category'));
            }
        };

        return {execute};
    },
    deleteCategory(dependencies: Dependable<Product>): {execute: (categoryId: number) => Promise<ProductCategory | null>} {
        const {
			repository
		} = dependencies;

		if (!repository) {
			throw new Error('repository should be passed as a dependency');
		}

        const getValidationErrors = (categoryId: number): ValidationError | null => {
            const schema = Joi.object({
                categoryId: Joi.number().required()
            });

            const result = schema.validate({categoryId});

            if (result.error) return {
                field: result.error.details[0].context?.label,
                message: result.error.message
            };
            return null;
        };

        const execute = async (categoryId: number): Promise<ProductCategory | null> => {
            const validationError = getValidationErrors(categoryId);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.deleteCategory) throw new Error();
                return await repository.deleteCategory(categoryId);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error deleting category'));
            }
        };

        return {execute};
    },
    getCategory(dependencies: Dependable<Product>): {execute: (categoryId: number) => Promise<ProductCategory | null>} {
		const {
			repository
		} = dependencies;

		if (!repository) {
			throw new Error('repository should be passed as a dependency');
		}

        const getValidationErrors = (id: number): ValidationError | null => {
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

        const execute = async (id: number): Promise<ProductCategory | null> => {
            const validationError = getValidationErrors(id);
            if (validationError) return Promise.reject(generateValidationError(validationError));

            try {
                if (!repository.getCategory) throw new Error();
                return await repository.getCategory(id);
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting category'));
            }
        };

        return {execute};
    },
    getAllCategories(dependencies: Dependable<Product>): {execute: () => Promise<ProductCategory[]>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const execute = async (): Promise<ProductCategory[]> => {
            try {
                if (!repository.getAllCategories) throw new Error();
                return await repository.getAllCategories();
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error getting all categories'));
            }
        };

        return {execute};
    },
    deleteAllCategories(dependencies: Dependable<Product>): {execute: () => Promise<ProductCategory[]>} {
        const {
            repository
        } = dependencies;

        if (!repository) throw new Error('repository should be passed as a dependency');

        const execute = async (): Promise<ProductCategory[]> => {
            try {
                if (!repository.deleteAllCategories) throw new Error();
                return await repository.deleteAllCategories();
            } catch (error) {
                return Promise.reject(generateRejection((error as Error).message || 'Error deleting all categories'));
            }
        };

        return {execute};
    }
};

Object.freeze(ProductUseCase);
export default ProductUseCase;
