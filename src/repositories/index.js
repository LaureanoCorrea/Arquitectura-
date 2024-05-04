import { CartsDao, ProductDao, UserDao } from "../dao/factory.js";
import UserRepository from "./users.repository.js";
import CartRepository from "./cart.repository.js";
import ProductRepository from "./products.repository.js";

const userService = new UserRepository(new UserDao());
const cartService = new CartRepository(new CartsDao());
const productService = new ProductRepository(new ProductDao());


export { userService, cartService, productService }