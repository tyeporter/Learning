import express from 'express';
import {Order} from '../entities';
import {Dependable} from '../entities/protocols';
import {MiddlewareFuncAsync, ResponseStatusCode} from '../entities/networking';
import {generateOKResponse, generateRequestError, generateServerError} from './helper-functions';

const OrderController = (dependencies: Dependable<Order>): {
    addOrder: MiddlewareFuncAsync,
    updateOrder: MiddlewareFuncAsync,
    deleteOrder: MiddlewareFuncAsync,
    getOrderById: MiddlewareFuncAsync,
    getAllOrders: MiddlewareFuncAsync
} => {
    const addOrder = async (
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
                status,
                userId,
            } = request.body as Order;

            const addedOrder = await useCase.add(dependencies).execute({status,userId});

            response.json(generateOKResponse(addedOrder));
        } catch (error) {
            next(error);
        }
    };

    const updateOrder = async (
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
                status,
                userId,
            } = request.body as Order;

            const updatedOrder = await useCase.update(dependencies).execute({id,status,userId});
            if (!updatedOrder) throw generateServerError('updating order');

            response.json(generateOKResponse(updatedOrder));
        } catch (error) {
            next(error);
        }
    };

    const deleteOrder = async (
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

            const deletedOrder = await useCase.delete(dependencies).execute(id);
            if (!deletedOrder) throw generateServerError('deleting order');

            response.json(generateOKResponse(deletedOrder));
        } catch (error) {
            next(error);
        }
    };

    const getOrderById = async (
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

            const returnedOrder = await useCase.getById(dependencies).execute(id);
            if (!returnedOrder) throw generateRequestError('No order with such id', ResponseStatusCode.BadRequest);

            response.json(generateOKResponse(returnedOrder));
        } catch (error) {
            next(error);
        }
    };

    const getAllOrders = async (
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
            const returnedOrders = await useCase.getAll(dependencies).execute();

            response.json(generateOKResponse(
                returnedOrders.length ?
                returnedOrders :
                'No orders to show'
            ));
        } catch (error) {
            next(error);
        }
    };

    return {
        addOrder,
        updateOrder,
        deleteOrder,
        getOrderById,
        getAllOrders
    };
};

export default OrderController;
