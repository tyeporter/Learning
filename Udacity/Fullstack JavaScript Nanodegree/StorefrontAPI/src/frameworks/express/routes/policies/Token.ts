import express from 'express';
import {generateToken} from '../helper-functions';
import {User} from '../../../../entities';
import {UserLevel} from '../../../../entities/enums';
import {TokenType} from '../../../../entities/networking';
import {Dependable} from '../../../../entities/protocols';
import {checkToken, generateServerError, handleUnauthorizedAccess} from '../helper-functions';

const Token = (
    userLevel: UserLevel,
    dependencies: Dependable<User>
): {policy: (request: express.Request, response: express.Response, next: express.NextFunction) => void} => {
    const policy = async (
        request: express.Request,
        response: express.Response,
        next: express.NextFunction
    ): Promise<void> => {
        const accessToken = request.cookies[TokenType.Access] as string;
        let userWithSession = checkToken(TokenType.Access, accessToken) as User;
        if (!userWithSession) {
            const refreshToken = request.cookies[TokenType.Refresh] as string;
            userWithSession = checkToken(TokenType.Refresh, refreshToken) as User;
            if (!userWithSession) {
                handleUnauthorizedAccess(response);
                return;
            }

            const {useCase} = dependencies;

            if (!useCase) {
                throw new Error('use-case should be passed as a dependency');
            }

            try {
                if (!(useCase.getSessionForUser && useCase.addSession && useCase.deleteSession)) throw generateServerError();

                const session = await useCase.getSessionForUser(dependencies).execute((userWithSession.id as string));
                if (session) await useCase.deleteSession(dependencies).execute(session.secret,session.userId);

                const accessToken = generateToken(TokenType.Access, {
                    id:userWithSession.id,
                    username:userWithSession.username,
                    firstName:userWithSession.firstName,
                    lastName:userWithSession.lastName,
                    level:userWithSession.level
                });
                const refreshToken = generateToken(TokenType.Refresh, {
                    id:userWithSession.id,
                    username:userWithSession.username,
                    firstName:userWithSession.firstName,
                    lastName:userWithSession.lastName,
                    level:userWithSession.level
                });
                await useCase.addSession(dependencies).execute(refreshToken,(userWithSession.id as string));

                // NOTE: - In a production environment, we'd want to add the "secure" and "sameSite" flags
                response.cookie(TokenType.Access, accessToken, {
                    maxAge: 3.6e6,
                    httpOnly: true,
                });
                response.cookie(TokenType.Refresh, refreshToken, {
                    maxAge: 2.592e9,
                    httpOnly: true
                });
            } catch (error) {
                next(error);
            }
        }

        if (userWithSession.level !== userLevel) {
            handleUnauthorizedAccess(response);
            return;
        }
        next();
    };

    return {policy};
};

export default Token;
