import express from 'express';
import ordersRoute from './api/orders';
import productsRoute from './api/products';
import usersRoute from './api/users';

const routes = express.Router();

routes.use('/products', productsRoute);
routes.use('/users', usersRoute);
routes.use('/orders', ordersRoute);

routes.get('/', (req, res) => {
  res.send('api route');
});

export default routes;
