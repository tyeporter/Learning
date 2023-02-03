import express from 'express';
import {OrderController} from '../../../controllers';
import {Order} from '../../../entities';
import {Dependable} from '../../../entities/protocols';

const OrdersRouter = (dependencies: Dependable<Order>): express.Router => {
    const router = express.Router();
    const controller = OrderController(dependencies);

    router.route('/')
        .get(controller.getAllOrders)
        .post(controller.addOrder)
        .put(controller.updateOrder);

    router.route('/:id')
        .get(controller.getOrderById)
        .delete(controller.deleteOrder);

    return router;
};

export default OrdersRouter;
