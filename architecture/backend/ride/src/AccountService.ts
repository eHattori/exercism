import crypto from "crypto";
import pgp from "pg-promise";
import CpfValidator from "./CpfValidator";
import MailerGateway from "./MailerGateway";
import AccountDAO from "./AccountDAO";
import AccountDAODatabase from "./AccountDAODatabase";

export default class AccountService {


  constructor(
    readonly accountDAO: AccountDAO = new AccountDAODatabase(),
    readonly cpfValidator: CpfValidator = new CpfValidator(),
    readonly mailerGateway: MailerGateway = new MailerGateway()) {
  }

  async signup(input: any) {
    const accountId = crypto.randomUUID();
    const verificationCode = crypto.randomUUID();
    const date = new Date();
    const existingAccount = await this.accountDAO.getByEmail(input.email);

    if (existingAccount) throw new Error("Account already exists");
    if (!input.name.match(/[a-zA-Z] [a-zA-Z]+/)) throw new Error("Invalid name");
    if (!input.email.match(/^(.+)@(.+)$/)) throw new Error("Invalid email");
    if (!this.cpfValidator.validate(input.cpf)) throw new Error("Invalid cpf");
    if (input.isDriver && !input.carPlate.match(/[A-Z]{3}[0-9]{4}/)) throw new Error("Invalid plate");

    input.accountId = accountId;
    input.date = date;
    await this.accountDAO.save(input);
    await this.mailerGateway.send(input.email, "Verification", `Please verify your code at first login ${verificationCode}`);
    return {
      accountId
    };
  }

  async getAccount(accountId: string) {
    const account = await this.accountDAO.getById(accountId);
    return account;
  }
}
