import { HOUR_IN_MS } from "./constants";
import { ParkingSpotType } from "./parkingSpot";
import { type ResultWithError } from "./types";

export class ParkingFee {
  private readonly rate: number;
  private readonly durationInMs: number;

  constructor(rate: number, durationInMs: number) {
    this.rate = rate;
    this.durationInMs = durationInMs;
  }

  getRate(): number {
    return this.rate;
  }

  getDurationInMs(): number {
    return this.durationInMs;
  }
}

export abstract class ParkingFeeFactory {
  abstract getParkingFee(
    spotType: ParkingSpotType,
  ): ResultWithError<ParkingFee>;
}

export class HourlyParkingFeeFactory extends ParkingFeeFactory {
  getParkingFee(spotType: ParkingSpotType): ResultWithError<ParkingFee> {
    switch (spotType) {
      case ParkingSpotType.HANDICAPPED:
        return [null, new ParkingFee(1000, HOUR_IN_MS)];
      case ParkingSpotType.COMPACT:
        return [null, new ParkingFee(50, HOUR_IN_MS)];
      case ParkingSpotType.LARGE:
        return [null, new ParkingFee(60, HOUR_IN_MS)];
      case ParkingSpotType.MOTORCYCLE:
        return [null, new ParkingFee(20, HOUR_IN_MS)];
      default:
        return [new Error("unknown parking spot type"), null];
    }
  }
}
