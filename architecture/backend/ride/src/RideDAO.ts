import Ride from "./Ride";

export default interface RideDAO {
  save(ride: Ride): Promise<void>;
  update(ride: any): Promise<void>;
  getById(rideId: string): Promise<any>;
  getActiveRidesByPassengerId(passengerId: string): Promise<any>;
  getActiveRidesByDriverId(driverId: string): Promise<any>;
}
