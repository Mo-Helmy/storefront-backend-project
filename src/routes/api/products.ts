import express from 'express';
import {
  deleteProductById,
  getAllProducts,
  getProductById,
  getTopProducts,
  postNewProduct,
  putProduct
} from '../../controllers/produts';
import authenticate from '../../middleware/authenticate';

const productsRoute = express.Router();

// get all products
// OR get all products by query category '/api/products?category=cat1'
productsRoute.get('/', getAllProducts);

//Top 5 popular products (add query limit 'api/procucts/popular?limit=5')
productsRoute.get('/popular', getTopProducts);

//show product by id
productsRoute.get('/:productId', getProductById);

//create new product
productsRoute.post('/', authenticate, postNewProduct);

//update product
productsRoute.put('/:productId', authenticate, putProduct);

//delete product by id
productsRoute.delete('/:productId', authenticate, deleteProductById);

export default productsRoute;
