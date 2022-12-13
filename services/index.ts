import { NuxtAppOptions } from '@nuxt/types/app';
import { NuxtAxiosInstance } from '@nuxtjs/axios';
import { Budget } from '~/types/Budget';
import { Category } from '~/types/Category';
import { Transaction } from '~/types/Transaction';
import { Wallet } from '~/types/Wallet';

import RestService from './RestService';

export const initApiServices = (
  axios: NuxtAxiosInstance,
  app?: NuxtAppOptions
) => ({
  budgets: new RestService<Budget>(axios, 'budgets', app),
  categories: new RestService<Category>(axios, 'transaction-categories', app),
  transactions: new RestService<Transaction>(axios, 'transactions', app),
  wallets: new RestService<Wallet>(axios, 'wallets', app),
});

export type ServiceFactory = ReturnType<typeof initApiServices>;

export default initApiServices;
