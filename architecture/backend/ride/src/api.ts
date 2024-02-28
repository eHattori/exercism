import Signup from "./Signup";
import GetAccount from "./GetAccount";
import PgPromiseAdapter from "./PgPromiseAdapter";
import AccountDAODatabase from "./AccountDAODatabase";
import MailerGateway from "./MailerGateway";
import MainController from "./MainController";
import ExpressAdapter from "./ExpressAdapter";

const connection = new PgPromiseAdapter();
const accountDAO = new AccountDAODatabase(connection);
const mailGateway = new MailerGateway();
const signup = new Signup(accountDAO, mailGateway);
const getAccount = new GetAccount(accountDAO);
const httpServer = new ExpressAdapter();

new MainController(httpServer, signup, getAccount);
httpServer.listen(3000);
