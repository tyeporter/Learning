import vars from '../../../config/vars';
import {Pool} from "pg";
import {Environment} from '../../../entities/config';

const PostgresDatabase = new Pool({
    host: vars.postgresHost,
    database: (vars.environment === Environment.Test ? vars.postgresDevelopmentDatabase : vars.postgresProductionDatabase),
    user: vars.postgresUser,
    password: vars.postgresPassword
});

export default PostgresDatabase;
