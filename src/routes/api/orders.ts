import express from 'express';
import {
  deleteOrderById,
  getAllOrders,
  getOrderById,
  getProductsByOrderId,
  postNewOrder,
  postProductByOrderId,
  putOrder
} from '../../controllers/orders';
import authenticate from '../../middleware/authenticate';

const ordersRoute = express.Router();

//index
ordersRoute.get('/', authenticate, getAllOrders);
//create
ordersRoute.post('/', authenticate, postNewOrder);
//read
ordersRoute.get('/:orderId', authenticate, getOrderById);
//update
ordersRoute.put('/:orderId', authenticate, putOrder);
//delete
ordersRoute.delete('/:orderId', authenticate, deleteOrderById);

//index all products by orderId
ordersRoute.get('/:orderId/products', authenticate, getProductsByOrderId);
//add products by orderId
ordersRoute.post('/:orderId/products', authenticate, postProductByOrderId);

export default ordersRoute;
