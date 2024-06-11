import { ConfigException } from '../exception/config.exception';
import { configSchema } from './config.schema';
import { Config } from './config.type';

export const factory = (): Config => {
  const result = configSchema.safeParse({
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    baseurl: process.env.BASE_URL,
    mail: {
      from: process.env.MAIL_FROM,
      host: process.env.MAIL_HOST,
      port: process.env.MAIL_PORT,
      user: process.env.MAIL_USER,
      password: process.env.MAIL_PASS,
      domain: process.env.MAIL_DOMAIN,
    },
    redis: {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
    },
    database: {
      host: process.env.DATABASE_HOST,
      database: process.env.DATABASE_NAME,
      password: process.env.DATABASE_PASSWORD,
      port: process.env.DATABASE_PORT,
      url: process.env.DATABASE_URL,
      username: process.env.DATABASE_USERNAME,
    },
    fileupload: {
      url: process.env.FILE_UPLOAD_URL,
      key: process.env.FILE_UPLOAD_KEY,
    },
  });

  if (result.success) {
    return result.data;
  }

  throw new ConfigException(
    `invalid application configuration: ${result.error.message}`,
  );
};