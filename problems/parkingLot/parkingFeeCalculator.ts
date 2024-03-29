import { type ParkingFeeFactory } from "./parkingFee";
import { type ParkingTicket } from "./ticket";
import { type ResultWithError } from "./types";

export class ParkingFeeCalculator {
  private readonly parkingFeeFactory: ParkingFeeFactory;

  constructor(parkingFeeFactory: ParkingFeeFactory) {
    this.parkingFeeFactory = parkingFeeFactory;
  }

  calculateFee(ticket: ParkingTicket): ResultWithError<number> {
    const spot = ticket.getParkingSpot();
    const [error, fee] = this.parkingFeeFactory.getParkingFee(spot.getType());
    if (error != null) {
      return [error, null];
    }
    const startTimestamp = ticket.getTimestamp();
    const now = new Date();
    const ms = now.valueOf() - startTimestamp.valueOf();
    return [null, Math.ceil(ms / fee.getDurationInMs()) * fee.getRate()];
  }
}
