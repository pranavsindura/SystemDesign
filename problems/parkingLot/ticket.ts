import IdGenerator from "./idGenerator";
import { type ParkingSpot } from "./parkingSpot";

export interface Ticket {
  getId: () => number;
  getParkingSpot: () => ParkingSpot;
  getTimestamp: () => Date;
  print: () => void;
  isExpired: () => boolean;
  expire: () => void;
}

export class ParkingTicket implements Ticket {
  private readonly id: number;
  private readonly timestamp: Date;
  private readonly parkingSpot: ParkingSpot;
  private expired: boolean;

  constructor(parkingSpot: ParkingSpot) {
    this.id = IdGenerator.getInstance().getId();
    this.timestamp = new Date();
    this.parkingSpot = parkingSpot;
    this.expired = false;
  }

  getId: () => number = () => this.id;
  getTimestamp: () => Date = () => this.timestamp;
  getParkingSpot: () => ParkingSpot = () => this.parkingSpot;

  isExpired(): boolean {
    return this.expired;
  }

  expire(): void {
    this.expired = true;
  }

  print(): void {
    console.log("Ticket", this.id);
    console.log("Created at", this.timestamp);
    console.log("is expired", this.expired);
    console.log("Associated parking spot");
    this.parkingSpot.print();
  }
}
