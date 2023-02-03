import express from 'express';
import {Configuration} from '../../../entities/config';
import {UserLevel} from '../../../entities/enums';
import {Token} from './policies';
import {AuthServiceRouter, CustomerServiceRouter} from './services';
import UsersRouter from './UsersRouter';
import ProductsRouter from './ProductsRouter';
import OrdersRouter from './OrdersRouter';

const routes = (dependencies: Configuration): express.Router => {
    const router = express.Router();

    router.use('/', [
        AuthServiceRouter({
            repository: dependencies.repositories.UsersRepository,
            useCase: dependencies.useCases.UserUseCase
        })
    ]);

    router.use('/users', [
        Token(UserLevel.Admin, {
            repository: dependencies.repositories.UsersRepository,
            useCase: dependencies.useCases.UserUseCase
        }).policy,
        UsersRouter({
            repository: dependencies.repositories.UsersRepository,
            useCase: dependencies.useCases.UserUseCase
        })
    ]);

    router.use('/orders', [
        Token(UserLevel.Admin, {
            repository: dependencies.repositories.UsersRepository,
            useCase: dependencies.useCases.UserUseCase
        }).policy,
        OrdersRouter({
            repository: dependencies.repositories.OrdersRepository,
            useCase: dependencies.useCases.OrderUseCase
        })
    ]);

    router.use('/products',
        Token(UserLevel.Admin, {
            repository: dependencies.repositories.UsersRepository,
            useCase: dependencies.useCases.UserUseCase
        }).policy,
        ProductsRouter({
            repository: dependencies.repositories.ProductsRepository,
            useCase: dependencies.useCases.ProductUseCase
        })
    );

    router.use('/store', [
        Token(UserLevel.Customer, {
            repository: dependencies.repositories.UsersRepository,
            useCase: dependencies.useCases.UserUseCase
        }).policy,
        CustomerServiceRouter(dependencies)
    ]);

    return router;
};

export default routes;
