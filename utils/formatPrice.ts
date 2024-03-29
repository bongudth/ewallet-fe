import { TransactionType } from '~/constants';

export const formatPriceWithComma = (price: string) => {
  const priceWithoutComma = price.replace(/,/g, '');
  const regex = /(?<sign>-?)(?<number>\d+)/;
  const { groups } = regex.exec(priceWithoutComma) || {};
  if (!groups) {
    return price;
  }

  const { sign, number } = groups;
  return `${sign}${number.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
};

export const formatPriceWithCurrency = (price: number) => {
  if (price === undefined || price === null) {
    return '0 VND';
  }
  return `${formatPriceWithComma(price.toString())} VND`;
};

export const formatPriceWithNumber = (price: string) => {
  return Number(price.replace(/,/g, ''));
};

export const formatPriceWithTransactionType = (
  price: number,
  type: string,
  walletId: number,
  fromWalletId?: number,
  toWalletId?: number
) => {
  switch (type) {
    case TransactionType.INCOME:
      return `+${formatPriceWithCurrency(price)}`;
    case TransactionType.EXPENSE:
      return `-${formatPriceWithCurrency(price)}`;
    case TransactionType.TRANSFER:
      if (walletId === fromWalletId) {
        return `-${formatPriceWithCurrency(price)}`;
      }
      if (walletId === toWalletId) {
        return `+${formatPriceWithCurrency(price)}`;
      }
      return formatPriceWithCurrency(price);
    default:
      return formatPriceWithCurrency(price);
  }
};
