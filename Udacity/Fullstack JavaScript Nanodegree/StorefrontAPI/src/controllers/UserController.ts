import express from 'express';
import {User} from '../entities';
import {Dependable} from '../entities/protocols';
import {MiddlewareFuncAsync, ResponseStatusCode} from '../entities/networking';
import {generateOKResponse, generateRequestError, generateServerError} from './helper-functions';

const UserController = (dependencies: Dependable<User>): {
    addUser: MiddlewareFuncAsync,
    updateUser: MiddlewareFuncAsync,
    deleteUser: MiddlewareFuncAsync,
    getUserById: MiddlewareFuncAsync,
    getUserByUsername: MiddlewareFuncAsync,
    getAllUsers: MiddlewareFuncAsync
} => {
    const addUser = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const {
            useCase
        } = dependencies;

        if (!useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        try {
            const {
                username,
                password,
                firstName,
                lastName,
                level
            } = request.body as User;

            const addedUser = await useCase.add(dependencies).execute({username,password,firstName,lastName,level});

            response.json(generateOKResponse(addedUser));
        } catch (error) {
            next(error);
        }
    };

    const updateUser = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const {
            useCase
        } = dependencies;

        if (!useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        try {
            const {
                id,
                username,
                firstName,
                lastName,
                level
            } = request.body as User;

            const updatedUser = await useCase.update(dependencies).execute({id,username,firstName,lastName,level});
            if (!updatedUser) throw generateServerError('updating user');

            response.json(generateOKResponse(updatedUser));
        } catch (error) {
            next(error);
        }
    };

    const deleteUser = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const {
            useCase
        } = dependencies;

        if (!useCase) {
            throw new Error('use-case should be passed as s dependency');
        }

        try {
            const id = request.params.id as string;

            const deletedUser = await useCase.delete(dependencies).execute(id);
            if (!deletedUser) throw generateServerError('deleting user');

            response.json(generateOKResponse(deletedUser));
        } catch (error) {
            next(error);
        }
    };

    const getUserById = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const {
            useCase
        } = dependencies;

        if (!useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        try {
            const id = request.params.id as string;

            const returnedUser = await useCase.getById(dependencies).execute(id);
            if (!returnedUser) throw generateRequestError('No user with such id', ResponseStatusCode.BadRequest);

            response.json(generateOKResponse(returnedUser));
        } catch (error) {
            next(error);
        }
    };

    const getUserByUsername = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const {
            useCase
        } = dependencies;

        if (!useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        try {
            const username = request.params.username as string;

            if (!useCase.getUserByUsername) throw generateServerError('getting user by username');
            const returnedUser = await useCase.getUserByUsername(dependencies).execute(username);
            if (!returnedUser) throw generateRequestError('No user with such username', ResponseStatusCode.BadRequest);

            response.json(generateOKResponse(returnedUser));
        } catch (error) {
            next(error);
        }
    };

    const getAllUsers = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const {
            useCase
        } = dependencies;

        if (!useCase) {
            throw new Error('use-case should be passed as a dependency');
        }

        try {
            const returnedUsers = await useCase.getAll(dependencies).execute();

            response.json(generateOKResponse(
                returnedUsers.length ?
                returnedUsers :
                'No users to show'
            ));
        } catch (error) {
            next(error);
        }
    };

    return {
        addUser,
        updateUser,
        deleteUser,
        getUserById,
        getUserByUsername,
        getAllUsers
    };
};

export default UserController;
