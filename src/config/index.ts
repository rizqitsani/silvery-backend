import { config } from 'dotenv';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const envFound = config();

if (envFound.error) {
  throw new Error("Couldn't find .env file  ");
}

export default {
  env: process.env.NODE_ENV,
  port: parseInt(process.env.PORT + '', 10),
  jwtSecret: process.env.JWT_SECRET,
  jwtExpire: process.env.JWT_EXPIRES_IN,
  refreshTokenExpire: Number(process.env.JWT_REFRESH_TOKEN_EXPIRES_IN),
  midtransClientKey: process.env.MIDTRANS_CLIENT_KEY,
  midtransServerKey: process.env.MIDTRANS_SERVER_KEY,
};
