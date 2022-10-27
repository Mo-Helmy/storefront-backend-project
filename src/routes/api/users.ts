import express from 'express';
import {
  authUser,
  createUser,
  getAllUsers,
  getOrdersByUserId,
  getProductsByOrderId,
  getUserById
} from '../../controllers/users';
import authenticate from '../../middleware/authenticate';
import autherization from '../../middleware/autherization';
// import { getOrdersAndProductsByUserId } from '../../services/orders';

const usersRoute = express.Router();

//show all users
usersRoute.get('/', authenticate, getAllUsers);

//create new user (will generate new token)
usersRoute.post('/', createUser);

//auth user (will generate new token)
usersRoute.post('/auth', authUser);

//show user by userId
usersRoute.get('/:userId', autherization, getUserById);

//show user orders by userId
// and
//show orders by status query for userId '/:userId/orders/status?status=active'
usersRoute.get('/:userId/orders', autherization, getOrdersByUserId);

//show order products by userId for each orderId
usersRoute.get('/:userId/orders/:orderId', autherization, getProductsByOrderId);

export default usersRoute;
