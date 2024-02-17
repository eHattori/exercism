import CpfValidator from "../src/CpfValidator";

const cpfValidator = new CpfValidator();
test.each([
  "95818705552",
  "01234567890",
  "565.486.780-60",
  "147.864.110-00",
])('Deve validar um CPF', (cpf: string) => {
  expect(cpfValidator.validate(cpf)).toBeTruthy();
});

test.each([
  "as",
  "958.187.055-00",
  "958.187.055"
])('Não deve validar o CPF', (cpf: string) => {
  expect(cpfValidator.validate(cpf)).toBeFalsy();
});
