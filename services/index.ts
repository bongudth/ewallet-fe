import { NuxtAppOptions } from '@nuxt/types/app';
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { Wallet } from '~/types/Wallet';

import RestService from './RestService';

export const initApiServices = (
  axios: NuxtAxiosInstance,
  app?: NuxtAppOptions
) => ({
  wallets: new RestService<Wallet>(axios, 'wallets', app),
});

export type ServiceFactory = ReturnType<typeof initApiServices>;

export default initApiServices;
