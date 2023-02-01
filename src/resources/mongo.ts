/* eslint-disable max-len */
import { connect, connection } from 'mongoose';
import config from 'config';
import logger from 'logger';

const mongoDBConfig = config.mongodb;

const mongodbProtocol = mongoDBConfig.protocol || 'mongodb';

const userNamePwd = mongoDBConfig.username ? `${mongoDBConfig.username}:${mongoDBConfig.password}@` : '';

let mongodbUrl = `${mongodbProtocol}+srv://${userNamePwd}${mongoDBConfig.host}/${mongoDBConfig.dbName}?retryWrites=true&w=majority`;

if (mongoDBConfig.replicaSet) {
  mongodbUrl += `&replicaSet=${mongoDBConfig.replicaSet}`;
}

const options = {
  autoIndex: true,
  autoCreate: true,
};

export default async () => {
  logger.info('Starting connect to MongoDB...');
  await connect(mongodbUrl, options);
  connection.on('error', () => {
    logger.error('MongoDB connection error');
    process.exit(1);
  });
  logger.info('Successfully connected to MongoDB');
};
