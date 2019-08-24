import express from 'express';
import http from 'http';
import morgan from 'morgan';
import logger from '../core/Logger';
import router from './routers/routers/router';

namespace Server {
    const config = {
        port: 3000,
        urlPrefix: 'api'
    };

    let app: express.Express | null = null;
    let server: http.Server;

    export function start() {
        logger.info('Starting server...');
        if (app !== null) {
            logger.warn('Server is already started.');
            return;
        }

        app = express();

        app.use(morgan('tiny'));
        app.use(express.json());
        app.use(express.urlencoded({extended: false}));
        app.use(`/${config.urlPrefix}`, router);
        app.get('/', (req, res) => {
            res.send({text: 'It works!'});
        });

        server = http.createServer(app);
        server.listen(config.port);
        server.on('close', () => {
            logger.info('Server is closing down.');
        });

        server.on('error', error => {
            logger.error(`Error in server: ${error.message}`);
        });

        server.on('listening', () => {
            logger.info('Server is now listening.');
        });
    }

    export async function stop(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!app) {
                logger.warn('Server is not running.');
                reject('Server is not running');
                return;
            }

            server.close(err => {
                app = null;
                if (err) {
                    reject(new Error(`Server could not be stopped gracefully: ${err}`));
                } else {
                    resolve();
                }
            });
        });
    }
}

export = Server;
