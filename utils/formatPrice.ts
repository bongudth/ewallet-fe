export const formatPriceWithComma = (price: string) => {
  const formattedPrice = price.replace(/\D/g, '');
  return formattedPrice.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
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
