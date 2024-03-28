import { type ParkingLot } from "./parkingLot";
import { type ParkingSpot, type ParkingSpotType } from "./parkingSpot";
import { type ResultWithError } from "./types";

export abstract class ParkingSpotFindingStrategy {
  private readonly parkingLot: ParkingLot;

  constructor(parkingLot: ParkingLot) {
    this.parkingLot = parkingLot;
  }

  findParkingSpot(spotType: ParkingSpotType): ResultWithError<ParkingSpot> {
    const list = this.parkingLot.getAvailableParkingSpots(spotType);
    if (list.length === 0) {
      return [new Error("no parking spots available"), null];
    }
    return [null, list[0]];
  }
}

export class DefaultParkingSpotFindingStrategy extends ParkingSpotFindingStrategy {}
