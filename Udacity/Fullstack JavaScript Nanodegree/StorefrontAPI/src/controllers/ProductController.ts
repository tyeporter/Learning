import express from 'express';
import {Product} from '../entities';
import {Dependable} from '../entities/protocols';
import {MiddlewareFuncAsync, ResponseStatusCode} from '../entities/networking';
import {generateOKResponse, generateRequestError, generateServerError} from './helper-functions';

const ProductController = (dependencies: Dependable<Product>): {
    addProduct: MiddlewareFuncAsync,
    updateProduct: MiddlewareFuncAsync,
    deleteProduct: MiddlewareFuncAsync,
    getProductById: MiddlewareFuncAsync,
    getAllProducts: MiddlewareFuncAsync
} => {
    const addProduct = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const {
            useCase
        } = dependencies;

        if (!useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        try {
            const {
                name,
                description,
                price,
            } = request.body as Product;

            const addedProduct = await useCase.add(dependencies).execute({name,description,price});

            response.json(generateOKResponse(addedProduct));
        } catch (error) {
            next(error);
        }
    };

    const updateProduct = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const {
            useCase
        } = dependencies;

        if (!useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        try {
            const {
                id,
                name,
                description,
                price,
            } = request.body as Product;

            const updatedProduct = await useCase.update(dependencies).execute({id,name,description,price});
            if (!updatedProduct) throw generateServerError('updating product');

            response.json(generateOKResponse(updatedProduct));
        } catch (error) {
            next(error);
        }
    };

    const deleteProduct = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const {
            useCase
        } = dependencies;

        if (!useCase) {
            throw new Error('use-case should be passed as s dependency');
        }

        try {
            const id = request.params.id as string;

            const deletedProduct = await useCase.delete(dependencies).execute(id);
            if (!deletedProduct) throw generateServerError('deleting product');

            response.json(generateOKResponse(deletedProduct));
        } catch (error) {
            next(error);
        }
    };

    const getProductById = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const {
            useCase
        } = dependencies;

        if (!useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        try {
            const id = request.params.id as string;

            const returnedProduct = await useCase.getById(dependencies).execute(id);
            if (!returnedProduct) throw generateRequestError('No product with such id', ResponseStatusCode.BadRequest);

            response.json(generateOKResponse(returnedProduct));
        } catch (error) {
            next(error);
        }
    };

    const getAllProducts = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const {
            useCase
        } = dependencies;

        if (!useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        try {
            const returnedProducts = await useCase.getAll(dependencies).execute();

            response.json(generateOKResponse(
                returnedProducts.length ?
                returnedProducts :
                'No products to show'
            ));
        } catch (error) {
            next(error);
        }
    };

    return {
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getAllProducts
    };
};

export default ProductController;
