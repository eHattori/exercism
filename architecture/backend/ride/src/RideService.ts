import crypto from "crypto";
import RideDAO from "./RideDAO";
import { RideDAODatabase } from "./RideDAODatabase";
import AccountDAO from "./AccountDAO";
import AccountDAODatabase from "./AccountDAODatabase";
import Ride from "./Ride";

export default class RideService {

  constructor(
    readonly rideDAO: RideDAO = new RideDAODatabase(),
    readonly accountDAO: AccountDAO = new AccountDAODatabase()
  ) {
  }

  async requestRide(input: any) {
    const account = await this.accountDAO.getById(input.passengerId);
    if (!account.is_passenger) throw new Error('Account is not from passenger');
    const ridesNotCompleted = await this.rideDAO.getActiveRidesByPassengerId(input.passengerId);
    if (ridesNotCompleted.length > 0) throw new Error('This passenger already has ride not completed');

    const ride = Ride.create(input.passengerId, input.from.lat, input.from.long, input.to.lat, input.to.long);
    await this.rideDAO.save(ride);
    return {
      rideId: ride.rideId,
    };
  }

  async getRide(rideId: string) {
    const ride = await this.rideDAO.getById(rideId);
    return ride;
  }

  async acceptRide(input: any) {
    const ride = await this.getRide(input.rideId);
    if (ride.status !== 'requested') throw new Error("The Ride is not available");
    const account = await this.accountDAO.getById(input.driverId);
    if (!account.is_driver) throw new Error('Account is not from a driver');

    const activeRides = await this.rideDAO.getActiveRidesByDriverId(input.driverId);
    if (activeRides.length > 0) throw new Error('The Driver is not available');

    ride.driverId = input.driverId;
    ride.rideId = input.rideId;
    ride.status = 'accepted';
    await this.rideDAO.update(ride);
  }
}
