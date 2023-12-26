import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { type Request } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import next from 'next';

import { publicRoutes } from './routes';

import { env } from '@/config';
import { errorHandler, xss } from '@/middlewares';
// import { authRoutes, goalRoutes } from '@/routes';
import { compress, getSettings, restartFlag } from '@/utils';

const nextApp = next({ dev: env.nodeEnv !== 'production' });

await nextApp.prepare();

// load settings
const settings = getSettings().load();
restartFlag.initializeSettings(settings.main);

const app = express();

/*<!---------- Helmet is used to secure this app by configuring the http-header ---------> */
app.use(helmet());

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/*<!---------- XSS is used to sanitize the request body, query, and params ---------> */
app.use(xss());

/*<!---------- Compression is used to compress the response body ---------> */
app.use(compression({ filter: compress }));

app.use(cors({ origin: env.cors.origin }));

/*<!---------- Morgan is used to log the request ---------> */
app.use(morgan('dev'));

/*<!---------- Routes ---------> */
app.use('/api/v1', publicRoutes);
// app.use('/api/v1/goals', goalRoutes);

app.all('*', (req: Request, res) => {
    return res.status(404).json({
        ok: false,
        message: `Can't find '${req.originalUrl}' on this server!`,
    });
});

/*<!---------- Error handler ---------> */
app.use(errorHandler);

export default app;
