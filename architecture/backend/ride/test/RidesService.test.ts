import AccountService from "../src/AccountService";
import RideService from "../src/RideService";

test("Deve solicitar uma corrida e receber o rideId", async () => {

  const inputSignup = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };

  const accountService = new AccountService();
  const outputSignup = await accountService.signup(inputSignup);

  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -23.550520,
      long: -46.633308
    },
    to: {
      lat: -23.550520,
      long: -46.633308
    }
  }
  const rideService = new RideService();
  const outputRequestRide = await rideService.requestRide(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
});

test("Deve solicitar uma corrida e buscar uma corrida", async () => {

  const inputSignup = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };

  const accountService = new AccountService();
  const outputSignup = await accountService.signup(inputSignup);

  const inputRequestRide = {
    passengerId: outputSignup.accountId,
    from: {
      lat: -23.550520,
      long: -46.633308
    },
    to: {
      lat: -23.550520,
      long: -46.633308
    }
  }
  const rideService = new RideService();
  const outputRequestRide = await rideService.requestRide(inputRequestRide);
  const outputGetRide = await rideService.getRide(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe('requested');
  expect(outputGetRide.passenger_id).toBe(outputSignup.accountId);
  expect(parseFloat(outputGetRide.from_lat)).toBe(inputRequestRide.from.lat);
  expect(parseFloat(outputGetRide.from_long)).toBe(inputRequestRide.from.long);
  expect(parseFloat(outputGetRide.to_lat)).toBe(inputRequestRide.to.lat);
  expect(parseFloat(outputGetRide.to_long)).toBe(inputRequestRide.to.long);
  expect(outputGetRide.date).toBeDefined();
});
