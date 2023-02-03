import express from 'express';
import {AuthServiceController} from '../../../../controllers/services';
import {User} from '../../../../entities';
import {Dependable} from '../../../../entities/protocols';

const AuthServiceRouter = (dependencies: Dependable<User>): express.Router => {
    const router = express.Router();
    const controller = AuthServiceController(dependencies);

    router.route('/sign-up').post(controller.signUp);
    router.route('/sign-in').post(controller.signIn);
    router.route('/sign-out').post(controller.signOut);

    return router;
};

export default AuthServiceRouter;
