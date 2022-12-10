import { NuxtAppOptions } from '@nuxt/types/app';
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { Category } from '~/types/Category';
import { Wallet } from '~/types/Wallet';

import RestService from './RestService';

export const initApiServices = (
  axios: NuxtAxiosInstance,
  app?: NuxtAppOptions
) => ({
  categories: new RestService<Category>(axios, 'transaction-categories', app),
  wallets: new RestService<Wallet>(axios, 'wallets', app),
});

export type ServiceFactory = ReturnType<typeof initApiServices>;

export default initApiServices;
