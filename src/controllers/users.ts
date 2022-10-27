import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import UserStore, { User } from '../models/user';

const store = new UserStore();

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const allUsers = await store.index();
    res.json(allUsers);
  } catch (error) {
    res.status(405).send('method failed:' + error);
  }
};

export const createUser = async (req: Request, res: Response) => {
  const newUser: User = {
    username: req.body.username,
    firstName: req.body.firstname,
    lastName: req.body.lastname,
    password: req.body.password
  };
  try {
    const createdUser: User = await store.create(newUser);
    const token = jwt.sign(
      { user: createdUser },
      process.env.TOKEN_SECRET as string
    );
    res.json(token);
  } catch (error) {
    res.status(401).json('create new user failed!' + error);
  }
};

export const authUser = async (req: Request, res: Response) => {
  const user: User = {
    username: req.body.username,
    password: req.body.password
  };
  try {
    const authUser: User = await store.authenticate(user);
    if (authUser) {
      const token = jwt.sign(
        { user: authUser },
        process.env.TOKEN_SECRET as string
      );
      res.json(token);
    } else {
      res.status(401).json('authentication failed!');
    }
  } catch (error) {
    res.status(401).json('authentication failed!' + error);
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await store.show(req.params.userId);
    user ? res.json(user) : res.status(404).json('user not found!');
  } catch (error) {
    res.status(405).json('method failed!' + error);
  }
};

export const getOrdersByUserId = async (req: Request, res: Response) => {
  if (req.query.status) {
    try {
      const filteredOrders = await store.getUserOrdersByStatus(
        req.params.userId,
        req.query.status as string
      );
      res.json(filteredOrders);
    } catch (error) {
      res.status(405).json('method failed!' + error);
    }
  } else {
    try {
      const orders = await store.getOrdersByUserId(req.params.userId);
      res.json(orders);
    } catch (error) {
      res.status(405).json('method failed!' + error);
    }
  }
};

export const getProductsByOrderId = async (req: Request, res: Response) => {
  try {
    const products = await store.getProductsByOrderAndUserId(
      req.params.orderId
    );
    res.json(products);
  } catch (error) {
    res.status(405).json('method failed!' + error);
  }
};
