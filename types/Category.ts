import { CategoryType } from '~/constants';

export type Category = {
  id: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
  parentId: number | null;
  name: string;
  icon: string;
  type: CategoryType.EXPENSE | CategoryType.INCOME;
  children: Category[];
};
