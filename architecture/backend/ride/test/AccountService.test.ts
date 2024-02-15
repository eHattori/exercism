import AccountService from "../src/AccountService";

test('Deveria criar um passageiro', async () => {
  const input = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };
  const accountService = new AccountService();
  const output = await accountService.signup(input);
  const account = await accountService.getAccount(output.accountId);
  expect(account.account_id).toBeDefined();
  expect(account.name).toBe(input.name);
  expect(account.email).toBe(input.email);
  expect(account.cpf).toBe(input.cpf);
});

test('Não deveria criar um passageiro repetido', async () => {
  const input = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };
  const accountService = new AccountService();
  await accountService.signup(input);
  await expect(accountService.signup(input)).rejects.toThrow('Account already exists')
});

test('Não deveria criar um passageiro com o nome invalido', async () => {
  const input = {
    name: 'Eduardo',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };
  const accountService = new AccountService();
  await expect(accountService.signup(input)).rejects.toThrow('Invalid name')
});

test('Não deveria criar um passageiro com o cpf invalido', async () => {
  const input = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637000',
    isPassenger: true
  };
  const accountService = new AccountService();
  await expect(accountService.signup(input)).rejects.toThrow('Invalid cpf')
});

test('Não deveria criar um passageiro com o email invalido', async () => {
  const input = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif`,
    cpf: '55032637076',
    isPassenger: true
  };
  const accountService = new AccountService();
  await expect(accountService.signup(input)).rejects.toThrow('Invalid email')
});

test('Deveria criar um motorista', async () => {
  const input = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    carPlate: 'AAA9999',
    isDriver: true
  };
  const accountService = new AccountService();
  const output = await accountService.signup(input);
  const account = await accountService.getAccount(output.accountId);
  expect(account.account_id).toBeDefined();
  expect(account.name).toBe(input.name);
  expect(account.email).toBe(input.email);
  expect(account.cpf).toBe(input.cpf);
  expect(account.car_plate).toBe(input.carPlate);
  expect(account.is_driver).toBeTruthy();
});

test('Não deveria criar um motorista com uma placa inválida', async () => {
  const input = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    carPlate: 'AAA999',
    isDriver: true
  };
  const accountService = new AccountService();
  await expect(accountService.signup(input)).rejects.toThrow('Invalid plate');
});


