import supertest from 'supertest';
import ProductStore, { Product } from '../../models/product';
import app from '../../server';
import UserStore from '../../models/user';

const request = supertest(app);

let product: Product;
let product2: Product;

let token: string;

describe('test responses from products endpoint', () => {
  beforeAll(async () => {
    const userResponse = await request.post('/api/users').send({
      username: 'mohelmy',
      firstname: 'mo',
      lastname: 'helmy',
      password: 'mypassword'
    });

    token = userResponse.body;
  });

  it('create new product', async () => {
    let response = await request
      .post('/api/products')
      .send({
        name: 'book',
        price: 22,
        category: 'cat1'
      })
      .set('Authorization', `Bearer ${token}`);

    product = response.body;

    expect(product.id).toEqual(jasmine.any(Number));
    expect(product.name).toEqual('book');
    expect(product.price).toEqual(22);
    expect(product.category).toEqual('cat1');

    response = await request
      .post('/api/products')
      .send({
        name: 'game',
        price: 44,
        category: 'cat1'
      })
      .set('Authorization', `Bearer ${token}`);

    product2 = response.body;

    expect(product2.id).toEqual(jasmine.any(Number));
    expect(product2.name).toEqual('game');
    expect(product2.price).toEqual(44);
    expect(product2.category).toEqual('cat1');
  });

  it('update product', async () => {
    const response = await request
      .put(`/api/products/${product.id}`)
      .send({
        name: 'new book',
        price: 33,
        category: 'cat2'
      })
      .set('Authorization', `Bearer ${token}`);

    product = response.body;

    expect(product.id).toEqual(product.id);
    expect(product.name).toEqual('new book');
    expect(product.price).toEqual(33);
    expect(product.category).toEqual('cat2');
  });

  it('get all product', async () => {
    const response = await request.get(`/api/products`);

    const allProducts = response.body;

    expect(allProducts.length).toEqual(2);

    expect(allProducts[0].id).toEqual(product2.id);
    expect(allProducts[0].name).toEqual('game');
    expect(allProducts[0].price).toEqual(44);
    expect(allProducts[0].category).toEqual('cat1');

    expect(allProducts[1].id).toEqual(product.id);
    expect(allProducts[1].name).toEqual('new book');
    expect(allProducts[1].price).toEqual(33);
    expect(allProducts[1].category).toEqual('cat2');
  });

  it('get all products by query category', async () => {
    const response = await request.get(`/api/products?category=cat2`);

    const allProducts = response.body;

    expect(allProducts.length).toEqual(1);

    expect(allProducts[0].id).toEqual(product.id);
    expect(allProducts[0].name).toEqual('new book');
    expect(allProducts[0].price).toEqual(33);
    expect(allProducts[0].category).toEqual('cat2');
  });

  it('get product by id', async () => {
    const response = await request.get(`/api/products/${product.id}`);

    const productById = response.body;

    expect(productById.id).toEqual(product.id);
    expect(productById.name).toEqual('new book');
    expect(productById.price).toEqual(33);
    expect(productById.category).toEqual('cat2');
  });

  afterAll(async () => {
    const userStore = new UserStore();
    const productStore = new ProductStore();
    await userStore.deleteAll();
    await productStore.deleteAll();
  });
});
