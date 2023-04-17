export const calcTotalPrice = (carts: any, key: 'productOldPrice' | 'productPrice') => {
  const totalPrice = carts.reduce((prevTotal: number, currentTotal: any) => {
    return prevTotal + currentTotal[key] * currentTotal.quantity;
  }, 0);
  return totalPrice;
};

export const calcPriceWithShippingFee = (totalPrice: number, shippingFee: number, voucherSale = 0) => {
  const total = totalPrice + shippingFee - voucherSale;
  return total;
};
