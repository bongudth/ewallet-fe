import { NuxtAppOptions } from '@nuxt/types/app';
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { User } from '~/types/User';

import RestService from './RestService';

export const initApiServices = (
  axios: NuxtAxiosInstance,
  app?: NuxtAppOptions
) => ({
  users: new RestService<User>(axios, 'users', app),
});

export type ServiceFactory = ReturnType<typeof initApiServices>;

export default initApiServices;
