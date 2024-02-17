export default class CpfValidator {

  validate(cpf: string) {
    if (!cpf) return false;
    cpf = this.clean(cpf);
    if (this.isInvalidLength(cpf)) return false;

    if (this.isAllTheSameDigits(cpf)) {
      const dg1 = this.calculateDigit(cpf, 10);
      const dg2 = this.calculateDigit(cpf, 11);
      const checkDigit = this.extractDigit(cpf);

      const calculateDigit = `${dg1}${dg2}`;
      return checkDigit === calculateDigit;
    }
    return false;
  }

  private clean(cpf: string) {
    return cpf.replace(/\D/g, "");
  }

  private isInvalidLength(cpf: string) {
    return cpf.length !== 11;
  }

  private isAllTheSameDigits(cpf: string) {
    return !cpf.split("").every(c => c === cpf[0])
  }

  private calculateDigit(cpf: string, factor: number) {
    let total = 0;
    for (const digit of cpf) {
      if (factor > 1) total += parseInt(digit) * factor--;
    }
    const rest = total % 11;
    return (rest < 2) ? 0 : 11 - rest;
  }

  private extractDigit(cpf: string) {
    return cpf.substring(cpf.length - 2, cpf.length)
  }

}
