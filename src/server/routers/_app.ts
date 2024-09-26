/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, router } from '../trpc';
import { authRouter } from './auth';

export const appRouter = router({
  auth: authRouter,
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;