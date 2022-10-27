import { Request, Response } from 'express';
import OrderStore, { Order } from '../models/order';

const store = new OrderStore();

export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const allOrders = await store.index();

    res.json(allOrders);
  } catch (error) {
    res.status(405).send('method failed:' + error);
  }
};

export const postNewOrder = async (req: Request, res: Response) => {
  const newOrder: Order = {
    status: req.body.status,
    user_id: req.body.user_id
  };

  try {
    const createdOrder = await store.create(newOrder);
    res.json(createdOrder);
  } catch (error) {
    res.status(405).send('method failed:' + error);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await store.read(req.params.orderId);
    res.json(order);
  } catch (error) {
    res.status(405).send('method failed:' + error);
  }
};

export const putOrder = async (req: Request, res: Response) => {
  const newOrder: Order = {
    id: parseInt(req.params.orderId),
    status: req.body.status,
    user_id: req.body.user_id
  };

  try {
    const updatedOrder = await store.update(newOrder);

    res.json(updatedOrder);
  } catch (error) {
    res.status(405).send('method failed:' + error);
  }
};

export const deleteOrderById = async (req: Request, res: Response) => {
  try {
    const order = await store.delete(req.params.orderId);
    res.json(order);
  } catch (error) {
    res.status(405).send('method failed:' + error);
  }
};

export const getProductsByOrderId = async (req: Request, res: Response) => {
  try {
    const products = await store.getProductsByOrderId(req.params.orderId);
    res.json(products);
  } catch (error) {
    res.status(405).send('method failed:' + error);
  }
};

export const postProductByOrderId = async (req: Request, res: Response) => {
  try {
    const product = await store.postProductsByOrderId(
      req.params.orderId,
      req.body.product_id,
      req.body.quantity
    );
    res.json(product);
  } catch (error) {
    res.status(405).send('method failed:' + error);
  }
};
