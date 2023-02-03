import {Configuration, Environment} from '../entities/config';
import {PostgresDatabase} from '../frameworks/databases/postgres';
import {UsersRepository, ProductsRepository, OrdersRepository} from '../frameworks/repositories/postgres';
import {OrderUseCase, ProductUseCase, UserUseCase} from '../use-cases';

const testConfig: Configuration = {
    type: Environment.Test,
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

Object.freeze(testConfig);
export default testConfig;
