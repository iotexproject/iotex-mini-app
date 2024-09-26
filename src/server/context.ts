
import { InitDataParsed } from '@telegram-apps/sdk';
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
  } | null = {
    data: {
      // @ts-ignore
      user: {
        id: 5596524377
      }
    }
  };
  try {
    // user = jwt.verify(bearToken, process.env.BOT_TOKEN!)
  } catch (error) {
    
  }
  return {
    user
  }
}


export type Context = Awaited<ReturnType<typeof createContext>>;