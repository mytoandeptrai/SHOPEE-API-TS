import cloudinary from 'cloudinary';
import config from 'config';

const cloudinary_v2 = cloudinary.v2;

const key = {
  cloud_name: config.cloudinary.cloud_name,
  api_key: config.cloudinary.api_key,
  api_secret: config.cloudinary.api_secret,
  secure: true,
};

const connect = cloudinary_v2.config(key);

export { connect, cloudinary_v2 };
