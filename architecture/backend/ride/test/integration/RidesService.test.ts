import AccountDAODatabase from "../../src/infra/repository/AccountDAODatabase";
import Connection from "../../src/infra/database/Connection";
import MailerGateway from "../../src/infra/gateway/MailerGateway";
import PgPromiseAdapter from "../../src/infra/database/PgPromiseAdapter";
import { RideDAODatabase } from "../../src/infra/repository/RideDAODatabase";
import AcceptRide from "../../src/application/usecase/AcceptRide";
import GetRide from "../../src/application/usecase/GetRide";
import RequestRide from "../../src/application/usecase/RequestRide";
import Signup from "../../src/application/usecase/Signup";

let signup: Signup;
let requestRide: RequestRide;
let getRide: GetRide;
let acceptRide: AcceptRide;
let connection: Connection;

beforeEach(() => {
  connection = new PgPromiseAdapter();
  const accountDAO = new AccountDAODatabase(connection);
  const rideDAO = new RideDAODatabase(connection);
  const mailerGateway = new MailerGateway();

  signup = new Signup(accountDAO, mailerGateway);
  requestRide = new RequestRide(rideDAO, accountDAO);
  getRide = new GetRide(rideDAO);
  acceptRide = new AcceptRide(rideDAO, accountDAO);
});

test("Deve solicitar uma corrida e receber o rideId", async () => {
  const inputSignup = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };
  const outputSignup = await signup.execute(inputSignup);

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
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  expect(outputRequestRide.rideId).toBeDefined();
});

test("Deve solicitar uma corrida e buscar uma corrida", async () => {
  const inputSignup = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };

  const outputSignup = await signup.execute(inputSignup);

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
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.getStatus()).toBe('requested');
  expect(outputGetRide.passengerId).toBe(outputSignup.accountId);
  expect(outputGetRide.fromLat).toBe(inputRequestRide.from.lat);
  expect(outputGetRide.fromLong).toBe(inputRequestRide.from.long);
  expect(outputGetRide.toLat).toBe(inputRequestRide.to.lat);
  expect(outputGetRide.toLong).toBe(inputRequestRide.to.long);
  expect(outputGetRide.date).toBeDefined();
});

test("Deve solicitar uma corrida e aceitar uma corrida", async () => {
  const inputSignupPassenger = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };

  const outputSignupPassenger = await signup.execute(inputSignupPassenger);
  const inputSignupDriver = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    carPlate: 'AAA9999',
    isDriver: true
  };
  const outputSignupDriver = await signup.execute(inputSignupDriver);

  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    from: {
      lat: -23.550520,
      long: -46.633308
    },
    to: {
      lat: -23.550520,
      long: -46.633308
    }
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide);

  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };

  await acceptRide.execute(inputAcceptRide);
  const outputGetRide = await getRide.execute(outputRequestRide.rideId);
  expect(outputGetRide.getStatus()).toBe('accepted');
  expect(outputGetRide.driverId).toBe(outputSignupDriver.accountId);
});

test("Caso uma corrida seja solicitada por uma conta que não é um passageiro deve lancar um erro", async () => {
  const inputSignup = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    carPlate: 'AAA9999',
    isDriver: true
  };

  const outputSignup = await signup.execute(inputSignup);

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
  await expect(requestRide.execute(inputRequestRide)).rejects.toThrow(new Error('Account is not from passenger'));
});

test("Caso uma corrida seja solicitada um passageiro e o mesmo ja ter uma corrida em andamento deve lancar um erro", async () => {
  const inputSignup = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };

  const outputSignup = await signup.execute(inputSignup);
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
  await requestRide.execute(inputRequestRide);
  await expect(requestRide.execute(inputRequestRide)).rejects.toThrow(new Error('This passenger already has ride not completed'));
});

test("Não deve aceitar uma corrida se a conta Não for um motorista", async () => {
  const inputSignupPassenger = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };

  const outputSignupPassenger = await signup.execute(inputSignupPassenger);
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    from: {
      lat: -23.550520,
      long: -46.633308
    },
    to: {
      lat: -23.550520,
      long: -46.633308
    }
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide);

  const inputSignupDriver = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };
  const outputSignupDriver = await signup.execute(inputSignupDriver);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };
  await expect(acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error('Account is not from a driver'));
});

test("Não deve aceitar uma corrida se o status for requested", async () => {
  const inputSignupPassenger = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };

  const outputSignupPassenger = await signup.execute(inputSignupPassenger);
  const inputSignupDriver = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    carPlate: 'AAA9999',
    isDriver: true
  };
  const outputSignupDriver = await signup.execute(inputSignupDriver);
  const inputRequestRide = {
    passengerId: outputSignupPassenger.accountId,
    from: {
      lat: -23.550520,
      long: -46.633308
    },
    to: {
      lat: -23.550520,
      long: -46.633308
    }
  }
  const outputRequestRide = await requestRide.execute(inputRequestRide);
  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };

  await acceptRide.execute(inputAcceptRide);
  await expect(acceptRide.execute(inputAcceptRide)).rejects.toThrow(new Error('The Ride is not available'));
});

test("Não deve aceitar uma corrida se o motorista ja estiver em uma corrida", async () => {
  const inputSignupPassenger1 = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };
  const outputSignupPassenger1 = await signup.execute(inputSignupPassenger1);
  const inputSignupDriver = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    carPlate: 'AAA9999',
    isDriver: true
  };
  const outputSignupDriver = await signup.execute(inputSignupDriver);
  const inputRequestRide1 = {
    passengerId: outputSignupPassenger1.accountId,
    from: {
      lat: -23.550520,
      long: -46.633308
    },
    to: {
      lat: -23.550520,
      long: -46.633308
    }
  }
  const outputRequestRide1 = await requestRide.execute(inputRequestRide1);
  const inputAcceptRide1 = {
    rideId: outputRequestRide1.rideId,
    driverId: outputSignupDriver.accountId,
  };

  await acceptRide.execute(inputAcceptRide1);

  const inputSignupPassenger2 = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };

  const outputSignupPassenger2 = await signup.execute(inputSignupPassenger2);

  const inputRequestRide2 = {
    passengerId: outputSignupPassenger2.accountId,
    from: {
      lat: -23.550520,
      long: -46.633308
    },
    to: {
      lat: -23.550520,
      long: -46.633308
    }
  }
  const outputRequestRide2 = await requestRide.execute(inputRequestRide2);

  const inputAcceptRide2 = {
    rideId: outputRequestRide2.rideId,
    driverId: outputSignupDriver.accountId,
  };

  await expect(acceptRide.execute(inputAcceptRide2)).rejects.toThrow(new Error('The Driver is not available'));
});

afterEach(async () => {
  await connection.close();
});

