import bcrypt from 'bcrypt';
import vars from '../../../config/vars';
import {User} from '../../../entities';
import {DataStorable} from '../../../entities/protocols';
import {PostgresDatabase} from '../../databases/postgres';
import {UserSession} from '../../../entities/auxiliary';

const selectClause = 'SELECT id, username, password_digest AS "password", first_name AS "firstName", last_name AS "lastName", level';
const returningClause = 'RETURNING id, username, first_name AS "firstName", last_name AS "lastName", level';
const sessionSelectClause = 'SELECT id, secret, user_id AS "userId"';
const sessionReturningClause = 'RETURNING id, secret, user_id AS "userId"';
const protectify = (user: User): User => {
    delete user.id;
    delete user.password;
    delete user.level;
    return user;
};

const UsersRepository: DataStorable<User> = {
    async add(user: User, options?): Promise<User> {
        const {username,firstName,lastName,level} = user;
        try {
            const conn = await PostgresDatabase.connect();
            const hash = bcrypt.hashSync(user.password + vars.bcryptSecret, vars.bcryptRounds);
            const result = await conn.query(
                `INSERT INTO users (username, password_digest, first_name, last_name, level) VALUES ($1, $2, $3, $4, $5) ${returningClause}`,
                [username,hash,firstName,lastName,level]
            );
            conn.release();

            const _user = result.rows[0] as User;
            if (options?.protected) return protectify({..._user});
            return _user;
        } catch (error) {
            throw new Error('Error while adding user');
        }
    },
    async update(user: User, options?): Promise<User | null> {
        const {id,username,firstName,lastName} = user;
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `UPDATE users SET username = ($1), first_name = ($2), last_name = ($3) WHERE id = ($4) ${returningClause}`,
                [username,firstName,lastName,id]
            );

            conn.release();

            if (!result.rows.length) return null;

            const _user = result.rows[0] as User;
            if (options?.protected) return protectify({..._user});
            return _user;
        } catch (error) {
            throw new Error('Error while updating user');
        }
    },
    async delete(id: string | number, options?): Promise<User | null> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `${selectClause} FROM users WHERE id = ($1)`,
                [id]
            );

            if (result.rows.length) {
                const result = await conn.query(
                    `DELETE FROM users WHERE id = ($1) ${returningClause}`,
                    [id]
                );

                const user = result.rows[0] as User;
                if (options?.protected) return protectify({...user});
                return user;
            }

            conn.release();
            return null;
        } catch (error) {
            throw new Error('Error while deleting user');
        }
    },
    async getById(id: string, options?): Promise<User | null> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `${selectClause} FROM users WHERE id = ($1)`,
                [id]
            );
            conn.release();

            if (!result.rows.length) return null;

            const user = result.rows[0] as User;
            if (options?.protected) return protectify({...user});
            delete user.password;
            return user;
        } catch (error) {
            throw new Error('Error while getting user by id');
        }
    },
    async getUserByUsername(username: string, options?): Promise<User | null> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `${selectClause} FROM users WHERE username = ($1)`,
                [username]
            );
            conn.release();

            if (!result.rows.length) return null;

            const user = result.rows[0] as User;
            if (options?.protected) return protectify({...user});
            delete user.password;
            return user;
        } catch (error) {
            throw new Error('Error getting user by username');
        }
    },
    async getAll(options?): Promise<User[]> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(`${selectClause} FROM users`);
            conn.release();
            if (options?.protected) {
                return result.rows.map((user: User) => protectify({...user}));
            }

            return result.rows.map((user: User) => {
                delete user.password;
                return user;
            });
        } catch (error) {
            throw new Error('Error while getting all users');
        }
    },
    async deleteAll(options?): Promise<User[]> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(`DELETE FROM users ${returningClause}`);
            conn.release();
            if (options?.protected) {
                return result.rows.map((user: User) => protectify({...user}));
            }

            return result.rows.map((user: User) => {
                delete user.password;
                return user;
            });
        } catch (error) {
            throw new Error('Error while deleting all users');
        }
    },
    async authenticate(username: string, password: string): Promise<User | null> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `${selectClause} FROM users WHERE username = ($1)`,
                [username]
            );
            conn.release();

            if (result.rows.length) {
                const user = result.rows[0] as User;
                if (bcrypt.compareSync(password + vars.bcryptSecret, (user.password as string))) {
                    delete user.password;
                    return user;
                }
                return null;
            }
            return null;
        } catch (error) {
            throw new Error('Error authenticating user');
        }
    },
    async addSession(secret: string, userId: string): Promise<UserSession> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `INSERT INTO user_sessions (secret, user_id) VALUES ($1, $2) ${sessionReturningClause}`,
                [secret,userId]
            );
            conn.release();
            return result.rows[0];
        } catch (error) {
            throw new Error('Error creating new session for user');
        }
    },
    async deleteSession(secret: string, userId: string): Promise<UserSession | null> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `DELETE FROM user_sessions WHERE user_id = ($1) AND secret = ($2) ${sessionReturningClause}`,
                [userId,secret]
            );
            conn.release();
            return result.rows.length ? result.rows[0] : null;
        } catch (error) {
            throw new Error('Error deleting session for user');
        }
    },
    async getSession(sessionId: number): Promise<UserSession | null> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `${sessionSelectClause} FROM user_sessions WHERE id = ($1)`,
                [sessionId]
            );
            conn.release();
            return result.rows.length ? result.rows[0] : null;
        } catch (error) {
            throw new Error('Error getting user session by id');
        }
    },
    async getSessionForUser(userId: string): Promise<UserSession | null> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(
                `${sessionSelectClause} FROM user_sessions WHERE user_id = ($1)`,
                [userId]
            );
            conn.release();
            return result.rows.length ? result.rows[0] : null;
        } catch (error) {
            throw new Error('Error getting user session by user id');
        }
    },
    async getAllSessions(): Promise<UserSession[]> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(`${sessionSelectClause} FROM user_sessions`);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error('Error getting user sessions');
        }
    },
    async deleteAllSessions(): Promise<UserSession[]> {
        try {
            const conn = await PostgresDatabase.connect();
            const result = await conn.query(`DELETE FROM user_sessions ${sessionReturningClause}`);
            conn.release();
            return result.rows;
        } catch (error) {
            throw new Error('Error getting user sessions');
        }
    }
};

Object.freeze(UsersRepository);
export default UsersRepository;
