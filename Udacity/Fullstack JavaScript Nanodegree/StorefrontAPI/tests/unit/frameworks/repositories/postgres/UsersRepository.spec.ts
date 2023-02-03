import {v4 as uuid} from 'uuid';
import {User} from '../../../../../src/entities';
import {UsersRepository} from '../../../../../src/frameworks/repositories/postgres';

describe('Postgres User Repository Tests', (): void => {
    let testUser: User;

    beforeAll((): void => {
        testUser = {
            firstName: 'Billy',
            lastName: 'Bob',
            username: '@billybob',
            password: 'password123',
            level: 0
        };
    });

    afterEach(async (): Promise<void> => {
        await UsersRepository.deleteAllSessions?.();
        await UsersRepository.deleteAll();
    });

    describe('add() Tests', (): void => {
        it('Adding user should add and return user', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);

            expect(addedUser.id).toBeDefined();
            expect(addedUser.firstName).toBe(testUser.firstName);
            expect(addedUser.lastName).toBe(testUser.lastName);
            expect(addedUser.username).toBe(testUser.username);
            expect(addedUser.level).toBe(testUser.level);
        });

        it('Adding user with protected option should return partial options', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser,{protected:true});

            expect(addedUser.id).toBeUndefined();
            expect(addedUser.firstName).toBe(testUser.firstName);
            expect(addedUser.lastName).toBe(testUser.lastName);
            expect(addedUser.username).toBe(testUser.username);
            expect(addedUser.level).toBeUndefined();
        });
    });

    describe('update() Tests', (): void => {
        it('Updating user should update and return user', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const updatedUser = await UsersRepository.update({
                ...addedUser,
                firstName:'Sammy',
                lastName:'Sosa'
            }) as User;

            expect(updatedUser.id).toBe(addedUser.id);
            expect(updatedUser.firstName).not.toBe(addedUser.firstName);
            expect(updatedUser.lastName).not.toBe(addedUser.lastName);
            expect(updatedUser.username).toBe(addedUser.username);
            expect(updatedUser.level).toBe(addedUser.level);
        });

        it('Updating user with protected option should return partial user', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const updatedUser = await UsersRepository.update({
                ...addedUser,
                firstName:'Sammy',
                lastName:'Sosa'
            }, {protected:true}) as User;

            expect(updatedUser.id).toBeUndefined();
            expect(updatedUser.firstName).not.toBe(addedUser.firstName);
            expect(updatedUser.lastName).not.toBe(addedUser.lastName);
            expect(updatedUser.username).toBe(addedUser.username);
            expect(updatedUser.password).toBe(addedUser.password?.replace(/./g, '*'));
            expect(updatedUser.level).toBeUndefined();
        });

        it('Updating user with invalid id should return null', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);

            const updatedUser = await UsersRepository.update({
                ...addedUser,
                id: uuid()
            }) as User;

            expect(updatedUser).toBeNull();
        });
    });

    describe('delete() Tests', (): void => {
        it('Deleting user should delete and return user', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const deletedUser = await UsersRepository.delete((addedUser.id as string)) as User;

            expect(deletedUser.id).toBe(addedUser.id);
            expect(deletedUser.firstName).toBe(addedUser.firstName);
            expect(deletedUser.lastName).toBe(addedUser.lastName);
            expect(deletedUser.username).toBe(addedUser.username);
            expect(deletedUser.password).toBe(addedUser.password);
            expect(deletedUser.level).toBe(addedUser.level);
        });

        it('Deleting user with protected options should return partial user', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const deletedUser = await UsersRepository.delete((addedUser.id as string),{protected:true}) as User;

            expect(deletedUser.id).toBeUndefined();
            expect(deletedUser.firstName).toBe(addedUser.firstName);
            expect(deletedUser.lastName).toBe(addedUser.lastName);
            expect(deletedUser.username).toBe(addedUser.username);
            expect(deletedUser.password).toBe(addedUser.password?.replace(/./g, '*'));
            expect(deletedUser.level).toBeUndefined();
        });

        it('Deleting user with invalid id should return null', async (): Promise<void> => {
            const deletedUser = await UsersRepository.delete(uuid());

            expect(deletedUser).toBeNull();
        });
    });

    describe('getById() Tests', (): void => {
        it('Getting user by id should return user', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const returnedUser = await UsersRepository.getById((addedUser.id as string)) as User;

            expect(returnedUser.id).toBe(addedUser.id);
            expect(returnedUser.firstName).toBe(addedUser.firstName);
            expect(returnedUser.lastName).toBe(addedUser.lastName);
            expect(returnedUser.username).toBe(addedUser.username);
            expect(returnedUser.password).toBe(addedUser.password);
            expect(returnedUser.level).toBe(addedUser.level);
        });

        it('Getting user by id with protected option should return partial user', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const returnedUser = await UsersRepository.getById((addedUser.id as string), {protected:true}) as User;

            expect(returnedUser.id).toBeUndefined();
            expect(returnedUser.firstName).toBe(addedUser.firstName);
            expect(returnedUser.lastName).toBe(addedUser.lastName);
            expect(returnedUser.username).toBe(addedUser.username);
            expect(returnedUser.password).toBe(addedUser.password?.replace(/./g, '*'));
            expect(returnedUser.level).toBeUndefined();
        });

        it('Getting user with invalid id should return null', async (): Promise<void> => {
            await UsersRepository.add(testUser);
            const returnedUser = await UsersRepository.getById(uuid());

            expect(returnedUser).toBeNull();
        });
    });

    describe('getByUsername() Tests', (): void => {
        it('Getting user by username should return user', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const returnedUser = await UsersRepository.getUserByUsername?.((addedUser.username as string)) as User;

            expect(returnedUser.id).toBe(addedUser.id);
            expect(returnedUser.firstName).toBe(addedUser.firstName);
            expect(returnedUser.lastName).toBe(addedUser.lastName);
            expect(returnedUser.username).toBe(addedUser.username);
            expect(returnedUser.password).toBe(addedUser.password);
            expect(returnedUser.level).toBe(addedUser.level);
        });

        it('Getting user by username with protected option should return partial user', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const returnedUser = await UsersRepository.getUserByUsername?.((addedUser.username as string), {protected:true}) as User;

            expect(returnedUser.id).toBeUndefined();
            expect(returnedUser.firstName).toBe(addedUser.firstName);
            expect(returnedUser.lastName).toBe(addedUser.lastName);
            expect(returnedUser.username).toBe(addedUser.username);
            expect(returnedUser.password).toBe(addedUser.password?.replace(/./g, '*'));
            expect(returnedUser.level).toBeUndefined();
        });

        it('Getting user by invalid username should return null', async (): Promise<void> => {
            await UsersRepository.add(testUser);
            const returnedUser = await UsersRepository.getUserByUsername?.('invalid_username');
            expect(returnedUser).toBeNull();
        });
    });

    describe('getAll() Tests', (): void => {
        it('Getting all users should return array of users', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const users = await UsersRepository.getAll();

            expect(users.length).toBe(1);
            expect(users[0]).toEqual(addedUser);
        });

        it('Getting all users with protected option should return array of partial users', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const users = await UsersRepository.getAll({protected:true});

            expect(users.length).toBe(1);
            expect(users[0].id).toBeUndefined();
            expect(users[0].firstName).toBe(addedUser.firstName);
            expect(users[0].lastName).toBe(addedUser.lastName);
            expect(users[0].username).toBe(addedUser.username);
            expect(users[0].password).toBe(addedUser.password?.replace(/./g, '*'));
            expect(users[0].level).toBeUndefined();
        });
    });

    describe('deleteAll() Tests', (): void => {
        it('Deleting all users should return array of users', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const users = await UsersRepository.deleteAll();

            expect(users.length).toBe(1);
            expect(users[0]).toEqual(addedUser);
        });

        it('Deleting all users with protected option should return array of partial users', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const users = await UsersRepository.deleteAll({protected:true});

            expect(users.length).toBe(1);
            expect(users[0].id).toBeUndefined();
            expect(users[0].firstName).toBe(addedUser.firstName);
            expect(users[0].lastName).toBe(addedUser.lastName);
            expect(users[0].username).toBe(addedUser.username);
            expect(users[0].password).toBe(addedUser.password?.replace(/./g, '*'));
            expect(users[0].level).toBeUndefined();
        });
    });

    describe('authenticate() Tests', (): void => {
        it('Authenticated user should be returned', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const returnedUser = await UsersRepository.authenticate?.((addedUser.username as string),(addedUser.password as string));
            expect(returnedUser).toBeDefined();
        });

        it('Authenticated user with invalid password should return null', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const returnedUser = await UsersRepository.authenticate?.((addedUser.username as string),'invalid_password');
            expect(returnedUser).toBeNull();
        });
    });

    describe('addSession() Tests', (): void => {
        it('Added session should be returned', async (): Promise<void> => {
            const secret = uuid();
            const addedUser = await UsersRepository.add(testUser);
            const addedSession = await UsersRepository.addSession?.(secret,(addedUser.id as string));

            expect(addedSession?.id).toBeDefined();
            expect(addedSession?.secret).toBe(secret);
            expect(addedSession?.userId).toBe(addedUser.id);
        });
    });

    describe('deleteSession() Tests', (): void => {
        it('Deleted session should be returned', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedSession = await UsersRepository.addSession?.(uuid(),(addedUser.id as string));
            const deletedSession = await UsersRepository.deleteSession?.((addedSession?.secret as string),(addedSession?.userId as string));

            expect(deletedSession?.id).toBe(addedSession?.id);
            expect(deletedSession?.secret).toBe(addedSession?.secret);
            expect(deletedSession?.userId).toBe(addedSession?.userId);
        });

        it('Deleted session with invalid secret should return null', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedSession = await UsersRepository.addSession?.(uuid(),(addedUser.id as string));
            const deletedSession = await UsersRepository.deleteSession?.('invalid_secret',(addedSession?.userId as string));
            expect(deletedSession).toBeNull();
        });
    });

    describe('getSession() Tests', (): void => {
        it('Retrieved session should be returned', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedSession = await UsersRepository.addSession?.(uuid(),(addedUser.id as string));
            const returnedSession = await UsersRepository.getSession?.((addedSession?.id as number));

            expect(returnedSession?.id).toBe(addedSession?.id);
            expect(returnedSession?.secret).toBe(addedSession?.secret);
            expect(returnedSession?.userId).toBe(addedSession?.userId);
        });

        it('Retrieved session with invalid id should return null', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            await UsersRepository.addSession?.(uuid(),(addedUser.id as string));
            const returnedSession = await UsersRepository.getSession?.(245);

            expect(returnedSession).toBeNull();
        });
    });

    describe('getSessionForUser() Tests', (): void => {
        it('Retrieved session by user id should be returned', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedSession = await UsersRepository.addSession?.(uuid(),(addedUser.id as string));
            const returnedSession = await UsersRepository.getSessionForUser?.((addedUser.id as string));

            expect(returnedSession?.id).toBe(addedSession?.id);
            expect(returnedSession?.secret).toBe(addedSession?.secret);
            expect(returnedSession?.userId).toBe(addedSession?.userId);
        });

        it('Retrieved session with invalid user id should return null', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            await UsersRepository.addSession?.(uuid(),(addedUser.id as string));
            const returnedSession = await UsersRepository.getSessionForUser?.(uuid());
            expect(returnedSession).toBeNull();
        });
    });

    describe('getAllSessions() Tests', (): void => {
        it('Getting all sessions should return an array of sessions', async (): Promise<void> => {
            const addedUser = await UsersRepository.add(testUser);
            const addedSession = await UsersRepository.addSession?.(uuid(),(addedUser.id as string));
            const sessions = await UsersRepository.getAllSessions?.();

            expect(sessions?.length).toBe(1);
            expect(sessions?.[0]).toEqual(addedSession);
        });
    });
});
