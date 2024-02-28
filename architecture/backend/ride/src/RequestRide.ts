import RideDAO from "./RideDAO";
import AccountDAO from "./AccountDAO";
import Ride from "./Ride";

type Input = {
  passengerId: string,
  from: {
    lat: number,
    long: number,
  },
  to: {
    lat: number,
    long: number,
  },
};

export default class RequestRide {

  constructor(
    readonly rideDAO: RideDAO,
    readonly accountDAO: AccountDAO
  ) { }

  async execute(input: Input) {
    const account = await this.accountDAO.getById(input.passengerId);
    if (!account?.isPassenger) throw new Error('Account is not from passenger');

    const ridesNotCompleted = await this.rideDAO.getActiveRidesByPassengerId(input.passengerId);
    if (ridesNotCompleted.length > 0) throw new Error('This passenger already has ride not completed');

    const ride = Ride.create(input.passengerId, input.from.lat, input.from.long, input.to.lat, input.to.long);
    await this.rideDAO.save(ride);

    return {
      rideId: ride.rideId,
    };
  }
}
