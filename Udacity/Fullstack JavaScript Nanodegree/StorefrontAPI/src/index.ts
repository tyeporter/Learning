import express from 'express';
import {vars} from './config';
import chalk from 'chalk';
import cookieParser from 'cookie-parser';
import routes from './frameworks/express/routes';
import {mockConfig,testConfig,prodConfig} from './config';
import {NotFoundErrorHandler, ValidationErrorHandler} from './frameworks/express/error-handlers';
import {Environment} from './entities/config';
import {Initializable} from './entities/protocols';

const app = express();

(async (): Promise<void> => {
    app.use(express.json());
    app.use(express.urlencoded({extended:true}));
    app.use(cookieParser());

    try {
        console.log(chalk.blue('Running ENV: ' + vars.environment));
        switch(vars.environment) {
            case Environment.Mock:
                await (mockConfig.database as Initializable).initialize();
                app.use(vars.apiPrefix, routes(mockConfig));
                break;
            case Environment.Test:
                app.use(vars.apiPrefix, routes(testConfig));
                break;
            case Environment.Production:
                app.use(vars.apiPrefix, routes(prodConfig));
                break;
            default:
                break;
        }

        app.use(ValidationErrorHandler);
        app.use(NotFoundErrorHandler);

        app.listen(vars.port, () => {
            console.log(chalk.green(`Starting server at http://localhost:${vars.port}`));
        });
    } catch (error) {
        console.log(chalk.red('Unable to start server due to mock database initialization failure.'));
        return Promise.reject(error);
    }
})();

export default app;

