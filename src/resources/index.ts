/* eslint-disable @typescript-eslint/no-unused-expressions */
import config from 'config';
import connectMongo from './mongo';
import './redis';
import connectPostgresDB from './postgres';
import { connect } from './cloudinary';
import logger from 'logger';

export default async () => {
  if (config.mongodb.host) {
    await connectMongo();
  }

  if (config.postgresSQL.host) {
    await connectPostgresDB();
  }

  if (config.cloudinary.api_key && config.cloudinary.api_secret && config.cloudinary.cloud_name) {
    connect;

    logger.info(`Successfully connected to Cloudinary: ${connect.cloud_name}`);
  }
};
