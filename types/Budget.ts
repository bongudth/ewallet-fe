import { Category } from './Category';
import { Wallet } from './Wallet';

export type Budget = {
  id: number;
  createdAt: string;
  updatedAt: string;
  name: string;
  amount: number;
  categories: Category[] | string[];
  wallets: Wallet[] | string[];
};
