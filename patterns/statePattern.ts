interface State {
  refill: (count: number) => void;
  insertQuarter: () => void;
  ejectQuarter: () => void;
  turnCrank: () => void;
  dispense: () => void;
}

class OutOfGumballsState implements State {
  machine: GumballMachine;

  constructor(machine: GumballMachine) {
    this.machine = machine;
  }

  dispense(): void {
    console.log("no more gumballs");
    this.machine.setState(this.machine.getOutOfGumballsState());
  }

  turnCrank(): void {
    console.log("no more gumballs");
    this.machine.setState(this.machine.getOutOfGumballsState());
  }

  ejectQuarter(): void {
    console.log("no quarter present in the machine");
    this.machine.setState(this.machine.getOutOfGumballsState());
  }

  insertQuarter(): void {
    console.log("cannot insert quarter, no more gumballs");
    this.machine.setState(this.machine.getOutOfGumballsState());
  }

  refill(count: number): void {
    console.log("refilling the gumball machine");
    this.machine.setGumballCount(this.machine.getGumballCount() + count);
    this.machine.setState(this.machine.getNoQuarterState());
  }
}

class NoQuarterState implements State {
  machine: GumballMachine;

  constructor(machine: GumballMachine) {
    this.machine = machine;
  }

  dispense(): void {
    console.log("you need to pay first");
    this.machine.setState(this.machine.getNoQuarterState());
  }

  turnCrank(): void {
    console.log("you need to pay first");
    this.machine.setState(this.machine.getNoQuarterState());
  }

  ejectQuarter(): void {
    console.log("no quarter present in the machine");
    this.machine.setState(this.machine.getNoQuarterState());
  }

  insertQuarter(): void {
    console.log("accepted quarter");
    this.machine.setState(this.machine.getHasQuarterState());
  }

  refill(count: number): void {
    console.log("refilling gumball machine");
    this.machine.setGumballCount(this.machine.getGumballCount() + count);
    this.machine.setState(this.machine.getNoQuarterState());
  }
}

class HasQuarterState implements State {
  machine: GumballMachine;

  constructor(machine: GumballMachine) {
    this.machine = machine;
  }

  insertQuarter(): void {
    console.log("machine already has a quarter");
    this.machine.setState(this.machine.getHasQuarterState());
  }

  ejectQuarter(): void {
    console.log("ejecting the quarter");
    this.machine.setState(this.machine.getNoQuarterState());
  }

  turnCrank(): void {
    console.log("turning the crank");
    this.machine.setState(this.machine.getSoldState());
  }

  dispense(): void {
    console.log("turn the crank first");
    this.machine.setState(this.machine.getHasQuarterState());
  }

  refill(count: number): void {
    console.log("refilling gumball machine");
    this.machine.setGumballCount(this.machine.getGumballCount() + count);
    this.machine.setState(this.machine.getHasQuarterState());
  }
}

class SoldState implements State {
  machine: GumballMachine;

  constructor(machine: GumballMachine) {
    this.machine = machine;
  }

  insertQuarter(): void {
    console.log("please wait while we dispense the gumball");
    this.machine.setState(this.machine.getSoldState());
  }

  ejectQuarter(): void {
    console.log("please wait while we dispense the gumball");
    this.machine.setState(this.machine.getSoldState());
  }

  turnCrank(): void {
    console.log("please wait while we dispense the gumball");
    this.machine.setState(this.machine.getSoldState());
  }

  dispense(): void {
    if (this.machine.getGumballCount() > 0) {
      console.log("dispensing gumball");
      this.machine.setGumballCount(this.machine.getGumballCount() - 1);
    }

    const winner = Math.random() > 0.5;

    if (winner && this.machine.getGumballCount() > 0) {
      console.log("you are winner! dispensing another gumball");
      this.machine.setGumballCount(this.machine.getGumballCount() - 1);
    }

    if (this.machine.getGumballCount() > 0) {
      this.machine.setState(this.machine.getNoQuarterState());
    } else {
      this.machine.setState(this.machine.getOutOfGumballsState());
    }
  }

  refill(): void {
    console.log("please wait while we are dispensing the gumball");
    this.machine.setState(this.machine.getSoldState());
  }
}

class GumballMachine {
  private gumballCount: number;
  private state: State;
  private readonly outOfGumballsState: State;
  private readonly noQuarterState: State;
  private readonly hasQuarterState: State;
  private readonly soldState: State;

  constructor(gumballCount: number) {
    this.gumballCount = gumballCount;
    this.outOfGumballsState = new OutOfGumballsState(this);
    this.noQuarterState = new NoQuarterState(this);
    this.hasQuarterState = new HasQuarterState(this);
    this.soldState = new SoldState(this);
    if (this.gumballCount > 0) {
      this.state = this.noQuarterState;
    } else {
      this.state = this.outOfGumballsState;
    }
  }

  getOutOfGumballsState(): State {
    return this.outOfGumballsState;
  }

  getNoQuarterState(): State {
    return this.noQuarterState;
  }

  getHasQuarterState(): State {
    return this.hasQuarterState;
  }

  getSoldState(): State {
    return this.soldState;
  }

  getState(): State {
    return this.state;
  }

  setState(state: State): void {
    this.state = state;
  }

  getGumballCount(): number {
    return this.gumballCount;
  }

  setGumballCount(count: number): void {
    this.gumballCount = count;
  }

  insertQuarter(): void {
    this.state.insertQuarter();
  }

  ejectQuarter(): void {
    this.state.ejectQuarter();
  }

  turnCrank(): void {
    this.state.turnCrank();
    this.state.dispense();
  }

  refill(count: number): void {
    this.state.refill(count);
  }

  print(): void {
    console.log();
    console.log("----------------------");
    console.log("Gumballs left:", this.gumballCount);
    console.log("Machine State:", this.state);
    console.log("----------------------");
    console.log();
  }
}

function statePattern(): void {
  const gumballMachine = new GumballMachine(5);

  gumballMachine.print();

  gumballMachine.insertQuarter();
  gumballMachine.print();

  gumballMachine.turnCrank();
  gumballMachine.print();

  gumballMachine.insertQuarter();
  gumballMachine.print();

  gumballMachine.turnCrank();
  gumballMachine.print();

  gumballMachine.insertQuarter();
  gumballMachine.print();

  gumballMachine.ejectQuarter();
  gumballMachine.print();

  gumballMachine.insertQuarter();
  gumballMachine.print();

  gumballMachine.insertQuarter();
  gumballMachine.print();

  gumballMachine.turnCrank();
  gumballMachine.print();

  gumballMachine.turnCrank();
  gumballMachine.print();

  gumballMachine.ejectQuarter();
  gumballMachine.print();

  gumballMachine.insertQuarter();
  gumballMachine.print();

  gumballMachine.turnCrank();
  gumballMachine.print();

  gumballMachine.insertQuarter();
  gumballMachine.print();

  gumballMachine.turnCrank();
  gumballMachine.print();

  gumballMachine.insertQuarter();
  gumballMachine.print();

  gumballMachine.turnCrank();
  gumballMachine.print();

  gumballMachine.refill(2);
  gumballMachine.print();

  gumballMachine.insertQuarter();
  gumballMachine.print();

  gumballMachine.refill(1);
  gumballMachine.print();

  gumballMachine.turnCrank();
  gumballMachine.print();

  gumballMachine.refill(1);
  gumballMachine.print();
}

export default statePattern;
