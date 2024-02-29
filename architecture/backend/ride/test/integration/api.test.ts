import axios from "axios";


test("Deve criar uma conta de passageiro", async () => {
  const inputSignUp = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };
  const res = await axios.post('http://localhost:3000/signup', inputSignUp);
  const outputSignup = res.data;

  const responseGetAccount = await axios.get(`http://localhost:3000/accounts/${outputSignup.accountId}`);
  const outputGetAccount = responseGetAccount.data;
  expect(outputGetAccount.accountId).toBeDefined();
  expect(outputGetAccount.name).toBe(inputSignUp.name);
  expect(outputGetAccount.email).toBe(inputSignUp.email);
  expect(outputGetAccount.cpf).toBe(inputSignUp.cpf);
});
