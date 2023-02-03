import {User} from '../../../entities';
import {DataStorable} from '../../../entities/protocols';
import {v4 as uuid} from 'uuid';
import {MockDatabase} from '../../databases/mock';
import {UserSession} from '../../../entities/auxiliary';

const UsersRepository: DataStorable<User> = {
    async add(user: User, options?): Promise<User> {
        if (!user.id) {
            user.id = uuid();
        }

        MockDatabase.users.push(user);

        if (options?.protected) {
            return {
                username:user.username,
                password:(user.password as string).replace(/./g, '*'),
                firstName:user.firstName,
                lastName:user.lastName
            };
        }
        return user;
    },
    async update(user: User, options?): Promise<User | null> {
        const index = MockDatabase.users.findIndex((item: User) => item.id === user.id);
        if (index < 0) return null;

        MockDatabase.users[index] = user;

        if (options?.protected) {
            return {
                username:user.username,
                password:(user.password as string).replace(/./g, '*'),
                firstName:user.firstName,
                lastName:user.lastName
            };
        }
        return user;
    },
    async delete(id: string | number, options?): Promise<User | null> {
        const index = MockDatabase.users.findIndex((item: User) => item.id === id);
        if (index < 0) return null;

        const _user = MockDatabase.users.splice(index, 1)[0];

        if (options?.protected) {
            return {
                username:_user.username,
                password:(_user.password as string).replace(/./g, '*'),
                firstName:_user.firstName,
                lastName:_user.lastName
            };
        }
        return _user;
    },
    async getById(id: string, options?): Promise<User | null> {
        const user = MockDatabase.users.find((item: User) => item.id === id);
        if (!user) return null;

        if (options?.protected) {
            return {
                username:user.username,
                password:(user.password as string).replace(/./g, '*'),
                firstName:user.firstName,
                lastName:user.lastName
            };
        }
        return user;
    },
    async getUserByUsername(username: string, options?): Promise<User | null> {
        const user = MockDatabase.users.find((item: User) => item.username === username);
        if (!user) return null;

        if (options?.protected) {
            return {
                username:user.username,
                password:(user.password as string).replace(/./g, '*'),
                firstName:user.firstName,
                lastName:user.lastName
            };
        }
        return user;
    },
    async getAll(options?): Promise<User[]> {
        if (options?.protected) {
            return MockDatabase.users.map((user: User) => ({
                username:user.username,
                password:(user.password as string).replace(/./g, '*'),
                firstName:user.firstName,
                lastName:user.lastName
            }));
        }
        return MockDatabase.users;
    },
    async deleteAll(options?): Promise<User[]> {
        const users = MockDatabase.users;
        MockDatabase.users.length = 0;
        if (options?.protected) {
            return users.map((user: User) => ({
                username:user.username,
                password:(user.password as string).replace(/./g, '*'),
                firstName:user.firstName,
                lastName:user.lastName
            }));
        }
        return users;
    },
    async authenticate(username: string, password: string): Promise<User | null> {
        const user = MockDatabase.users.find((item: User) => item.username === username);
        if (!user || user.password !== password) {
            return null;
        }

        return user;
    },
    async addSession(secret: string, userId: string): Promise<UserSession> {
        const possibleUserSessionIndex = MockDatabase.userSessions.findIndex((session: UserSession) => {
            return session.userId = userId;
        });

        if (possibleUserSessionIndex >= 0) {
            MockDatabase.userSessions.splice(possibleUserSessionIndex, 1);
        }

        const session: UserSession = {
            id: MockDatabase.userSessions.length,
            secret,
            userId
        };

        MockDatabase.userSessions.push(session);
        return session;
    },
    async deleteSession(secret: string, userId: string): Promise<UserSession | null> {
        const index = MockDatabase.userSessions.findIndex((session: UserSession) => {
            return session.secret === secret && session.userId === userId;
        });
        if (index < 0) return null;

        const session = MockDatabase.userSessions.splice(index, 1)[0];
        return session;
    },
    async getSession(sessionId: number): Promise<UserSession | null> {
        const session = MockDatabase.userSessions.find((item: UserSession) => item.id === sessionId);
        if (!session) return null;
        return session;
    },
    async getSessionForUser(userId: string): Promise<UserSession | null> {
        const session = MockDatabase.userSessions.find((item: UserSession) => item.userId === userId);
        if (!session) return null;
        return session;
    },
    async getAllSessions(): Promise<UserSession[]> {
        return MockDatabase.userSessions;
    },
    async deleteAllSessions(): Promise<UserSession[]> {
        const sessions = MockDatabase.userSessions;
        MockDatabase.userSessions.length = 0;
        return sessions;
    }
};

Object.freeze(UsersRepository);
export default UsersRepository;
