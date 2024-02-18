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

test("Deve solicitar uma corrida e aceitar uma corrida", async () => {

  const accountService = new AccountService();
  const inputSignupPassenger = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };

  const outputSignupPassenger = await accountService.signup(inputSignupPassenger);
  const inputSignupDriver = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    carPlate: 'AAA9999',
    isDriver: true
  };
  const outputSignupDriver = await accountService.signup(inputSignupDriver);

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
  const rideService = new RideService();
  const outputRequestRide = await rideService.requestRide(inputRequestRide);

  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };

  await rideService.acceptRide(inputAcceptRide);
  const outputGetRide = await rideService.getRide(outputRequestRide.rideId);
  expect(outputGetRide.status).toBe('accepted');
  expect(outputGetRide.driver_id).toBe(outputSignupDriver.accountId);
});

test("Caso uma corrida seja solicitada por uma conta que não é um passageiro deve lancar um erro", async () => {

  const inputSignup = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    carPlate: 'AAA9999',
    isDriver: true
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
  await expect(rideService.requestRide(inputRequestRide)).rejects.toThrow(new Error('Account is not from passenger'));
});

test("Caso uma corrida seja solicitada um passageiro e o mesmo ja ter uma corrida em andamento deve lancar um erro", async () => {
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
  await rideService.requestRide(inputRequestRide);
  await expect(rideService.requestRide(inputRequestRide)).rejects.toThrow(new Error('This passenger already has ride not completed'));
});



test("Não deve aceitar uma corrida se a conta Não for um motorista", async () => {

  const accountService = new AccountService();
  const inputSignupPassenger = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };

  const outputSignupPassenger = await accountService.signup(inputSignupPassenger);

  const rideService = new RideService();
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
  const outputRequestRide = await rideService.requestRide(inputRequestRide);

  const inputSignupDriver = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };
  const outputSignupDriver = await accountService.signup(inputSignupDriver);


  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };

  await expect(rideService.acceptRide(inputAcceptRide)).rejects.toThrow(new Error('Account is not from a driver'));
});

test("Não deve aceitar uma corrida se o status for requested", async () => {

  const accountService = new AccountService();
  const inputSignupPassenger = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };

  const outputSignupPassenger = await accountService.signup(inputSignupPassenger);
  const inputSignupDriver = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    carPlate: 'AAA9999',
    isDriver: true
  };
  const outputSignupDriver = await accountService.signup(inputSignupDriver);

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
  const rideService = new RideService();
  const outputRequestRide = await rideService.requestRide(inputRequestRide);

  const inputAcceptRide = {
    rideId: outputRequestRide.rideId,
    driverId: outputSignupDriver.accountId,
  };

  await rideService.acceptRide(inputAcceptRide);
  await expect(rideService.acceptRide(inputAcceptRide)).rejects.toThrow(new Error('The Ride is not available'));
});

test("Não deve aceitar uma corrida se o motorista ja estiver em uma corrida", async () => {

  const accountService = new AccountService();
  const inputSignupPassenger1 = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };

  const outputSignupPassenger1 = await accountService.signup(inputSignupPassenger1);
  const inputSignupDriver = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    carPlate: 'AAA9999',
    isDriver: true
  };
  const outputSignupDriver = await accountService.signup(inputSignupDriver);

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
  const rideService = new RideService();
  const outputRequestRide1 = await rideService.requestRide(inputRequestRide1);

  const inputAcceptRide1 = {
    rideId: outputRequestRide1.rideId,
    driverId: outputSignupDriver.accountId,
  };

  await rideService.acceptRide(inputAcceptRide1);

    const inputSignupPassenger2 = {
    name: 'Eduardo Hattori',
    email: `eduardohattorif${Math.random()}@gmail.com`,
    cpf: '55032637076',
    isPassenger: true
  };

  const outputSignupPassenger2 = await accountService.signup(inputSignupPassenger2);

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
  const outputRequestRide2 = await rideService.requestRide(inputRequestRide2);

  const inputAcceptRide2 = {
    rideId: outputRequestRide2.rideId,
    driverId: outputSignupDriver.accountId,
  };

  await expect(rideService.acceptRide(inputAcceptRide2)).rejects.toThrow(new Error('The Driver is not available'));
});

