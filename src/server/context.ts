
import { InitDataParsed } from '@telegram-apps/sdk-react';
import { TRPCError } from '@trpc/server';
import type * as trpcNext from '@trpc/server/adapters/next';
import jwt from 'jsonwebtoken';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface CreateContextOptions {
  // session: Session | null
}




/**
 * Creates context for an incoming request
 * @link https://trpc.io/docs/v11/context
 */
export async function createContext(
  opts: trpcNext.CreateNextContextOptions,
) {
  // for API-response caching see https://trpc.io/docs/v11/caching
  const bearToken  = opts.req.headers.authorization?.split(' ')[1];
  let user: {
    data: InitDataParsed
  } | null = null
  try {
    user = jwt.verify(bearToken, process.env.BOT_TOKEN!)
  } catch (error) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: error.message
    })
  }
  return {
    user
  }
}


export type Context = Awaited<ReturnType<typeof createContext>>;