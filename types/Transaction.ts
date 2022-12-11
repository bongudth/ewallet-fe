import { TransactionType } from '~/constants';

export type Transaction = {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  categoryId: number;
  customCategory: string | null;
  walletId: number;
  amount: number;
  fromWalletId: number;
  toWalletId: number;
  description: string;
  type:
    | TransactionType.EXPENSE
    | TransactionType.INCOME
    | TransactionType.TRANSFER;
};
