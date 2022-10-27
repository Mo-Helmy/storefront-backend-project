import { QueryResult, QueryResultRow } from 'pg';
import clint from '../database';

export type Product = {
  id?: number;
  name: string;
  price: number;
  category?: string;
};

class ProductStore {
  protected async runQuery(
    sql: string,
    params?: (string | number | undefined)[]
  ): Promise<QueryResultRow | QueryResult> {
    try {
      const conn = await clint.connect();
      const result = await conn.query(sql, params);
      conn.release();
      return result;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }
  async index() {
    const sql = 'SELECT * FROM products;';

    const result = await this.runQuery(sql);
    return result.rows;
  }

  async create(product: Product) {
    const sql =
      'INSERT INTO products (name, price, category) VALUES ($1, $2, $3) RETURNING *;';

    const result = await this.runQuery(sql, [
      product.name,
      product.price,
      product.category
    ]);
    return result.rows[0];
  }

  async read(id: string) {
    const sql = 'SELECT * FROM products WHERE id=$1;';

    const result = await this.runQuery(sql, [id]);

    return result.rows[0];
  }

  async update(product: Product) {
    const sql =
      'UPDATE products SET name=$1, price=$2, category=$3 WHERE id=$4 RETURNING *;';

    const result = await this.runQuery(sql, [
      product.name,
      product.price,
      product.category,
      product.id
    ]);

    return result.rows[0];
  }

  async delete(id: string) {
    const sql = 'DELETE FROM products WHERE id=$1;';

    const result = await this.runQuery(sql, [id]);
    return result.rows[0];
  }

  async topProducts(limit: string) {
    const sql =
      'SELECT products.id, name, price, category, SUM(quantity) AS "total_qty" FROM products INNER JOIN order_products ON products.id=order_products.product_id GROUP BY products.id ORDER BY total_qty DESC LIMIT $1;';
    const result = await this.runQuery(sql, [limit]);
    return result.rows;
  }

  async showByCategory(cat: string) {
    const sql = 'SELECT * FROM products WHERE category=$1;';
    const result = await this.runQuery(sql, [cat]);
    return result.rows;
  }

  async deleteAll() {
    const sql = 'DELETE FROM products;';
    await this.runQuery(sql);
  }
}

export default ProductStore;
