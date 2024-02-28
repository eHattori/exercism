import pgp from "pg-promise";
import AccountDAO from "./AccountDAO";
import Account from "./Account";


export default class AccountDAODatabase implements AccountDAO {
  constructor() {
  }

  async save(account: Account): Promise<void> {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");
    const sqlInsert = `insert into cccat13.account 
        (account_id, name, email, cpf, car_plate, is_passenger, is_driver, date, is_verified, verification_code) 
        values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`;
    await connection.query(sqlInsert,
      [
        account.accountId,
        account.name,
        account.email,
        account.cpf,
        account.carPlate,
        !!account.isPassenger,
        !!account.isDriver,
        account.date,
        false,
        account.verificationCode
      ]);

    connection.$pool.end();
  }

  async getById(accountId: string): Promise<Account | undefined> {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

    const [accountData] = await connection.query("select * from cccat13.account where account_id = $1", [accountId]);
    connection.$pool.end();
    if (!accountData) return;

    return Account.restore(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.is_passenger,
      accountData.is_driver,
      accountData.car_plate,
      accountData.date,
      accountData.verification_code
    );
  }

  async getByEmail(email: string): Promise<Account | undefined> {
    const connection = pgp()("postgres://postgres:123456@localhost:5432/app");

    const [accountData] = await connection.query("select * from cccat13.account where email = $1", [email]);
    connection.$pool.end();
    if (!accountData) return;
    return Account.restore(
      accountData.account_id,
      accountData.name,
      accountData.email,
      accountData.cpf,
      accountData.is_passenger,
      accountData.is_driver,
      accountData.car_plate,
      accountData.date,
      accountData.verification_code
    );
  }
}
