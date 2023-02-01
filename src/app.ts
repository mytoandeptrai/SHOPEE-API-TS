import express, { Request, Response, NextFunction } from 'express';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import helmet from 'helmet';
import noCache from 'nocache';
import routers from 'api';
import swaggerUi from 'swagger-ui-express';
import yaml from 'yamljs';
import initializeResources from 'resources';
import { APP_CONSTANTS } from 'utils/constants';
import logger, { errorLogging, requestLogging } from './logger';
import config from 'config';
import { errorMiddleware } from 'middlewares';

import bodyParser from 'body-parser';
import expressFileupload from 'express-fileupload';

const app = express();

const corsOption = {
  credentials: true,
  origin: ['http://localhost:3000'],
};

app.use(cors(corsOption));
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));
app.use(expressFileupload({ useTempFiles: false }));
app.use(
  express.urlencoded({
    extended: true,
    limit: '100mb',
  })
);
app.set('trust proxy', true);

function initializeSecurity() {
  app.use(noCache());
  app.use(helmet.frameguard());
  app.use(helmet.hidePoweredBy());
  app.use(helmet.hsts());
  app.use(helmet.ieNoOpen());
  app.use(helmet.noSniff());
  app.use(helmet.xssFilter());
}

function initializeMiddlewares() {
  app.use(express.json());
  app.use(cookieParser());
  app.use(compression());

  // use for computing processing time on response
  app.use((request: any, _response: Response, next: NextFunction) => {
    request.startTime = Date.now();
    next();
  });

  app.use(requestLogging);
  app.use(errorLogging);
}

function initializeErrorHandler() {
  app.use(errorMiddleware);
}

function initializeSwagger() {
  if (process.env.NODE_ENV === 'prd') {
    return;
  }
  const swaggerDoc = yaml.load(`${__dirname}/openapi3.yaml`);
  app.use(`${APP_CONSTANTS.apiPrefix}/swagger-ui`, swaggerUi.serve, swaggerUi.setup(swaggerDoc));
  app.use(`${APP_CONSTANTS.apiPrefix}/api-docs`, (req: Request, res: Response) => {
    res.send(swaggerDoc);
  });
}

initializeSecurity();
initializeMiddlewares();
app.use(APP_CONSTANTS.apiPrefix, routers);
initializeErrorHandler();
initializeSwagger();

export const listen = async () => {
  await initializeResources();
  app.listen(config.port || 3000, () => {
    logger.info(`App listening on the port ${config.port}`);
  });
};

export default app;
