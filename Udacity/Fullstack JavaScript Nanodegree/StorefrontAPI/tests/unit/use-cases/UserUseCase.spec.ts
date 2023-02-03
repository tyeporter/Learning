import {User} from '../../../src/entities';
import {Dependable} from '../../../src/entities/protocols';
import {UsersRepository} from '../../../src/frameworks/repositories/postgres';
import {UserUseCase} from '../../../src/use-cases';
import {v4 as uuid} from 'uuid';
import {generateToken} from '../../../src/controllers/helper-functions';
import {TokenType} from '../../../src/entities/networking';

describe('User Use-Case Tests', (): void => {
    let testUser: User;
    let dependencies: Dependable<User>;

    beforeAll((): void => {
        testUser = {
            username: '@JSGuy',
            password: 'password123',
            firstName: 'Allen',
            lastName: 'Jones',
            level: 0
        };
        dependencies = {
            repository: UsersRepository
        };
    });

    afterEach(async (): Promise<void> => {
        await UserUseCase.deleteAllSessions?.(dependencies).execute();
        await UserUseCase.deleteAll(dependencies).execute();
    });

    describe('add() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('User should be returned when added', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);

                expect(addedUser).toBeDefined();
                expect(addedUser.id).toBeDefined();
                expect(addedUser.username).toBe(testUser.username);
                expect(addedUser.firstName).toBe(testUser.firstName);
                expect(addedUser.lastName).toBe(testUser.lastName);
                expect(addedUser.level).toBe(testUser.level);
            });

            it('Partial user should be returned when added with protected option', async (): Promise<void> => {
                const partialUser = await UserUseCase.add(dependencies).execute(testUser,{protected:true});

                expect(partialUser).toBeDefined();
                expect(partialUser.id).toBeUndefined();
                expect(partialUser.username).toBe(testUser.username);
                expect(partialUser.firstName).toBe(testUser.firstName);
                expect(partialUser.lastName).toBe(testUser.lastName);
                expect(partialUser.level).toBeUndefined();
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when user added without username', async (): Promise<void> => {
                await expectAsync(UserUseCase.add(dependencies).execute({
                    password:testUser.password,
                    level:testUser.level
                })).toBeRejected();
            });

            it('Promise should be rejected when user added without password', async (): Promise<void> => {
                await expectAsync(UserUseCase.add(dependencies).execute({
                    username:testUser.username,
                    level:testUser.level
                })).toBeRejected();
            });

            it('Promise should be rejected when user added without level', async (): Promise<void> => {
                await expectAsync(UserUseCase.add(dependencies).execute({
                    username:testUser.username,
                    password:testUser.password,
                })).toBeRejected();
            });
        });
    });

    describe('update() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('User should be returned when updated', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const updatedUser = await UserUseCase.update(dependencies).execute({
                    id:addedUser.id,
                    username:addedUser.username,
                    firstName:'George',
                    lastName:addedUser.lastName,
                    level:addedUser.level
                });

                expect(updatedUser).toBeDefined();
                expect(updatedUser?.id).toBe(addedUser.id);
                expect(updatedUser?.username).toBe(addedUser.username);
                expect(updatedUser?.firstName).toBe('George');
                expect(updatedUser?.lastName).toBe(addedUser.lastName);
                expect(updatedUser?.level).toBe(addedUser.level);
            });

            it('Partial user should be returned when updated with protected option', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const updatedUser = await UserUseCase.update(dependencies).execute({
                    id:addedUser.id,
                    username:addedUser.username,
                    firstName:'George',
                    lastName:addedUser.lastName,
                    level:addedUser.level
                },{protected:true});

                expect(updatedUser).toBeDefined();
                expect(updatedUser?.id).toBeUndefined();
                expect(updatedUser?.username).toBe(addedUser.username);
                expect(updatedUser?.firstName).toBe('George');
                expect(updatedUser?.lastName).toBe(addedUser.lastName);
                expect(updatedUser?.level).toBeUndefined();
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when user updated without id', async (): Promise<void> => {
                await expectAsync(UserUseCase.update(dependencies).execute({
                    username:testUser.username,
                    password:testUser.password,
                    firstName:testUser.firstName,
                    lastName:testUser.lastName,
                    level:testUser.level
                })).toBeRejected();
            });

            it('Promise should be rejected when user updated without username', async (): Promise<void> => {
                await expectAsync(UserUseCase.update(dependencies).execute({
                    id: uuid(),
                    password:testUser.password,
                    firstName:testUser.firstName,
                    lastName:testUser.lastName,
                    level:testUser.level
                })).toBeRejected();
            });

            it('Promise should be rejected when user updated without first name', async (): Promise<void> => {
                await expectAsync(UserUseCase.update(dependencies).execute({
                    id: uuid(),
                    username:testUser.username,
                    password:testUser.password,
                    lastName:testUser.lastName,
                    level:testUser.level
                })).toBeRejected();
            });

            it('Promise should be rejected when user updated without last name', async (): Promise<void> => {
                await expectAsync(UserUseCase.update(dependencies).execute({
                    id: uuid(),
                    username:testUser.username,
                    password:testUser.password,
                    firstName:testUser.firstName,
                    level:testUser.level
                })).toBeRejected();
            });

            it('Promise should be rejected when user updated without level', async (): Promise<void> => {
                await expectAsync(UserUseCase.update(dependencies).execute({
                    id: uuid(),
                    username:testUser.username,
                    password:testUser.password,
                    firstName:testUser.firstName,
                    lastName:testUser.lastName,
                })).toBeRejected();
            });
        });
    });

    describe('delete() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('User should be returned when deleted', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const deletedUser = await UserUseCase.delete(dependencies).execute((addedUser.id as string));

                expect(deletedUser).toBeDefined();
                expect(deletedUser?.id).toBeDefined();
                expect(deletedUser?.username).toBe(addedUser.username);
                expect(deletedUser?.firstName).toBe(addedUser.firstName);
                expect(deletedUser?.lastName).toBe(addedUser.lastName);
                expect(deletedUser?.level).toBe(addedUser.level);
            });

            it('Partial user should be returned when deleted with protected option', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const deletedUser = await UserUseCase.delete(dependencies).execute((addedUser.id as string),{protected:true});

                expect(deletedUser).toBeDefined();
                expect(deletedUser?.id).toBeUndefined();
                expect(deletedUser?.username).toBe(addedUser.username);
                expect(deletedUser?.firstName).toBe(addedUser.firstName);
                expect(deletedUser?.lastName).toBe(addedUser.lastName);
                expect(deletedUser?.level).toBeUndefined();
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when user deleted without id', async (): Promise<void> => {
                await expectAsync(UserUseCase.delete(dependencies).execute(((null as unknown) as string))).toBeRejected();
            });
        });
    });

    describe('getById() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('User should be returned when retrieved by id', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const returnedUser = await UserUseCase.getById(dependencies).execute((addedUser.id as string));

                expect(returnedUser).toBeDefined();
                expect(returnedUser?.id).toBe(addedUser.id);
                expect(returnedUser?.username).toBe(testUser.username);
                expect(returnedUser?.firstName).toBe(testUser.firstName);
                expect(returnedUser?.lastName).toBe(testUser.lastName);
                expect(returnedUser?.level).toBe(testUser.level);
            });

            it('Partial user should be returned when retrieved by id with protected option', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const returnedUser = await UserUseCase.getById(dependencies).execute((addedUser.id as string),{protected:true});

                expect(returnedUser).toBeDefined();
                expect(returnedUser?.id).toBeUndefined();
                expect(returnedUser?.username).toBe(testUser.username);
                expect(returnedUser?.firstName).toBe(testUser.firstName);
                expect(returnedUser?.lastName).toBe(testUser.lastName);
                expect(returnedUser?.level).toBeUndefined();
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when user retrieved without id of string type', async (): Promise<void> => {
                await expectAsync(UserUseCase.getById(dependencies).execute(0)).toBeRejected();
            });
        });
    });

    describe('getUserByUsername() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('User should be returned when retrieved by username', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const returnedUser = await UserUseCase.getUserByUsername?.(dependencies).execute((addedUser.username as string));

                expect(returnedUser).toBeDefined();
                expect(returnedUser?.id).toBe(addedUser.id);
                expect(returnedUser?.username).toBe(testUser.username);
                expect(returnedUser?.firstName).toBe(testUser.firstName);
                expect(returnedUser?.lastName).toBe(testUser.lastName);
                expect(returnedUser?.level).toBe(testUser.level);
            });

            it('Partial user should be returned when retrieved by username with protected option', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const returnedUser = await UserUseCase.getUserByUsername?.(dependencies).execute((addedUser.username as string),{protected:true});

                expect(returnedUser).toBeDefined();
                expect(returnedUser?.id).toBeUndefined();
                expect(returnedUser?.username).toBe(testUser.username);
                expect(returnedUser?.firstName).toBe(testUser.firstName);
                expect(returnedUser?.lastName).toBe(testUser.lastName);
                expect(returnedUser?.level).toBeUndefined();
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when user retrieved without username', async (): Promise<void> => {
                await expectAsync(UserUseCase.getUserByUsername?.(dependencies).execute(((null as unknown) as string))).toBeRejected();
            });
        });
    });

    describe('getAll() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Array of users should be returned when getting all users', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const returnedUsers = await UserUseCase.getAll?.(dependencies).execute();

                expect(returnedUsers).toBeDefined();
                expect(returnedUsers.length).toBe(1);
                expect(returnedUsers[0].id).toBe(addedUser.id);
                expect(returnedUsers[0].username).toBe(addedUser.username);
                expect(returnedUsers[0].firstName).toBe(addedUser.firstName);
                expect(returnedUsers[0].lastName).toBe(addedUser.lastName);
                expect(returnedUsers[0].level).toBe(addedUser.level);
            });

            it('Array of partial users should be returned when getting all users with protected option', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const returnedUsers = await UserUseCase.getAll?.(dependencies).execute({protected:true});

                expect(returnedUsers).toBeDefined();
                expect(returnedUsers.length).toBe(1);
                expect(returnedUsers[0].id).toBeUndefined();
                expect(returnedUsers[0].username).toBe(addedUser.username);
                expect(returnedUsers[0].firstName).toBe(addedUser.firstName);
                expect(returnedUsers[0].lastName).toBe(addedUser.lastName);
                expect(returnedUsers[0].level).toBeUndefined();
            });
        });
    });

    describe('deleteAll() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Array of user should be returned when deleting all users', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const returnedUsers = await UserUseCase.deleteAll?.(dependencies).execute();

                expect(returnedUsers).toBeDefined();
                expect(returnedUsers.length).toBe(1);
                expect(returnedUsers[0].id).toBe(addedUser.id);
                expect(returnedUsers[0].username).toBe(addedUser.username);
                expect(returnedUsers[0].firstName).toBe(addedUser.firstName);
                expect(returnedUsers[0].lastName).toBe(addedUser.lastName);
                expect(returnedUsers[0].level).toBe(addedUser.level);
            });

            it('Array of partial users should be returned when deleting all users with protected option', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const returnedUsers = await UserUseCase.deleteAll?.(dependencies).execute({protected:true});

                expect(returnedUsers).toBeDefined();
                expect(returnedUsers.length).toBe(1);
                expect(returnedUsers[0].id).toBeUndefined();
                expect(returnedUsers[0].username).toBe(addedUser.username);
                expect(returnedUsers[0].firstName).toBe(addedUser.firstName);
                expect(returnedUsers[0].lastName).toBe(addedUser.lastName);
                expect(returnedUsers[0].level).toBeUndefined();
            });
        });
    });

    describe('authenticate() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('User should be returned when authenticated', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const authenticatedUser = await UserUseCase.authenticate?.(dependencies).execute((addedUser.username as string),(testUser.password as string));

                expect(authenticatedUser).toBeDefined();
                expect(authenticatedUser?.id).toBe(addedUser.id);
                expect(authenticatedUser?.username).toBe(addedUser.username);
                expect(authenticatedUser?.firstName).toBe(addedUser.firstName);
                expect(authenticatedUser?.lastName).toBe(addedUser.lastName);
                expect(authenticatedUser?.level).toBe(addedUser.level);
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when authenticated without username', async (): Promise<void> => {
                await expectAsync(UserUseCase.authenticate?.(dependencies).execute(
                    ((null as unknown) as string),
                    'password123'
                )).toBeRejected();
            });

            it('Promise should be rejected when authenticated without password', async (): Promise<void> => {
                await expectAsync(UserUseCase.authenticate?.(dependencies).execute(
                    (testUser.username as string),
                    ((null as unknown) as string)
                )).toBeRejected();
            });
        });
    });

    describe('addSession() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('User session should be returned when added', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const secret = generateToken(TokenType.Refresh, addedUser);
                const addedSession = await UserUseCase.addSession?.(dependencies).execute(secret,(addedUser.id as string));

                expect(addedSession).toBeDefined();
                expect(addedSession?.id).toBeDefined();
                expect(addedSession?.secret).toBe(secret);
                expect(addedSession?.userId).toBe(addedUser.id);
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when session added without secret', async (): Promise<void> => {
                await expectAsync(UserUseCase.addSession?.(dependencies).execute(
                    ((null as unknown) as string),
                    uuid()
                )).toBeRejected();
            });

            it('Promise should be rejected when session added without user id', async (): Promise<void> => {
                const secret = generateToken(TokenType.Refresh, testUser);
                await expectAsync(UserUseCase.addSession?.(dependencies).execute(
                    secret,
                    ((null as unknown) as string)
                )).toBeRejected();
            });
        });
    });

    describe('deleteSession() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('User session should be returned when deleted', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const secret = generateToken(TokenType.Refresh, addedUser);
                const addedSession = await UserUseCase.addSession?.(dependencies).execute(secret,(addedUser.id as string));
                const deletedSession = await UserUseCase.deleteSession?.(dependencies).execute((addedSession?.secret as string),(addedSession?.userId as string));

                expect(deletedSession).toBeDefined();
                expect(deletedSession?.id).toBeDefined();
                expect(deletedSession?.secret).toBe(secret);
                expect(deletedSession?.userId).toBe(addedUser.id);
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when session deleted without secret', async (): Promise<void> => {
                await expectAsync(UserUseCase.deleteSession?.(dependencies).execute(
                    ((null as unknown) as string),
                    uuid()
                )).toBeRejected();
            });

            it('Promise should be rejected when session deleted without user id', async (): Promise<void> => {
                const secret = generateToken(TokenType.Refresh, testUser);
                await expectAsync(UserUseCase.deleteSession?.(dependencies).execute(
                    secret,
                    ((null as unknown) as string)
                )).toBeRejected();
            });
        });
    });

    describe('getSession() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('User session should be returned when getting session', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const secret = generateToken(TokenType.Refresh, addedUser);
                const addedSession = await UserUseCase.addSession?.(dependencies).execute(secret,(addedUser.id as string));
                const returnedSession = await UserUseCase.getSession?.(dependencies).execute((addedSession?.id as number));

                expect(returnedSession).toBeDefined();
                expect(returnedSession?.id).toBeDefined();
                expect(returnedSession?.secret).toBe(secret);
                expect(returnedSession?.userId).toBe(addedUser.id);
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when getting session without sessionId', async (): Promise<void> => {
                await expectAsync(UserUseCase.getSession?.(dependencies).execute(((null as unknown) as number))).toBeRejected();
            });
        });
    });

    describe('getSessionForUser() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('User session should be returned when getting session by user id', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const secret = generateToken(TokenType.Refresh, addedUser);
                const addedSession = await UserUseCase.addSession?.(dependencies).execute(secret,(addedUser.id as string));
                const returnedSession = await UserUseCase.getSessionForUser?.(dependencies).execute((addedUser.id as string));

                expect(returnedSession).toBeDefined();
                expect(returnedSession?.id).toBe(addedSession?.id);
                expect(returnedSession?.secret).toBe(secret);
                expect(returnedSession?.userId).toBe(addedUser.id);
            });
        });

        describe('Validation Tests', (): void => {
            it('Promise should be rejected when getting session without user id', async (): Promise<void> => {
                await expectAsync(UserUseCase.getSessionForUser?.(dependencies).execute(((null as unknown) as string))).toBeRejected();
            });
        });
    });

    describe('getAllSessions() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Array of user sessions should be returned when getting all sessions', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const secret = generateToken(TokenType.Refresh, addedUser);
                const addedSession = await UserUseCase.addSession?.(dependencies).execute(secret,(addedUser.id as string));
                const returnedSessions = await UserUseCase.getAllSessions?.(dependencies).execute();

                expect(returnedSessions).toBeDefined();
                expect(returnedSessions?.length).toBe(1);
                expect(returnedSessions?.[0].id).toBe(addedSession?.id);
                expect(returnedSessions?.[0].secret).toBe(secret);
                expect(returnedSessions?.[0].userId).toBe(addedUser.id);
            });
        });
    });

    describe('deleteAllSessions() Tests', (): void => {
        describe('Functionality Tests', (): void => {
            it('Array of user sessions should be returned when deleting all sessions', async (): Promise<void> => {
                const addedUser = await UserUseCase.add(dependencies).execute(testUser);
                const secret = generateToken(TokenType.Refresh, addedUser);
                const addedSession = await UserUseCase.addSession?.(dependencies).execute(secret,(addedUser.id as string));
                const deletedSessions = await UserUseCase.deleteAllSessions?.(dependencies).execute();

                expect(deletedSessions).toBeDefined();
                expect(deletedSessions?.length).toBe(1);
                expect(deletedSessions?.[0].id).toBe(addedSession?.id);
                expect(deletedSessions?.[0].secret).toBe(secret);
                expect(deletedSessions?.[0].userId).toBe(addedUser.id);
            });
        });
    });
});
