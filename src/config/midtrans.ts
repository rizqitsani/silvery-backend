import config from '.';
import { MidtransClient } from 'midtrans-node-client';

const snap = new MidtransClient.Snap({
  isProduction: false,
  clientKey: config.midtransClientKey,
  serverKey: config.midtransServerKey,
});

export default snap;
