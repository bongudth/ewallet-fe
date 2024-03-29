import { TransactionType } from '~/constants';

export type Category = {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  parentId: number | null;
  name: string;
  icon: string;
  type:
    | TransactionType.EXPENSE
    | TransactionType.INCOME
    | TransactionType.TRANSFER;
  children: Category[];
};
