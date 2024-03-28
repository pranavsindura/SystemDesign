import IdGenerator from "./idGenerator";

export enum ParkingSpotType {
  HANDICAPPED = "HANDICAPPED",
  COMPACT = "COMPACT",
  LARGE = "LARGE",
  MOTORCYCLE = "MOTORCYCLE",
}

export abstract class ParkingSpot {
  private readonly type: ParkingSpotType;
  private readonly id: number;
  private reserved: boolean;

  constructor(type: ParkingSpotType) {
    this.type = type;
    this.id = IdGenerator.getInstance().getId();
    this.reserved = false;
  }

  getId: () => number = () => this.id;

  isReserved: () => boolean = () => this.reserved;

  getType: () => ParkingSpotType = () => this.type;

  reserve: () => Error | undefined = () => {
    if (this.isReserved()) {
      return new Error("spot is already reserved");
    }
    this.reserved = true;
  };

  release: () => Error | undefined = () => {
    if (!this.isReserved()) {
      return new Error("spot is not reserved");
    }
    this.reserved = false;
  };

  print(): void {
    console.log("Parking Spot");
    console.log("ID", this.id);
    console.log("Type", this.type);
    console.log("Reserved", this.reserved);
  }
}

export class DefaultParkingSpot extends ParkingSpot {}
