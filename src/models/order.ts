import { QueryResult, QueryResultRow } from 'pg';
import clint from '../database';

export type Order = {
  id?: number;
  status: string;
  user_id: number;
};

class OrderStore {
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
    try {
      const sql = 'SELECT * FROM orders;';
      const result = await this.runQuery(sql);
      return result.rows;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async create(order: Order) {
    const sql =
      'INSERT INTO orders (status, user_id) VALUES ($1, $2) RETURNING *;';
    try {
      const result = await this.runQuery(sql, [order.status, order.user_id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async read(id: string) {
    const sql = 'SELECT * FROM orders WHERE id=$1;';
    try {
      const result = await this.runQuery(sql, [id]);
      return result.rows[0];
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async update(order: Order) {
    const sql =
      'UPDATE orders SET status=$1, user_id=$2 WHERE id=$3 RETURNING *;';
    try {
      const result = await this.runQuery(sql, [
        order.status,
        order.user_id,
        order.id
      ]);

      return result.rows[0];
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async delete(id: string) {
    const sql = 'DELETE FROM orders WHERE id=$1 RETURNING *;';

    try {
      const result = await this.runQuery(sql, [id]);
      console.log(result.rows);

      return result.rows[0];
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async getOrdersByUserId(userId: string) {
    const sql = 'SELECT * FROM orders WHERE user_id=$1;';

    try {
      const result = await this.runQuery(sql, [userId]);
      return result.rows;
    } catch (error) {
      throw new Error(`${error}`);
    }
  }

  async postProductsByOrderId(
    orderId: string,
    product_id: string,
    quantity: number
  ) {
    const order: Order = await this.read(orderId);
    if (order && order.status === 'active') {
      const sql =
        'INSERT INTO order_products (order_id, product_id, quantity) VALUES ($1, $2, $3) RETURNING *;';

      const result = await this.runQuery(sql, [orderId, product_id, quantity]);

      return result.rows[0];
    } else {
      if (!order) {
        throw new Error(`orderId: ${orderId} Not Found`);
      } else if (order.status === 'complete') {
        throw new Error(
          `order:${orderId} status is "complete", to add new product order's status should be "active"`
        );
      }
    }
  }

  async getProductsByOrderId(orderId: string) {
    const order = await this.read(orderId);
    if (order) {
      const sql =
        'SELECT products.id, name, price, category, quantity FROM products INNER JOIN order_products ON products.id = order_products.product_id WHERE order_id=$1;';

      const result = await this.runQuery(sql, [orderId]);

      return result.rows;
    } else {
      throw new Error(`orderId: ${orderId} Not Found`);
    }
  }

  async deleteAll() {
    const sql = 'DELETE FROM orders;';
    await this.runQuery(sql);
  }
}

export default OrderStore;
