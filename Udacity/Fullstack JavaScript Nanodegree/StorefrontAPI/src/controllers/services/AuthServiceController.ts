import express from 'express';
import {User} from '../../entities';
import {MiddlewareFuncAsync, Response, ResponseStatusCode, TokenType} from '../../entities/networking';
import {Dependable} from '../../entities/protocols';
import {checkToken, generateOKResponse, generateRequestError, generateServerError, generateToken} from '../helper-functions';


const AuthServiceController = (dependencies: Dependable<User>): {
    signUp: MiddlewareFuncAsync,
    signIn: MiddlewareFuncAsync,
    signOut: MiddlewareFuncAsync
} => {
    const signUp = async (
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

        const sessionToken = request.cookies[TokenType.Refresh] as string;
        if (sessionToken) {
            const user = checkToken(TokenType.Refresh, sessionToken) as User;
            if (user) {
                try {
                    if (!useCase.getSessionForUser) throw new Error();
                    const session = await useCase.getSessionForUser(dependencies).execute((user.id as string));
                    if (session) {
                        next(generateRequestError('You are already signed in. Please sign out before taking this action', ResponseStatusCode.BadRequest));
                        return;
                    }
                } catch (error) {
                    next(generateServerError('signing up'));
                    return;
                }
            }
        }

        try {
            const {
                username,
                password,
                firstName,
                lastName,
            } = request.body;

            if (!useCase.getUserByUsername)  throw generateServerError('signing up');

            const possibleUser = await useCase.getUserByUsername(dependencies).execute(username);
            if (possibleUser) throw generateRequestError('Username is already taken', ResponseStatusCode.BadRequest);

            const addedUser = await useCase.add(dependencies).execute({username,password,firstName,lastName,level:0}) as User;
            if (!useCase.addSession) throw generateServerError('signing up');

            const accessToken = generateToken(TokenType.Access, {
                id:addedUser.id,
                username:addedUser.username,
                firstName:addedUser.firstName,
                lastName:addedUser.lastName,
                level:addedUser.level
            });
            const refreshToken = generateToken(TokenType.Refresh, {
                id:addedUser.id,
                username:addedUser.username,
                firstName:addedUser.firstName,
                lastName:addedUser.lastName,
                level:addedUser.level
            });
            await useCase.addSession(dependencies).execute(refreshToken,(addedUser.id as string));

            // NOTE: - In a production environment, we'd want to add the "secure" and "sameSite" flags
            response.cookie(TokenType.Access, accessToken, {
                maxAge: 3.6e6,
                httpOnly: true,
            });
            response.cookie(TokenType.Refresh, refreshToken, {
                maxAge: 2.592e9,
                httpOnly: true
            });

            response.json(generateOKResponse(`Welcome ${addedUser.username}! You are now signed up.`));
        } catch (error) {
            next(error);
        }
    };

    const signIn = async (
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

        const sessionToken = request.cookies[TokenType.Refresh] as string;
        if (sessionToken) {
            const user = checkToken(TokenType.Refresh, sessionToken) as User;
            if (user) {
                try {
                    if (!useCase.getSessionForUser) throw new Error();
                    const session = await useCase.getSessionForUser(dependencies).execute((user.id as string));
                    if (session) {
                        next(generateRequestError('You are already signed in. Please sign out before taking this action', ResponseStatusCode.BadRequest));
                        return;
                    }
                } catch (error) {
                    next(generateServerError('signing in'));
                    return;
                }
            }
        }

        try {
            const {
                username,
                password
            } = request.body;

            if (!useCase.authenticate) throw new Error('Internal Server Error');
            const signedInUser = await useCase.authenticate(dependencies).execute(username,password);
            if (!signedInUser) throw generateRequestError('Invalid username or password', ResponseStatusCode.BadRequest);

            if (!(useCase.getSessionForUser && useCase.addSession && useCase.deleteSession)) throw generateServerError('signing in');

            // Check if user already has session (e.g., User clears cookies but doesn't directly sign out)
            const session = await useCase.getSessionForUser(dependencies).execute((signedInUser.id as string));
            if (session) await useCase.deleteSession(dependencies).execute(session.secret,session.userId);

            const accessToken = generateToken(TokenType.Access, {
                id:signedInUser.id,
                username:signedInUser.username,
                firstName:signedInUser.firstName,
                lastName:signedInUser.lastName,
                level:signedInUser.level
            });
            const refreshToken = generateToken(TokenType.Refresh, {
                id:signedInUser.id,
                username:signedInUser.username,
                firstName:signedInUser.firstName,
                lastName:signedInUser.lastName,
                level:signedInUser.level
            });
            await useCase.addSession(dependencies).execute(refreshToken,(signedInUser.id as string));

            // NOTE: - In a production environment, we'd want to add the "secure" and "sameSite" flags
            response.cookie(TokenType.Access, accessToken, {
                maxAge: 3.6e6,
                httpOnly: true,
            });
            response.cookie(TokenType.Refresh, refreshToken, {
                maxAge: 2.592e9,
                httpOnly: true
            });

            response.json(generateOKResponse(`Welcome ${signedInUser.username}! You are signed in.`));
        } catch (error) {
            next(error);
        }
    };

    const signOut = async (
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

        const accessToken = request.cookies[TokenType.Access] as string;
        const refreshToken = request.cookies[TokenType.Refresh] as string;
        // At least have a valid session token
        const user = checkToken(TokenType.Refresh, refreshToken) as User;
        if (!(accessToken && refreshToken && user)) {
            next();
            return;
        }

        try {
            if (!useCase.deleteSession) throw generateServerError('signing out');
            await useCase.deleteSession(dependencies).execute(refreshToken,(user.id as string));
            response.clearCookie(TokenType.Access);
            response.clearCookie(TokenType.Refresh);

            response.json(generateOKResponse(`You have successfully signed out! See you soon ${user.username}!`));
        } catch (error) {
            next(error);
        }
    };

    return {
        signUp,
        signIn,
        signOut
    };
};

export default AuthServiceController;
