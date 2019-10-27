import express from 'express';
import EmailManager from '../../../core/email-manager';

async function handler(req: express.Request, res: express.Response): Promise<void> {
    req.locals.logger.info(`Starting a E-Mail change for user with ID ${req.locals.user.getId()}.`);
    const defaultLogin = await req.locals.user.getDefaultLogin();
    await defaultLogin.updateEMail(req.body.email);
    await EmailManager.sendEmailVerificationMail(req.locals.user);
    req.locals.logger.info('E-Mail change initiated.');
    res.send();
}

export = handler;
