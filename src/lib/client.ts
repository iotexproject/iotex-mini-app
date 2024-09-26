import { createClientWithDBServer } from '@iotexproject/kit'
import { publicConfig } from './config'
export const kitDBService = createClientWithDBServer({
    url: publicConfig.taskServer,
    fetchRequestInit: {
        headers: {
            Authorization: `Bearer ${process.env.TASK_API_KEY}`,
            "Content-Type": "application/json",
        }
    }
  })
  

  export const kitPostDBService = createClientWithDBServer({
    url: publicConfig.taskServer,
    fetchRequestInit: {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${process.env.TASK_API_KEY}`,
            "Content-Type": "application/json",
        }
    }
  })