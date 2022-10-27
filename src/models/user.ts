import clint from '../database';
import bcrypt from 'bcrypt';
import { QueryResult, QueryResultRow } from 'pg';

export type User = {
  id?: number;
  username: string;
  firstName?: string;
  lastName?: string;
  password?: string;
};

const { BCRYPT_PASSWORD, SALT_ROUNDS } = process.env;

class UserStore {
  protected async runQuery(
    sql: string,
    params?: (string | number | undefined)[]
  ): Promise<QueryResultRow | QueryResult> {
    const conn = await clint.connect();
    const result = await conn.query(sql, params);
    conn.release();
    return result;
  }

  async index() {
    const sql = 'SELECT * FROM users;';

    const result = await this.runQuery(sql);
    return result.rows;
  }

  async create(user: User) {
    const sql =
      'INSERT INTO users (username, firstname, lastname, password_digest) VALUES ($1, $2, $3, $4) RETURNING *;';

    const hash = bcrypt.hashSync(
      (user.password as string) + BCRYPT_PASSWORD,
      parseInt(SALT_ROUNDS as string)
    );

    const result = await this.runQuery(sql, [
      user.username,
      user.firstName,
      user.lastName,
      hash
    ]);
    return result.rows[0];
  }

  async authenticate(user: User) {
    const sql = 'SELECT * FROM users WHERE username=$1';

    const result = await this.runQuery(sql, [user.username]);

    const userPassword =
      result.rows.length > 0 ? result.rows[0].password_digest : '';

    const isAuthenticated = bcrypt.compareSync(
      (user.password as string) + BCRYPT_PASSWORD,
      userPassword
    );
    if (isAuthenticated) {
      return result.rows[0];
    } else {
      return null;
    }
  }

  async show(userId: string) {
    const sql = 'SELECT * FROM users WHERE id=$1;';

    const result = await this.runQuery(sql, [userId]);
    return result.rows[0];
  }

  async getOrdersByUserId(userId: string) {
    const sql = 'SELECT * FROM orders WHERE user_id=$1;';

    const result = await this.runQuery(sql, [userId]);
    return result.rows;
  }

  async getProductsByOrderAndUserId(orderId: string) {
    const sql =
      'SELECT products.id, name, price, quantity FROM products INNER JOIN order_products ON products.id=order_products.product_id WHERE order_id=$1;';

    const result = await this.runQuery(sql, [orderId]);
    return result.rows;
  }

  async getUserOrdersByStatus(userId: string, status: string) {
    const sql = 'SELECT * FROM orders WHERE user_id=$1 AND status=$2;';

    const result = await this.runQuery(sql, [userId, status]);
    return result.rows;
  }

  async deleteAll() {
    const sql = 'DELETE FROM users;';
    await this.runQuery(sql);
  }
}

export default UserStore;
