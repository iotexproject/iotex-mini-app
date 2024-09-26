import postgres from 'postgres';

export const dbClient = postgres(process.env.DATABASE_URL!, {
  max: process.env.NODE_ENV === 'development' ? 10 : 50,
  idle_timeout: 10,
  ssl: true,
  connect_timeout: 30,
  connection: {
    application_name: 'tg',
  },
  debug: process.env.NODE_ENV === 'development',
});
