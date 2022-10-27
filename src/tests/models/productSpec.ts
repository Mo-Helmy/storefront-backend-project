import ProductStore, { Product } from '../../models/product';

const store = new ProductStore();

let product1: Product;
let product2: Product;

describe('test product store model', () => {
  it('create new product', async () => {
    product1 = await store.create({
      name: 'book',
      price: 55,
      category: 'cat1'
    });
    product2 = await store.create({
      name: 'video game',
      price: 33,
      category: 'cat1'
    });

    expect(product1.name).toBe('book');
    expect(product1.price).toBe(55);
    expect(product1.category).toBe('cat1');

    expect(product2.name).toBe('video game');
    expect(product2.price).toBe(33);
    expect(product2.category).toBe('cat1');
  });

  it('show product by id', async () => {
    const product1Id = product1.id as number;
    const product2Id = product2.id as number;
    product1 = await store.read(product1Id.toLocaleString());
    product2 = await store.read(product2Id.toLocaleString());

    expect(product1.name).toBe('book');
    expect(product1.price).toBe(55);
    expect(product1.category).toBe('cat1');

    expect(product2.name).toBe('video game');
    expect(product2.price).toBe(33);
    expect(product2.category).toBe('cat1');
  });

  it('index all products', async () => {
    const result = await store.index();
    expect(result.length).toBe(2);

    expect(result[0].name).toBe('book');
    expect(result[0].price).toBe(55);
    expect(result[0].category).toBe('cat1');

    expect(result[1].name).toBe('video game');
    expect(result[1].price).toBe(33);
    expect(result[1].category).toBe('cat1');
  });

  it('update product', async () => {
    product1 = await store.update({
      id: product1.id,
      name: 'new book',
      price: 55.99,
      category: 'cat2'
    });
    product2 = await store.update({
      id: product2.id,
      name: 'new video game',
      price: 33.99,
      category: 'cat3'
    });

    expect(product1.name).toBe('new book');
    expect(product1.price).toBe(55.99);
    expect(product1.category).toBe('cat2');

    expect(product2.name).toBe('new video game');
    expect(product2.price).toBe(33.99);
    expect(product2.category).toBe('cat3');
  });

  it('show products by category', async () => {
    const result = await store.showByCategory('cat2');

    expect(result.length).toBe(1);

    expect(result[0].id).toBe(product1.id);
    expect(result[0].name).toBe('new book');
    expect(result[0].price).toBe(55.99);
  });

  it('delete product', async () => {
    product2 = await store.delete(product2.id as unknown as string);

    expect(product2).toBeUndefined;
  });

  afterAll(async () => {
    await store.deleteAll();
  });
});
