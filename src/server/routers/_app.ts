/**
 * This file contains the root router of your tRPC-backend
 */
import { createCallerFactory, router } from '../trpc';
import { authRouter } from './auth';
import { taskRouter } from './task';

export const appRouter = router({
  auth: authRouter,
  task: taskRouter
});

export const createCaller = createCallerFactory(appRouter);

export type AppRouter = typeof appRouter;