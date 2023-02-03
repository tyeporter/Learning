import {Pool} from 'pg';
import Order from '../Order';
import Product from '../Product';
import {BusinessUsable, DataStorable, Initializable} from '../protocols';
import User from '../User';
import Environment from './Environment';

type Configuration = {
    type: Environment,
    useCases: {
        UserUseCase?: BusinessUsable<User>,
        ProductUseCase?: BusinessUsable<Product>,
        OrderUseCase?: BusinessUsable<Order>
    },
    repositories: {
        UsersRepository?: DataStorable<User>,
        ProductsRepository?: DataStorable<Product>,
        OrdersRepository?: DataStorable<Order>
    },
    database: Initializable | Pool
};

export default Configuration;
