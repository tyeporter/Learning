import express from 'express';
import {Order, Product, User} from '../../entities';
import {Configuration} from '../../entities/config';
import {OrderStatus} from '../../entities/enums';
import {MiddlewareFuncAsync, ResponseStatusCode, TokenType} from '../../entities/networking';
import {Dependable} from '../../entities/protocols';
import {checkToken, generateOKResponse, generateRequestError, generateServerError, generateToken} from '../helper-functions';

const CustomerServiceController = (dependencies: Configuration): {
    getAccount: MiddlewareFuncAsync,
    updateAccount: MiddlewareFuncAsync,
    deleteAccount: MiddlewareFuncAsync,
    getCart: MiddlewareFuncAsync,
    addItemToCart: MiddlewareFuncAsync,
    removeItemFromCart: MiddlewareFuncAsync,
    getOrders: MiddlewareFuncAsync,
    getOrderById: MiddlewareFuncAsync,
    getProducts: MiddlewareFuncAsync,
    getProductCategories: MiddlewareFuncAsync,
    getProductById: MiddlewareFuncAsync,
    getProductsByCategory: MiddlewareFuncAsync,
    checkout: MiddlewareFuncAsync
} => {
    const getAccount = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const orderDependencies: Dependable<Order> = {
            repository: dependencies.repositories.OrdersRepository,
            useCase: dependencies.useCases.OrderUseCase
        };

        if (!orderDependencies.useCase) {
            throw new Error('use-case(s) should be passed as a dependency');
        }

        const {useCase} = orderDependencies;

        try {
            if (!useCase.getOrdersForUser) throw generateServerError('getting account');

            const user = checkToken(TokenType.Refresh, request.cookies[TokenType.Refresh]) as User;
            const returnedUserOrders = await useCase.getOrdersForUser(orderDependencies).execute((user.id as string),{protected:true});
            response.json(generateOKResponse({
                id:user.id,
                username:user.username,
                firstName:user.firstName,
                lastName:user.lastName,
                orders:returnedUserOrders || []
            }));
        } catch (error) {
            next(error);
        }
    };

    const updateAccount = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const userDependencies: Dependable<User> = {
            repository: dependencies.repositories.UsersRepository,
            useCase: dependencies.useCases.UserUseCase
        };

        if (!userDependencies.useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        const {useCase} = userDependencies;

        try {
            const {
                username,
                firstName,
                lastName,
            } = request.body as User;

            if (!(useCase.deleteSession && useCase.addSession)) throw generateServerError('updating user session');

            const sessionToken = request.cookies[TokenType.Refresh] as string;
            const user = checkToken(TokenType.Refresh, sessionToken) as User;

            const updatedUser = await useCase.update(userDependencies).execute({
                id:user.id,username,firstName,lastName,level:user.level
            }, {protected:true}) as User;

            await useCase.deleteSession(userDependencies).execute(sessionToken,(user.id as string));

            const accessToken = generateToken(TokenType.Access, {
                id:user.id,
                username:updatedUser.username,
                firstName:updatedUser.firstName,
                lastName:updatedUser.lastName,
                level:user.level
            });
            const refreshToken = generateToken(TokenType.Refresh, {
                id:user.id,
                username:updatedUser.username,
                firstName:updatedUser.firstName,
                lastName:updatedUser.lastName,
                level:user.level
            });

            await useCase.addSession(userDependencies).execute(refreshToken,(user.id as string));

            // NOTE: - In a production environment, we'd want to add the "secure" and "sameSite" flags
            response.cookie(TokenType.Access, accessToken, {
                maxAge: 3.6e6,
                httpOnly: true,
            });
            response.cookie(TokenType.Refresh, refreshToken, {
                maxAge: 2.592e9,
                httpOnly: true
            });

            response.json(generateOKResponse(updatedUser));
        } catch (error) {
            next(error);
        }
    };

    const deleteAccount = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const userDependencies: Dependable<User> = {
            repository: dependencies.repositories.UsersRepository,
            useCase: dependencies.useCases.UserUseCase
        };

        const orderDependencies: Dependable<Order> = {
            repository: dependencies.repositories.OrdersRepository,
            useCase: dependencies.useCases.OrderUseCase
        };

        if (!(userDependencies.useCase && orderDependencies.useCase)) {
            throw new Error('use-case should be passed as a dependency');
        }

        const userUseCase = userDependencies.useCase;
        const orderUseCase = orderDependencies.useCase;

        try {
            if (!(userUseCase.deleteSession
                && orderUseCase.deleteAllOrdersForUser)) throw generateServerError('deleting account');

            const sessionToken = request.cookies[TokenType.Refresh] as string;
            const user = checkToken(TokenType.Refresh, sessionToken) as User;
            await userUseCase.deleteSession(userDependencies).execute(sessionToken,(user.id as string));
            await userUseCase.delete(userDependencies).execute((user.id as string));

            const orders = await orderUseCase.deleteAllOrdersForUser(orderDependencies).execute((user.id as string));
            if (orders) {
                if (!orderUseCase.deleteAllProductsInOrder) throw generateServerError('deleting account');
                for (const order of orders) {
                    await orderUseCase.deleteAllProductsInOrder(orderDependencies).execute((order.id as number));
                }
            }

            response.clearCookie(TokenType.Access);
            response.clearCookie(TokenType.Refresh);
            response.json(generateOKResponse(`We're sad to see you go ${user.firstName} :(`));
        } catch (error) {
            next(error);
        }
    };

    const getCart = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const orderDependencies: Dependable<Order> = {
            repository: dependencies.repositories.OrdersRepository,
            useCase: dependencies.useCases.OrderUseCase
        };

        if (!orderDependencies.useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        const {useCase} = orderDependencies;

        try {
            if (!(useCase.getActiveOrderForUser && useCase.getProductsInOrder)) throw generateServerError('getting cart');

            const accessToken = request.cookies[TokenType.Access] as string;
            const user = checkToken(TokenType.Access, accessToken) as User;

            const activeOrder = await useCase.getActiveOrderForUser(orderDependencies).execute((user.id as string));
            const activeOrderProducts = await useCase.getProductsInOrder(orderDependencies).execute((activeOrder.id as number));

            response.json(generateOKResponse(
                activeOrderProducts.length ?
                activeOrderProducts :
                'Cart is empty'
            ));
        } catch (error) {
            next(error);
        }
    };

    const addItemToCart = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const orderDependencies: Dependable<Order> = {
            repository: dependencies.repositories.OrdersRepository,
            useCase: dependencies.useCases.OrderUseCase
        };

        if (!orderDependencies.useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        const {useCase} = orderDependencies;

        try {
            if (!(useCase.getActiveOrderForUser && useCase.addProductToOrder)) throw generateServerError('adding item to cart');

            const user = checkToken(TokenType.Refresh, request.cookies[TokenType.Refresh]) as User;

            const activeOrder = await useCase.getActiveOrderForUser(orderDependencies).execute((user.id as string));
            const productId = request.params.productId as string;
            const quantity = Number(request.query.quantity);
            const orderProduct = await useCase.addProductToOrder(orderDependencies).execute(
                quantity,
                (activeOrder.id as number),
                productId
            );
            if (!orderProduct) throw generateRequestError('No product with such id', ResponseStatusCode.BadRequest);

            response.json(generateOKResponse(orderProduct));
        } catch (error) {
            next(error);
        }
    };

    const removeItemFromCart = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const orderDependencies: Dependable<Order> = {
            repository: dependencies.repositories.OrdersRepository,
            useCase: dependencies.useCases.OrderUseCase
        };

        if (!orderDependencies.useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        const {useCase} = orderDependencies;

        try {
            if (!(useCase.getActiveOrderForUser
                && useCase.removeProductFromOrder)) throw generateServerError('removing item from cart');

            const user = checkToken(TokenType.Refresh, request.cookies[TokenType.Refresh]) as User;
            const activeOrder = await useCase.getActiveOrderForUser(orderDependencies).execute((user.id as string));
            const productId = request.params.productId as string;
            const orderProduct = await useCase.removeProductFromOrder(orderDependencies).execute(
                (activeOrder.id as number),
                productId
            );
            if (!orderProduct) throw generateRequestError('No product with such id', ResponseStatusCode.BadRequest);

            response.json(generateOKResponse(orderProduct));
        } catch (error) {
            next(error);
        }
    };

    const getOrders = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const orderDependencies: Dependable<Order> = {
            repository: dependencies.repositories.OrdersRepository,
            useCase: dependencies.useCases.OrderUseCase
        };

        if (!orderDependencies.useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        const {useCase} = orderDependencies;

        try {
            if (!useCase.getOrdersForUser) throw generateServerError('getting orders');

            const user = checkToken(TokenType.Refresh, request.cookies[TokenType.Refresh]) as User;
            const orders = await useCase.getOrdersForUser(orderDependencies).execute((user.id as string),{protected:true});

            response.json(generateOKResponse(
                orders.length ?
                orders :
                'No orders to show'
            ));
        } catch (error) {
            next(error);
        }
    };

    const getOrderById = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const orderDependencies: Dependable<Order> = {
            repository: dependencies.repositories.OrdersRepository,
            useCase: dependencies.useCases.OrderUseCase
        };

        if (!orderDependencies.useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        const {useCase} = orderDependencies;

        try {
            if (!useCase.getUserOrder) throw generateServerError('getting order by id');

            const user = checkToken(TokenType.Refresh, request.cookies[TokenType.Refresh]) as User;
            const orderId = Number(request.params.orderId);
            const order = await useCase.getUserOrder(orderDependencies).execute(
                orderId,
                (user.id as string),
                {protected:true}
            );
            if (!order) {
                next();
                return;
            }

            response.json(generateOKResponse(order));
        } catch (error) {
            next(error);
        }
    };

    const getProducts = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const productDependencies: Dependable<Product> = {
            repository: dependencies.repositories.ProductsRepository,
            useCase: dependencies.useCases.ProductUseCase
        };

        if (!productDependencies.useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        const {useCase} = productDependencies;

        try {
            const products = await useCase.getAll(productDependencies).execute({protected:true});

            response.json(generateOKResponse(
                products.length ?
                products :
                'No products to show'
            ));
        } catch (error) {
            next(error);
        }
    };

    const getProductCategories = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const productDependencies: Dependable<Product> = {
            repository: dependencies.repositories.ProductsRepository,
            useCase: dependencies.useCases.ProductUseCase
        };

        if (!productDependencies.useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        const {useCase} = productDependencies;

        try {
            if (!useCase.getAllCategories) throw generateServerError('getting all categories');
            const categories = await useCase.getAllCategories(productDependencies).execute();

            response.json(generateOKResponse(
                categories.length ?
                categories :
                'No categories to show'
            ));
        } catch (error) {
            next(error);
        }
    };

    const getProductById = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const productDependencies: Dependable<Product> = {
            repository: dependencies.repositories.ProductsRepository,
            useCase: dependencies.useCases.ProductUseCase
        };

        if (!productDependencies.useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        const {useCase} = productDependencies;

        try {
            const productId = request.params.productId as string;
            const product = await useCase.getById(productDependencies).execute(productId);
            if (!product) {
                next();
                return;
            }

            response.json(generateOKResponse(product));
        } catch (error) {
            next(error);
        }
    };

    const getProductsByCategory = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const productDependencies: Dependable<Product> = {
            repository: dependencies.repositories.ProductsRepository,
            useCase: dependencies.useCases.ProductUseCase
        };

        if (!productDependencies.useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        const {useCase} = productDependencies;

        try {
            if (!useCase.getProductsByCategory) throw generateServerError('getting product categories');

            const categoryId = (request.params.categoryId as unknown) as number;
            const products = await useCase.getProductsByCategory(productDependencies).execute(categoryId,{protected:true});

            response.json(generateOKResponse(
                products.length ?
                products :
                'No products to show'
            ));
        } catch (error) {
            next(error);
        }
    };

    const checkout = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const orderDependencies: Dependable<Order> = {
            repository: dependencies.repositories.OrdersRepository,
            useCase: dependencies.useCases.OrderUseCase
        };

        if (!orderDependencies.useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        const {useCase} = orderDependencies;

        try {
            if (!(useCase.getActiveOrderForUser && useCase.getProductsInOrder)) throw generateServerError('checking out');
            const user = checkToken(TokenType.Refresh, request.cookies[TokenType.Refresh]) as User;
            const activeOrder = await useCase.getActiveOrderForUser(orderDependencies).execute((user.id as string));
            const activeOrderProducts = await useCase.getProductsInOrder(orderDependencies).execute((activeOrder.id as number));

            if (!activeOrderProducts.length) throw generateRequestError('Can\'t checkout with an empty cart', ResponseStatusCode.BadRequest);

            const checkedOrder = await useCase.update(orderDependencies).execute({
                id:activeOrder.id,
                status:OrderStatus.Inactive,
                userId:user.id
            });
            if (!checkedOrder) throw generateServerError('with generating response');

            response.json(generateOKResponse(
                `Thank you for your order ${user.username}! Your order number is #${checkedOrder.id}.`
            ));
        } catch (error) {
            next(error);
        }
    };

    return {
        getAccount,
        updateAccount,
        deleteAccount,
        getCart,
        addItemToCart,
        removeItemFromCart,
        getOrders,
        getOrderById,
        getProducts,
        getProductCategories,
        getProductById,
        getProductsByCategory,
        checkout
    };
};

export default CustomerServiceController;
