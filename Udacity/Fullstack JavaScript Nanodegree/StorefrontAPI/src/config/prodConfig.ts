import {Configuration, Environment} from '../entities/config';
import {PostgresDatabase} from '../frameworks/databases/postgres';
import {UsersRepository, ProductsRepository, OrdersRepository} from '../frameworks/repositories/postgres';
import {OrderUseCase, ProductUseCase, UserUseCase} from '../use-cases';

const prodConfig: Configuration = {
    type: Environment.Production,
    useCases: {
        UserUseCase,
        ProductUseCase,
        OrderUseCase
    },
    repositories: {
        UsersRepository,
        ProductsRepository,
        OrdersRepository
    },
    database: PostgresDatabase
};

Object.freeze(prodConfig);
export default prodConfig;
