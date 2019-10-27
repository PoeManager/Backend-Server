import JSONValidator from '../../core/json-validator';
import ServerUtils from '../server-utils';
import MiddlewareFunction from './middleware-function';

/**
 * Generates a body validator middleware for a particular schema.
 *
 * @param schema The required schema.
 * @returns The middleware function.
 */
function makeBodyValidator(schema: object): MiddlewareFunction {
    return async (req, res, next) => {
        try {
            req.locals.logger.info('Validating body.');
            await JSONValidator.validate(req.body, schema);
            req.locals.logger.info('Body validation successful.');
            next();
        } catch (error) {
            req.locals.logger.info('Body validation failed.');
            ServerUtils.sendRESTError(req, res, error);
        }
    };
}

export = makeBodyValidator;
