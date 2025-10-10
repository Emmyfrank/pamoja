import { login } from "./auth.controller.js";
import {
  createProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
} from "./product.controller.js";
import { register } from "./auth.controller.js";

export {
  login,
  register,
  createProduct,
  getAllProducts,
  getOneProduct,
  updateProduct,
  deleteProduct,
};
