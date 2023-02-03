import express from 'express';
import {ProductController} from '../../../controllers';
import {Product} from '../../../entities';
import {Dependable} from '../../../entities/protocols';

const ProductsRouter = (dependencies: Dependable<Product>): express.Router => {
    const router = express.Router();
    const controller = ProductController(dependencies);

    router.route('/')
        .get(controller.getAllProducts)
        .post(controller.addProduct)
        .put(controller.updateProduct);

    router.route('/:id')
        .get(controller.getProductById)
        .delete(controller.deleteProduct);

    return router;
};

export default ProductsRouter;
