import errors from '../../core/errors';
import SessionTokenManager from '../../core/session-token-manager';
import ServerUtils from '../server-utils';
import MiddlewareFunction from './middleware-function';

/**
 * Generates a body validator middleware for a particular schema.
 *
 * @param schema The required schema.
 * @returns The middleware function.
 */
function makeAuth(): MiddlewareFunction {
    return async (req, res, next) => {
        try {
            const token = req.header('x-auth-token');

            if (token) {
                res.locals.user = await SessionTokenManager.verify(token);
                next();
            } else {
                throw new errors.InvalidJWTError('');
            }
        } catch (error) {
            ServerUtils.sendRESTError(res, error);
        }
    };
}

export = makeAuth;
