import { type ParkingLot } from "./parkingLot";
import { type ParkingSpot, type ParkingSpotType } from "./parkingSpot";
import { type ResultWithError } from "./types";

export class ParkingSpotFindingStrategy {
  private readonly parkingLot: ParkingLot;

  constructor(parkingLot: ParkingLot) {
    this.parkingLot = parkingLot;
  }

  findParkingSpot(spotType: ParkingSpotType): ResultWithError<ParkingSpot> {
    const list = this.parkingLot.getAvailableParkingSpotsByType(spotType);
    if (list.length === 0) {
      return [new Error("no parking spots available"), null];
    }
    return [null, list[0]];
  }
}
