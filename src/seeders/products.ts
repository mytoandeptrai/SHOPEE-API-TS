import { books, clock, electric, fashionBoy, fashionGirl, laptop, lifeHouse, phone, sportTravel } from 'data';
import foodShop from 'data/products/foodShop';

const productSeeders = phone.concat(
  fashionBoy,
  fashionGirl,
  books,
  sportTravel,
  foodShop,
  clock,
  lifeHouse,
  laptop,
  electric
);

export default productSeeders;
