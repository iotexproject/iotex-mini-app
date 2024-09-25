import { helper } from '@/lib/helper';
import type { NextApiRequest, NextApiResponse } from 'next';
import { SiweMessage } from 'siwe';
import { handleAuthorize } from '@/lib/remult';

const verify = async (message: string, signature: string) => {
  const siweMessage = new SiweMessage(message);
  try {
    await siweMessage.verify({
      signature,
    });
    return siweMessage;
  } catch {
    return null;
  }
};

const generateJWT = async (address: string) => {
  const iat = Date.now() / 1000;
  const exp = Math.floor(Date.now() / 1000) + 30 * 24 * 60 * 60;
  const token = await helper.encode({
    sub: address,
    name: address,
    iat,
    exp,
  });

  return {
    token,
    exp,
  };
};

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    try {
      const { account, message, signature } = req.body;
      if (!account || !message || !signature) {
        res.status(400).json({ message: 'invalid request' });
        return;
      }
      const siweMessage = await verify(message, signature);
      if (!siweMessage) {
        res.status(400).json({ message: 'invalid signature' });
        return;
      }
      await handleAuthorize({
        id: account,
        name: '',
        email: '',
        image: '',
        loginType: 'wallet',
        role: 'user',
      });
      const jwt = await generateJWT(siweMessage.address);
      res.status(200).json(jwt);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  } else {
    res.status(405).json({ message: 'Method Not Allowed' });
  }
};
