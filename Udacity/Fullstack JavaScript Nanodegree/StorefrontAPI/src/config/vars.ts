import dotenv from 'dotenv';
import {Environment, Variables} from '../entities/config';

dotenv.config();

const vars: Variables = {
    port: ((process.env.PORT as unknown) as number) || 3000,
    apiPrefix: process.env.API_PRE || '/api/v1',
    environment: process.env.ENV as Environment || 'test',
    bcryptSecret: process.env.BCRYPT_SECRET as string,
    bcryptRounds: Number(process.env.BCRYPT_ROUNDS) || 10,
    accessSecret: process.env.ACCESS_SECRET as string,
    refreshSecret: process.env.REFRESH_SECRET as string,
    postgresHost: process.env.POSTGRES_HOST || '127.0.0.1',
    postgresProductionDatabase: process.env.POSTGRES_DB_PROD || 'storefront_prod',
    postgresDevelopmentDatabase: process.env.POSTGRES_DB_TEST || 'storefront_test',
    postgresUser: process.env.POSTGRES_USER || 'test_user',
    postgresPassword: process.env.POSTGRES_PASSWORD || 'password123'
};

export default vars;
