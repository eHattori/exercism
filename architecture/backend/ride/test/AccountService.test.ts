import AccountDAODatabase from "../src/AccountDAODatabase";
import Connection from "../src/Connection";
import GetAccount from "../src/GetAccount";
import MailerGateway from "../src/MailerGateway";
import PgPromiseAdapter from "../src/PgPromiseAdapter";
import Signup from "../src/Signup";

let signup: Signup;
let getAccount: GetAccount;
let connection: Connection; 

beforeEach(() => {
  connection = new PgPromiseAdapter();
  const accountDAO = new AccountDAODatabase(connection);
  const mailerGateway = new MailerGateway();
  signup = new Signup(accountDAO, mailerGateway);
  getAccount = new GetAccount(accountDAO);
});

test('Deveria criar um passageiro', async () => {
  const input = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };
  const output = await signup.execute(input);
  const account = await getAccount.execute(output.accountId);
  expect(account?.accountId).toBeDefined();
  expect(account?.name).toBe(input.name);
  expect(account?.email).toBe(input.email);
  expect(account?.cpf).toBe(input.cpf);
});

test('Não deveria criar um passageiro repetido', async () => {
  const input = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };
  await signup.execute(input);
  await expect(signup.execute(input)).rejects.toThrow('Account already exists')
});

test('Não deveria criar um passageiro com o nome invalido', async () => {
  const input = {
    name: 'Eduardo',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };
  await expect(signup.execute(input)).rejects.toThrow('Invalid name')
});

test('Não deveria criar um passageiro com o cpf invalido', async () => {
  const input = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637000',
    isPassenger: true
  };
  await expect(signup.execute(input)).rejects.toThrow('Invalid cpf')
});

test('Não deveria criar um passageiro com o email invalido', async () => {
  const input = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif`,
    cpf: '55032637076',
    isPassenger: true
  };
  await expect(signup.execute(input)).rejects.toThrow('Invalid email')
});

test('Deveria criar um motorista', async () => {
  const input = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    carPlate: 'AAA9999',
    isDriver: true
  };
  const output = await signup.execute(input);
  const account = await getAccount.execute(output.accountId);
  expect(account?.accountId).toBeDefined();
  expect(account?.name).toBe(input.name);
  expect(account?.email).toBe(input.email);
  expect(account?.cpf).toBe(input.cpf);
  expect(account?.carPlate).toBe(input.carPlate);
  expect(account?.isDriver).toBeTruthy();
});

test('Não deveria criar um motorista com uma placa inválida', async () => {
  const input = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    carPlate: 'AAA999',
    isDriver: true
  };
  await expect(signup.execute(input)).rejects.toThrow('Invalid plate');
});

afterEach(async () => {
  await connection.close();
});
