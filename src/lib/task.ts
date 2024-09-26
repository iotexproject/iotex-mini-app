 
import { TaskCycle } from "./dictionary";
import {dayjs} from './dayjs';

export function getEventId({ user_id, task_id, task_cycle }: { user_id: number; task_id: number; task_cycle: number }) {
    let event_id = "";
    let errMsg = "";
    switch (task_cycle) {
      case TaskCycle.Once:
        event_id = `telegram-${user_id}-task_${task_id}`;
        break;
        case TaskCycle.DailyOnce:
        event_id = `telegram-${user_id}-task_${task_id}-${dayjs.utc().format("YYYYMMDD")}`;
        break;
      default:
        errMsg = "Invalid task_type";
        break;
    }
    return {
      event_id,
      errMsg,
    };
  }