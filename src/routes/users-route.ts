import { Elysia, t } from 'elysia';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../services/users-service';

export const usersRoute = new Elysia({ prefix: '/api' })
  .post('/users', async ({ body, set }) => {
    try {
      const result = await registerUser(body);
      return { data: result };
    } catch (error: any) {
      if (error.message === 'Email Sudah Terdaftar') {
        set.status = 400;
        return { error: error.message };
      }
      set.status = 500;
      return { error: 'Internal Server Error' };
    }
  }, {
    body: t.Object({
      name: t.String(),
      email: t.String(),
      password: t.String()
    })
  })
  .post('/users/login', async ({ body, set }) => {
    try {
      const token = await loginUser(body);
      return { data: token };
    } catch (error: any) {
      if (error.message === 'Email atau Password Salah') {
        set.status = 400;
        return { error: error.message };
      }
      set.status = 500;
      return { error: 'Internal Server Error' };
    }
  }, {
    body: t.Object({
      email: t.String(),
      password: t.String()
    })
  })
  .get('/users/current', async ({ headers, set }) => {
    try {
      const auth = headers['authorization'];
      if (!auth || !auth.startsWith('Bearer ')) {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      const token = auth.split(' ')[1];
      const user = await getCurrentUser(token);
      return { data: user };
    } catch (error: any) {
      set.status = 401;
      return { error: 'Unauthorized' };
    }
  })
  .delete('/users/logout', async ({ headers, set }) => {
    try {
      const auth = headers['authorization'];
      if (!auth || !auth.startsWith('Bearer ')) {
        set.status = 401;
        return { error: 'Unauthorized' };
      }

      const token = auth.split(' ')[1];
      const result = await logoutUser(token);
      return { data: result };
    } catch (error: any) {
      set.status = 401;
      return { error: 'Unauthorized' };
    }
  });
