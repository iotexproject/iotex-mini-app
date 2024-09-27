/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { router, publicProcedure, authProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { validate } from '@telegram-apps/init-data-node';
import { parseInitData } from '@telegram-apps/sdk-react';
import jwt from 'jsonwebtoken';
import dayjs from 'dayjs';
import { dbClient } from '@/lib/db';

export const authRouter = router({
  signin: publicProcedure
    .input(z.object({
        initData: z.string(),
    }))
    .output(
      z.object({
        token: z.string(),
      }),
    )
    .mutation(async ({ input }) => {
      const { initData } = input;
      try {
        validate(initData, process.env.BOT_TOKEN!, {
          expiresIn: 86400 * 7,
        });
      } catch (error) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: error.message,
        });
      }
      const parsedData = parseInitData(initData);
      console.log('parsedData', parsedData);
      await dbClient`insert into public.user ${dbClient(
        {
          telegram_id: String(parsedData.user?.id),
          telegram_name: parsedData.user?.username,
        },
        'telegram_id',
        'telegram_name',
      )} on conflict (telegram_id) do update set telegram_name = excluded.telegram_name`;
      console.log('expr', dayjs(parsedData.authDate).toDate().toLocaleString())
      return {
        token: jwt.sign(
          {
            data: parsedData,
            exp: dayjs(parsedData.authDate).unix() + 86400 * 7 ,
          },
          process.env.BOT_TOKEN!,
        ),
      };
    }),
  test: authProcedure.query(() => 'ok!'),
});
