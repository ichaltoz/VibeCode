import { Elysia } from 'elysia';
import { db } from './db';
import { users } from './db/schema';
import { usersRoute } from './routes/users-route';
import { UnauthorizedError, BadRequestError } from './utils/errors';

const app = new Elysia()
  .error({
    UNAUTHORIZED: UnauthorizedError,
    BAD_REQUEST: BadRequestError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case 'UNAUTHORIZED':
        set.status = 401;
        return { error: error.message };
      case 'BAD_REQUEST':
        set.status = 400;
        return { error: error.message };
      case 'NOT_FOUND':
        set.status = 404;
        return { error: 'Not Found' };
      case 'VALIDATION':
        set.status = 400;
        return { error: 'Validation Failed', detail: error.all };
      default:
        console.error(error);
        set.status = 500;
        return { error: 'Internal Server Error' };
    }
  })
  .use(usersRoute)
  .get('/', () => 'Hello Elysia')
  .get('/ping', () => ({
    status: 'ok',
    timestamp: new Date().toISOString(),
  }))
  .get('/users', async () => {
    const allUsers = await db.select().from(users);
    return allUsers;
  })
  .listen(3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
