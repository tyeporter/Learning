import {OrderStatus} from './enums';

type Order = {
    id?: number;
    status?: OrderStatus;
    userId?: string;
};

export default Order;
