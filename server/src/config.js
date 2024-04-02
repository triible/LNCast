import dotenv from 'dotenv';

dotenv.config();

const config = {
  PORT: process.env.PORT,
  MONGODB_URL: process.env.MONGODB_URL,
  LN_CERT: process.env.LN_CERT,
  LN_DECODE_INVOICE_MACAROON: process.env.LN_DECODE_INVOICE_MACAROON,
  LN_SOCKET: process.env.LN_SOCKET
};

export default config;