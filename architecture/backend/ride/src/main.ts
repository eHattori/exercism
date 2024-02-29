import PgPromiseAdapter from "./infra/database/PgPromiseAdapter";
import AccountDAODatabase from "./infra/repository/AccountDAODatabase";
import MailerGateway from "./infra/gateway/MailerGateway";
import MainController from "./infra/controller/MainController";
import ExpressAdapter from "./infra/http/ExpressAdapter";
import Signup from "./application/usecase/Signup";
import GetAccount from "./application/usecase/GetAccount";

const connection = new PgPromiseAdapter();
const accountDAO = new AccountDAODatabase(connection);
const mailGateway = new MailerGateway();
const signup = new Signup(accountDAO, mailGateway);
const getAccount = new GetAccount(accountDAO);
const httpServer = new ExpressAdapter();

new MainController(httpServer, signup, getAccount);
httpServer.listen(3000);
