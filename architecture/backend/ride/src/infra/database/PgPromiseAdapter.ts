import Connection from "./Connection";
import pgp from "pg-promise";

export default class PgPromiseAdapter implements Connection {
  connection: any;

  constructor() {
    this.connection = pgp()("postgres://postgres:123456@localhost:5432/app");
  }

  query(statement: string, data: any): Promise<any> {
    return this.connection.query(statement, data);
  }

  async close(): Promise<void> {
    await this.connection.$pool.end();
  }
}
