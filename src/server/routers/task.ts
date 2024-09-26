/**
 *
 * This is an example router, you can delete this file and then update `../pages/api/trpc/[trpc].tsx`
 */
import { router, authProcedure } from '../trpc';
import { TRPCError } from '@trpc/server';
import { z } from 'zod';
import { dbClient } from '@/lib/db';
import { kitDBService, kitPostDBService } from '@/lib/client';
import { getEventId } from '@/lib/task';

export const taskRouter = router({
  tasks: authProcedure
    .output(
      z.array(
        z.object({
          id: z.number(),
          title: z.string(),
          task_type: z.number(),
          icon: z.string(),
          point: z.number(),
          description: z.string(),
          config: z.any(),
          isCompleted: z.boolean(),
        }),
      ),
    )
    .query(async ({ ctx }) => {
      const data = await dbClient<
        {
          id: number;
          title: string;
          point: number;
          task_type: number;
          icon: string;
          description: string;
          config: any;
          task_cycle: number;
        }[]
      >`select id, title, point, task_type, icon, description, config, task_cycle from point_task where published = true`;
      const dataWithEventId =  data.map( (task) => {
        const eventIdRes = getEventId({
          user_id: ctx.user?.data.user?.id!,
          task_id: task.id,
          task_cycle: task.task_cycle,
        });
        return {
          ...task,
          event_id: eventIdRes.event_id
        }
      })
      const eventRes = (await kitDBService.analysis.batch_fetch_event({
        event_ids: dataWithEventId.map((task) => task.event_id),
      })) as any [] 
      return data.map((task, index) => {
        return {
          ...task,
          point: Number(task.point),
          isCompleted: !!eventRes[index]
        }
      })
      
    }),
  totalPoint: authProcedure.output(z.number()).query(async ({ ctx }) => {
    const res = await  kitDBService.analysis.fetch_user_point({
      user_id: String(ctx.user?.data.user?.id!),
    });
    if (!res.ok) {
       return 0
    }
    return res.point || 0;
  }),
  
  check: authProcedure
  .input(z.object({
    id: z.number(),
  }))
  .output(
    z.boolean()
  )
  .mutation(async ({ input, ctx }) => {
    const { id } = input;
    const res = await dbClient<{
      id: number;
      task_cycle: number;
      point: string;
    }[]>`select id,task_cycle, point from point_task where id = ${id}`;
    const task = res[0];
    if (!task) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Task not found',
      })

    }
    const eventIdRes = getEventId({
      user_id: ctx.user?.data.user?.id!,
      task_id: task.id,
      task_cycle: task.task_cycle,
    });
    if (!eventIdRes.event_id) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: eventIdRes.errMsg,
      })
    }
    const eventPushRes = await kitPostDBService.analysis.upload_event({
      event_type: "point",
      user_id: String(ctx.user?.data.user?.id!),
      event_id: eventIdRes.event_id,
      event: {
        point: Number(task.point),
        task_id: task.id,
      }
    });
    if (!eventPushRes.ok) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: eventPushRes.msg,
      })
    }
    return true
  }),
});
