import MailerGateway from "./MailerGateway";
import AccountDAO from "./AccountDAO";
import Account from "./Account";

type Input = {
  name: string,
  email: string,
  cpf: string,
  isPassenger?: boolean,
  isDriver?: boolean,
  carPlate?: string,
}

export default class Signup {

  constructor(
    readonly accountDAO: AccountDAO,
    readonly mailerGateway: MailerGateway) {
  }

  async execute(input: Input) {
    const existingAccount = await this.accountDAO.getByEmail(input.email);
    if (existingAccount) throw new Error("Account already exists");

    const account = Account.create(input.name, input.email, input.cpf, !!input.isPassenger, !!input.isDriver, input.carPlate);
    await this.accountDAO.save(account);
    await this.mailerGateway.send(account.email, "Verification", `Please verify your code at first login ${account.verificationCode}`);
    return {
      accountId: account.accountId,
    };
  }
}
