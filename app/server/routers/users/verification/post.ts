import express from 'express';
import EmailManager from '../../../../core/email-manager';
import User from '../../../../model/user';
import errors from '../../../errors';
import RouteConfiguration from '../../../route-configuration';
import verificationPath from './verification-path';

const route: RouteConfiguration = {
    method: 'POST',
    path: `/${verificationPath}`,
    auth: true,
    handler
};

async function handler(req: express.Request, res: express.Response): Promise<void> {
    const user = req.locals.user as User;

    if (await user.isVerified()) {
        throw new errors.UserAlreadyVerifiedError(user.getId());
    } else {
        if (await user.getChangeState() !== User.ChangeType.VERIFY_ACCOUNT) { // no change ID is set yet
            await user.newChange(false);                                      // if change ID is set, just resend E-Mail
        }

        await EmailManager.sendVerificationMail(user);
        res.send();
    }
}

export = route;
