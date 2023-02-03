import {Configuration, Environment} from '../entities/config';
import {MockDatabase} from '../frameworks/databases/mock';
import {UsersRepository, ProductsRepository, OrdersRepository} from '../frameworks/repositories/mock';
import {ProductUseCase, UserUseCase, OrderUseCase} from '../use-cases';

const mockConfig: Configuration = {
    type: Environment.Mock,
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
    database: MockDatabase
};

Object.freeze(mockConfig);
export default mockConfig;
