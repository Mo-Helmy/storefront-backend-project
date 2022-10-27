import OrderStore, { Order } from '../../models/order';
import ProductStore, { Product } from '../../models/product';
import UserStore from '../../models/user';
import { UserTesting } from './userSpec';
// import ProductStore, { Product } from '../../models/product';

// const store = new ProductStore();
const orderStore = new OrderStore();
const producStore = new ProductStore();
const userStore = new UserStore();

let order1: Order;
let order2: Order;
let product1: Product;
let product2: Product;
let user1: UserTesting;
let user2: UserTesting;
let productsQuantityByOrder1: number;
let productsQuantityByOrder2: number;

describe('test order store model', () => {
  beforeAll(async () => {
    product1 = await producStore.create({
      name: 'book',
      price: 12,
      category: 'cat1'
    });
    product2 = await producStore.create({
      name: 'game',
      price: 15,
      category: 'cat2'
    });
    user1 = await userStore.create({
      username: 'mohelmy',
      firstName: 'mo',
      lastName: 'helmy',
      password: 'mypassword'
    });
    user2 = await userStore.create({
      username: 'modiab',
      firstName: 'mo',
      lastName: 'diab',
      password: 'mypassword'
    });
  });

  it('create new order', async () => {
    order1 = await orderStore.create({
      user_id: user1.id as unknown as number,
      status: 'active'
    });
    order2 = await orderStore.create({
      user_id: user2.id as unknown as number,
      status: 'complete'
    });

    expect(order1.user_id).toBe(user1.id as unknown as number);
    expect(order1.status).toBe('active');

    expect(order2.user_id).toBe(user2.id as unknown as number);
    expect(order2.status).toBe('complete');
  });

  it('show order by order id', async () => {
    order1 = await orderStore.read(order1.id?.toLocaleString() as string);
    order2 = await orderStore.read(order2.id?.toLocaleString() as string);

    expect(order1.user_id).toBe(user1.id as unknown as number);
    expect(order1.status).toBe('active');

    expect(order2.user_id).toBe(user2.id as unknown as number);
    expect(order2.status).toBe('complete');
  });

  it('index all orders', async () => {
    const result = await orderStore.index();

    expect(result.length).toBe(2);

    expect(result[0].user_id).toBe(user1.id);
    expect(result[0].status).toBe('active');

    expect(result[1].user_id).toBe(user2.id);
    expect(result[1].status).toBe('complete');
  });

  it('update order', async () => {
    order2 = await orderStore.update({
      id: order2.id,
      status: 'active',
      user_id: order2.user_id
    });

    expect(order2.status).toBe('active');
  });

  it('get orders by user id', async () => {
    const ordersByUser1 = await orderStore.getOrdersByUserId(
      user1.id as unknown as string
    );
    const ordersByUser2 = await orderStore.getOrdersByUserId(
      user2.id as unknown as string
    );

    expect(ordersByUser1.length).toBe(1);
    expect(ordersByUser2.length).toBe(1);

    expect(ordersByUser1[0].user_id).toBe(user1.id);
    expect(ordersByUser1[0].status).toBe('active');

    expect(ordersByUser2[0].user_id).toBe(user2.id);
    expect(ordersByUser2[0].status).toBe('active');
  });

  it('post products by order id', async () => {
    const orderProductsByOrder1 = await orderStore.postProductsByOrderId(
      order1.id as unknown as string,
      product1.id as unknown as string,
      5
    );
    const orderProductsByOrder2 = await orderStore.postProductsByOrderId(
      order2.id as unknown as string,
      product2.id as unknown as string,
      20
    );

    productsQuantityByOrder1 = orderProductsByOrder1.quantity;
    productsQuantityByOrder2 = orderProductsByOrder2.quantity;

    expect(orderProductsByOrder1.order_id).toBe(order1.id);
    expect(orderProductsByOrder1.product_id).toBe(product1.id);
    expect(orderProductsByOrder1.quantity).toBe(5);

    expect(orderProductsByOrder2.order_id).toBe(order2.id);
    expect(orderProductsByOrder2.product_id).toBe(product2.id);
    expect(orderProductsByOrder2.quantity).toBe(20);
  });

  it('get products by order id', async () => {
    const orderProductsByOrder1 = await orderStore.getProductsByOrderId(
      order1.id as unknown as string
    );
    const orderProductsByOrder2 = await orderStore.getProductsByOrderId(
      order2.id as unknown as string
    );

    expect(orderProductsByOrder1.length).toBe(1);
    expect(orderProductsByOrder2.length).toBe(1);

    expect(orderProductsByOrder1[0].id).toBe(product1.id);
    expect(orderProductsByOrder1[0].name).toBe(product1.name);
    expect(orderProductsByOrder1[0].price).toBe(product1.price);
    expect(orderProductsByOrder1[0].category).toBe(product1.category);
    expect(orderProductsByOrder1[0].quantity).toBe(productsQuantityByOrder1);

    expect(orderProductsByOrder2[0].id).toBe(product2.id);
    expect(orderProductsByOrder2[0].name).toBe(product2.name);
    expect(orderProductsByOrder2[0].price).toBe(product2.price);
    expect(orderProductsByOrder2[0].category).toBe(product2.category);
    expect(orderProductsByOrder2[0].quantity).toBe(productsQuantityByOrder2);
  });

  describe('test user model', () => {
    it('get user orders by status', async () => {
      const user1ActiveOrders = await userStore.getUserOrdersByStatus(
        user1.id as unknown as string,
        'active'
      );
      const user1CompleteOrders = await userStore.getUserOrdersByStatus(
        user1.id as unknown as string,
        'complete'
      );

      expect(user1ActiveOrders.length).toBe(1);
      expect(user1ActiveOrders[0].id).toBe(order1.id);
      expect(user1ActiveOrders[0].status).toBe('active');
      expect(user1ActiveOrders[0].user_id).toBe(user1.id);

      expect(user1CompleteOrders.length).toBe(0);
    });
  });

  afterAll(async () => {
    await orderStore.deleteAll();
    await producStore.deleteAll();
    await userStore.deleteAll();
  });
});
