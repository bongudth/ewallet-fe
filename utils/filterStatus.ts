import { TransactionType } from '~/constants';

export const getStatusVariant = (status: string) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'inactive':
      return 'danger';
    default:
      return 'primary';
  }
};

export const getTypeVariant = (type: string) => {
  switch (type) {
    case TransactionType.INCOME:
      return 'success';
    case TransactionType.EXPENSE:
      return 'danger';
    case TransactionType.TRANSFER:
      return 'warning';
    default:
      return 'primary';
  }
};
