import express from 'express';
import routes from './routes/api.route';
import { Liquid } from 'liquidjs';
import path from 'path';

// ANCHOR: - Top Level Constants

const app = express();
const port = 3000;
const engine = new Liquid();

// ANCHOR: - View Engine

app.engine('liquid', engine.express());
app.set('views', path.join(__dirname, '/views'));

// ANCHOR: - Middleware

app.use('/api', routes);

// ANCHOR: - Routes

app.get('/', (_: express.Request, res: express.Response): void => {
    res.render('index.liquid', { appName: 'image-processing-api' });
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((_: express.Request, res: express.Response, next: express.NextFunction): void => {
    res.status(404).render('404.liquid');
});

// Start the server...

app.listen(port, (): void => {
    console.log(`Server started at localhost:${port}`);
});

export default app;
