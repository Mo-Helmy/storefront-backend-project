import supertest from 'supertest';
import jwt, { JwtPayload } from 'jsonwebtoken';
import app from '../../server';
import { UserTestingResponse } from './usersSpec';
import UserStore from '../../models/user';
import ProductStore, { Product } from '../../models/product';
import OrderStore, { Order } from '../../models/order';

const request = supertest(app);

let order1: Order;
let order2: Order;
let product: Product;
let user: UserTestingResponse;
let token: string;

describe('test responses from orders endpoint', () => {
  beforeAll(async () => {
    let response = await request.post('/api/users').send({
      username: 'mohelmy',
      firstname: 'mo',
      lastname: 'helmy',
      password: 'mypassword'
    });

    token = response.body;
    const payload = jwt.decode(token) as JwtPayload;
    user = payload.user;

    response = await request
      .post('/api/products')
      .send({
        name: 'book',
        price: 22,
        category: 'cat1'
      })
      .set('Authorization', `Bearer ${token}`);

    product = response.body;
  });

  it('create a valid user', async () => {
    expect(user.id).toEqual(jasmine.any(Number));
    expect(user.username).toEqual('mohelmy');
  });

  it('create a valid product', async () => {
    expect(product.id).toEqual(jasmine.any(Number));
    expect(product.name).toEqual('book');
  });

  it('create new order', async () => {
    let response = await request
      .post('/api/orders')
      .send({
        status: 'active',
        user_id: user.id
      })
      .set('Authorization', `Bearer ${token}`);

    order1 = response.body;

    expect(order1.id).toEqual(jasmine.any(Number));
    expect(order1.status).toEqual('active');
    expect(order1.user_id).toEqual(user.id);

    response = await request
      .post('/api/orders')
      .send({
        status: 'complete',
        user_id: user.id
      })
      .set('Authorization', `Bearer ${token}`);

    order2 = response.body;

    expect(order2.id).toEqual(jasmine.any(Number));
    expect(order2.status).toEqual('complete');
    expect(order2.user_id).toEqual(user.id);
  });

  it('get order by id', async () => {
    const response = await request
      .get(`/api/orders/${order1.id}`)
      .set('Authorization', `Bearer ${token}`);

    const orderById = response.body;

    expect(orderById.id).toEqual(order1.id);
    expect(orderById.status).toEqual(order1.status);
    expect(orderById.user_id).toEqual(order1.user_id);
  });

  it('get all orders', async () => {
    const response = await request
      .get(`/api/orders`)
      .set('Authorization', `Bearer ${token}`);

    const allOrders = response.body;

    expect(allOrders.length).toEqual(2);

    expect(allOrders[0].id).toEqual(order1.id);
    expect(allOrders[0].status).toEqual(order1.status);
    expect(allOrders[0].user_id).toEqual(order1.user_id);

    expect(allOrders[1].id).toEqual(order2.id);
    expect(allOrders[1].status).toEqual(order2.status);
    expect(allOrders[1].user_id).toEqual(order2.user_id);
  });

  it('update order', async () => {
    const response = await request
      .put(`/api/orders/${order2.id}`)
      .send({
        status: 'active',
        user_id: user.id
      })
      .set('Authorization', `Bearer ${token}`);

    order2 = response.body;

    expect(order2.status).toEqual('active');
  });

  it('add products by orderId', async () => {
    let response = await request
      .post(`/api/orders/${order1.id}/products`)
      .send({
        product_id: product.id,
        quantity: 10
      })
      .set('Authorization', `Bearer ${token}`);

    const orderProducts1 = response.body;

    expect(orderProducts1.order_id).toEqual(order1.id);
    expect(orderProducts1.product_id).toEqual(product.id);
    expect(orderProducts1.quantity).toEqual(10);

    response = await request
      .post(`/api/orders/${order2.id}/products`)
      .send({
        product_id: product.id,
        quantity: 30
      })
      .set('Authorization', `Bearer ${token}`);

    const orderProducts2 = response.body;

    expect(orderProducts2.order_id).toEqual(order2.id);
    expect(orderProducts2.product_id).toEqual(product.id);
    expect(orderProducts2.quantity).toEqual(30);
  });

  it('get all products by orderId', async () => {
    let response = await request
      .get(`/api/orders/${order1.id}/products`)
      .set('Authorization', `Bearer ${token}`);

    const order1Products = response.body;

    expect(order1Products.length).toEqual(1);

    expect(order1Products[0].id).toEqual(product.id);
    expect(order1Products[0].name).toEqual(product.name);
    expect(order1Products[0].price).toEqual(product.price);
    expect(order1Products[0].category).toEqual(product.category);
    expect(order1Products[0].quantity).toEqual(10);

    response = await request
      .get(`/api/orders/${order2.id}/products`)
      .set('Authorization', `Bearer ${token}`);

    const order2Products = response.body;

    expect(order2Products.length).toEqual(1);

    expect(order2Products[0].id).toEqual(product.id);
    expect(order2Products[0].name).toEqual(product.name);
    expect(order2Products[0].price).toEqual(product.price);
    expect(order2Products[0].category).toEqual(product.category);
    expect(order2Products[0].quantity).toEqual(30);
  });
  describe('test top products endpoint', () => {
    it('get top products', async () => {
      const response = await request.get(`/api/products/popular?limit=5`);

      const topProducts = response.body;

      expect(topProducts.length).toEqual(1);

      expect(topProducts[0].id).toEqual(product.id);
      expect(topProducts[0].name).toEqual(product.name);
      expect(topProducts[0].price).toEqual(product.price);
      expect(topProducts[0].category).toEqual(product.category);
      expect(topProducts[0].total_qty).toEqual('40');
    });
  });

  describe('test user orders endpoint', () => {
    it('show user orders by userId', async () => {
      const response = await request
        .get(`/api/users/${user.id}/orders`)
        .set('Authorization', `Bearer ${token}`);

      const userOrders = response.body;

      expect(userOrders.length).toEqual(2);

      expect(userOrders[0].id).toEqual(order1.id);
      expect(userOrders[0].status).toEqual(order1.status);

      expect(userOrders[1].id).toEqual(order2.id);
      expect(userOrders[1].status).toEqual(order2.status);
    });

    it('show orders by status query for userId', async () => {
      let response = await request
        .get(`/api/users/${user.id}/orders?status=active`)
        .set('Authorization', `Bearer ${token}`);

      let userOrdersByStatus = response.body;

      expect(userOrdersByStatus.length).toEqual(2);

      expect(userOrdersByStatus[0].id).toEqual(order1.id);
      expect(userOrdersByStatus[0].status).toEqual(order1.status);

      expect(userOrdersByStatus[1].id).toEqual(order2.id);
      expect(userOrdersByStatus[1].status).toEqual(order2.status);

      response = await request
        .get(`/api/users/${user.id}/orders?status=complete`)
        .set('Authorization', `Bearer ${token}`);

      userOrdersByStatus = response.body;

      expect(userOrdersByStatus.length).toEqual(0);
    });

    it('show order products by userId for each orderId', async () => {
      let response = await request
        .get(`/api/users/${user.id}/orders/${order1.id}`)
        .set('Authorization', `Bearer ${token}`);

      const userOrder1Products = response.body;

      expect(userOrder1Products.length).toEqual(1);

      expect(userOrder1Products[0].id).toEqual(product.id);
      expect(userOrder1Products[0].name).toEqual(product.name);
      expect(userOrder1Products[0].price).toEqual(product.price);
      expect(userOrder1Products[0].quantity).toEqual(10);

      response = await request
        .get(`/api/users/${user.id}/orders/${order2.id}`)
        .set('Authorization', `Bearer ${token}`);

      const userOrder2Products = response.body;

      expect(userOrder2Products.length).toEqual(1);

      expect(userOrder2Products[0].id).toEqual(product.id);
      expect(userOrder2Products[0].name).toEqual(product.name);
      expect(userOrder2Products[0].price).toEqual(product.price);
      expect(userOrder2Products[0].quantity).toEqual(30);
    });
  });

  afterAll(async () => {
    const userStore = new UserStore();
    const productStore = new ProductStore();
    const orderStore = new OrderStore();
    await userStore.deleteAll();
    await productStore.deleteAll();
    await orderStore.deleteAll();
  });
});
