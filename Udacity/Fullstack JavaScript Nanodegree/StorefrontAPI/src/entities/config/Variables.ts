import Environment from './Environment';

type Variables = {
    port: number,
    apiPrefix: string;
    environment: Environment;
    bcryptSecret: string;
    bcryptRounds: number;
    accessSecret: string;
    refreshSecret: string;
    postgresHost: string;
    postgresProductionDatabase: string;
    postgresDevelopmentDatabase: string;
    postgresUser: string;
    postgresPassword: string;
};

export default Variables;
