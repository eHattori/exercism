import CpfValidator from "./CpfValidator";
import MailerGateway from "./MailerGateway";
import AccountDAO from "./AccountDAO";
import AccountDAODatabase from "./AccountDAODatabase";
import Account from "./Account";

export default class AccountService {
  constructor(
    readonly accountDAO: AccountDAO = new AccountDAODatabase(),
    readonly cpfValidator: CpfValidator = new CpfValidator(),
    readonly mailerGateway: MailerGateway = new MailerGateway()) {
  }

  async signup(input: any) {
    const existingAccount = await this.accountDAO.getByEmail(input.email);
    if (existingAccount) throw new Error("Account already exists");

    const account = Account.create(input.name, input.email, input.cpf, input.isPassenger, input.isDriver, input.carPlate);
    await this.accountDAO.save(account);
    await this.mailerGateway.send(account.email, "Verification", `Please verify your code at first login ${account.verificationCode}`);
    return {
      accountId: account.accountId,
    };
  }

  async getAccount(accountId: string) {
    const account = await this.accountDAO.getById(accountId);
    return account;
  }
}
