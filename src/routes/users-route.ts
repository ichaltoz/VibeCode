import { Elysia, t } from 'elysia';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../services/users-service';
import { UnauthorizedError } from '../utils/errors';

export const usersRoute = new Elysia({ prefix: '/api' })
  .derive(({ headers }) => {
    const auth = headers['authorization'];
    return {
      getToken: () => {
        if (!auth || !auth.startsWith('Bearer ')) {
          throw new UnauthorizedError();
        }
        return auth.split(' ')[1];
      }
    };
  })
  .post('/users', async ({ body }) => {
    const result = await registerUser(body);
    return { data: result };
  }, {
    body: t.Object({
      name: t.String({ maxLength: 255 }),
      email: t.String({ maxLength: 255 }),
      password: t.String()
    })
  })
  .post('/users/login', async ({ body }) => {
    const token = await loginUser(body);
    return { data: token };
  }, {
    body: t.Object({
      email: t.String({ maxLength: 255 }),
      password: t.String()
    })
  })
  .get('/users/current', async ({ getToken }) => {
    const token = getToken();
    const user = await getCurrentUser(token);
    return { data: user };
  })
  .delete('/users/logout', async ({ getToken }) => {
    const token = getToken();
    const result = await logoutUser(token);
    return { data: result };
  });
