// Abstract Beverage Interface
interface Beverage {
  getDescription: () => string;
  getCost: () => number;
}

// Abstract CondimentDecorator Interface
interface CondimentDecorator extends Beverage {}

class HouseBlend implements Beverage {
  getCost(): number {
    return 100;
  }

  getDescription(): string {
    return "House Blend Coffee";
  }
}

class Decaf implements Beverage {
  getCost(): number {
    return 120;
  }

  getDescription(): string {
    return "Decaf";
  }
}

class Mocha implements CondimentDecorator {
  beverage: Beverage;
  constructor(beverage: Beverage) {
    this.beverage = beverage;
  }

  getCost(): number {
    return this.beverage.getCost() + 25;
  }

  getDescription(): string {
    return this.beverage.getDescription() + ", Mocha";
  }
}

class WhippedCream implements CondimentDecorator {
  beverage: Beverage;
  constructor(beverage: Beverage) {
    this.beverage = beverage;
  }

  getCost(): number {
    return this.beverage.getCost() + 50;
  }

  getDescription(): string {
    return this.beverage.getDescription() + ", WhippedCream";
  }
}

function decoratorPattern(): void {
  let beverage1 = new HouseBlend();
  beverage1 = new Mocha(beverage1);
  beverage1 = new Mocha(beverage1);

  console.log(beverage1.getDescription(), beverage1.getCost());

  let beverage2 = new Decaf();
  beverage2 = new Mocha(beverage2);
  beverage2 = new WhippedCream(beverage2);

  console.log(beverage2.getDescription(), beverage2.getCost());
}

decoratorPattern();
