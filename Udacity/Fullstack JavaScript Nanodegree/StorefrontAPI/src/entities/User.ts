import {UserLevel} from './enums';

type User = {
    id?: string;
    firstName?: string;
    lastName?: string;
    username?: string;
    password?: string;
    level?: UserLevel
};

export default User;
