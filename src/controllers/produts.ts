import { Request, Response } from 'express';
import ProductStore, { Product } from '../models/product';

const store = new ProductStore();

export const getAllProducts = async (req: Request, res: Response) => {
  try {
    if (req.query.category) {
      const filteredProducts = await store.showByCategory(
        req.query.category as string
      );
      res.json(filteredProducts);
    } else {
      const allProducts = await store.index();
      res.json(allProducts);
    }
  } catch (error) {
    res.status(405).json(`method failed Error: ${error}`);
  }
};

export const postNewProduct = async (req: Request, res: Response) => {
  const newProduct: Product = {
    name: req.body.name,
    price: req.body.price,
    category: req.body.category
  };

  try {
    const createdProduct = await store.create(newProduct);
    res.json(createdProduct);
  } catch (error) {
    res.status(405).json(`method failed Error: ${error}`);
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await store.read(req.params.productId);

    res.json(product);
  } catch (error) {
    res.status(405).json(`method failed Error: ${error}`);
  }
};

export const putProduct = async (req: Request, res: Response) => {
  const newProduct: Product = {
    id: parseInt(req.params.productId),
    name: req.body.name,
    price: req.body.price,
    category: req.body.category
  };

  try {
    const updatedProduct = await store.update(newProduct);
    res.json(updatedProduct);
  } catch (error) {
    res.status(405).json(`method failed Error: ${error}`);
  }
};

export const deleteProductById = async (req: Request, res: Response) => {
  try {
    const product = await store.delete(req.params.productId);
    res.json(product);
  } catch (error) {
    res.status(405).json(`method failed Error: ${error}`);
  }
};

export const getTopProducts = async (req: Request, res: Response) => {
  try {
    const limit = req.query.limit ?? '5';
    const topProducts = await store.topProducts(limit as string);
    res.json(topProducts);
  } catch (error) {
    res.status(405).json(`method failed Error: ${error}`);
  }
};
