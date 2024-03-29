import crypto from "crypto";

export default class Ride {
  driverId?: string;

  private constructor(
    readonly rideId: string,
    readonly passengerId: string,
    private status: string,
    readonly fromLat: number,
    readonly fromLong: number,
    readonly toLat: number,
    readonly toLong: number,
    readonly date: Date
  ) { }

  static create(passengerId: string, fromLat: number, fromLong: number, toLat: number, toLong: number) {
    const rideId = crypto.randomUUID();
    const status = "requested";
    const date = new Date();
    return new Ride(rideId, passengerId, status, fromLat, fromLong, toLat, toLong, date);
  }

  static restore(rideId: string, passengerId: string, driverId: string, status: string, fromLat: number, fromLong: number, toLat: number, toLong: number, date: Date) {
    const ride =  new Ride(rideId, passengerId, status, fromLat, fromLong, toLat, toLong, date);
    ride.driverId = driverId;
    return ride;
  }

  accept(driverId: string) {
    if (this.getStatus() !== 'requested') throw new Error("The Ride is not available");

    this.driverId = driverId;
    this.status = "accepted";
  }

  getStatus(): string {
    return this.status;
  }
}
