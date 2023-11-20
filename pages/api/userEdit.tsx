import prisma from '@/lib/prismadb';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    try {
      let userEmail, password, newEmail: any;

      if (typeof req.body === 'object') {
        userEmail = req.body.userEmail;
        password = req.body.password;
        newEmail = req.body.newEmail;
      } else {
        const body = JSON.parse(req.body);
        userEmail = body.userEmail;
        password = body.password;
        newEmail = body.newEmail;
      }

      // Update email and password
      const findIfExist = await prisma.user.update({
        where: { email: userEmail },
        data: {
          email: newEmail,
          password: password,
        },
      });

      res.status(200).json('Success');
    } catch (error) {
      console.log(error);
      res.status(500).json('Unknown Error Occurred');
    }
  } else {
    res.status(405).json(null);
  }
}
