import express from "express";
import Signup from "./Signup";
import GetAccount from "./GetAccount";
import PgPromiseAdapter from "./PgPromiseAdapter";
import AccountDAODatabase from "./AccountDAODatabase";

const app = express();
app.use(express.json());
const connection = new PgPromiseAdapter();
const accountDAO = new AccountDAODatabase(connection);

app.post('/signup', async (req, res) => {
  const input = req.body;
  const signup = new Signup(accountDAO);
  const output = await signup.execute(input);
  res.json(output);
});

app.get('/accounts/:accountId', async (req, res) => {
  const getAccount = new GetAccount(accountDAO);
  const accountId = req.params.accountId;
  const output = await getAccount.execute(accountId);
  res.json(output);
});

