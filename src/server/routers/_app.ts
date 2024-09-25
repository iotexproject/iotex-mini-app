/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, publicProcedure, router } from '../trpc';
import { authRouter } from './auth';

export const appRouter = router({
  healthz: publicProcedure.query(() => 'ok!'),

  auth: authRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;