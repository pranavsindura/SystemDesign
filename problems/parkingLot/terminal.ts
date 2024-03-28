import { ParkingTicket, type Ticket } from "./ticket";
import { type ParkingSpot, type ParkingSpotType } from "./parkingSpot";
import { type ParkingLot } from "./parkingLot";
import IdGenerator from "./idGenerator";
import { type ParkingSpotFindingStrategy } from "./parkingSpotFindingStrategy";
import { type ParkingFeeCalculator } from "./parkingFeeCalculator";
import { type ResultWithError } from "./types";

export enum TerminalType {
  ENTRY = "ENTRY",
  EXIT = "EXIT",
}

export abstract class Terminal {
  private readonly id: number;
  private readonly type: TerminalType;
  private readonly parkingLot: ParkingLot;

  constructor(type: TerminalType, parkingLot: ParkingLot) {
    this.type = type;
    this.id = IdGenerator.getInstance().getId();
    this.parkingLot = parkingLot;
  }

  getId(): number {
    return this.id;
  }

  getType(): TerminalType {
    return this.type;
  }

  getParkingLot(): ParkingLot {
    return this.parkingLot;
  }

  findParkingSpot(_spotType: ParkingSpotType): ResultWithError<ParkingSpot> {
    return [new Error("method not implemented"), null];
  }

  reserveParkingSpot(_type: ParkingSpotType): ResultWithError<Ticket> {
    return [new Error("method not implemented"), null];
  }

  releaseParkingSpot(_ticket: Ticket): ResultWithError<number> {
    return [new Error("method not implemented"), null];
  }

  processPayment(_ticket: Ticket): void {
    throw new Error("method not implemented");
  }

  print(): void {
    console.log("Terminal", this.type);
    console.log("ID", this.id);
    this.parkingLot.print();
  }
}

export class EntryTerminal extends Terminal {
  private readonly parkingSpotFindingStrategy: ParkingSpotFindingStrategy;

  constructor(
    type: TerminalType,
    parkingLot: ParkingLot,
    parkingSpotFindingStrategy: ParkingSpotFindingStrategy,
  ) {
    super(type, parkingLot);
    this.parkingSpotFindingStrategy = parkingSpotFindingStrategy;
  }

  reserveParkingSpot(type: ParkingSpotType): ResultWithError<Ticket> {
    const [findError, findResult] = this.findParkingSpot(type);
    if (findError != null) {
      return [findError, null];
    }
    const reserveError = this.getParkingLot().reserveParkingSpot(findResult);
    if (reserveError != null) {
      return [reserveError, null];
    }
    const ticket = new ParkingTicket(findResult);
    return [null, ticket];
  }

  findParkingSpot(spotType: ParkingSpotType): ResultWithError<ParkingSpot> {
    const result = this.parkingSpotFindingStrategy.findParkingSpot(spotType);
    return result;
  }
}

export class ExitTerminal extends Terminal {
  private readonly parkingFeeCalculator: ParkingFeeCalculator;

  constructor(
    type: TerminalType,
    parkingLot: ParkingLot,
    parkingFeeCalculator: ParkingFeeCalculator,
  ) {
    super(type, parkingLot);
    this.parkingFeeCalculator = parkingFeeCalculator;
  }

  releaseParkingSpot(ticket: Ticket): ResultWithError<number> {
    if (ticket.isExpired()) {
      return [new Error("ticket is expired"), null];
    }

    const spot = ticket.getParkingSpot();

    const releaseError = this.getParkingLot().releaseParkingSpot(spot);
    if (releaseError != null) {
      return [releaseError, null];
    }

    const [feeError, fee] = this.parkingFeeCalculator.calculateFee(ticket);
    if (feeError != null) {
      return [feeError, null];
    }
    ticket.expire();

    return [null, fee];
  }
}
