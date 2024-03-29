interface FlyBehaviourStrategy {
  fly: () => void;
}

class LongFlyBehaviour implements FlyBehaviourStrategy {
  fly(): void {
    console.log("Taking off for a long flight!");
  }
}

class NoFlyBehaviour implements FlyBehaviourStrategy {
  fly(): void {
    console.log("Sorry! No flight possible.");
  }
}

abstract class Duck {
  flyBehaviour: FlyBehaviourStrategy;

  constructor(flyBehaviour: FlyBehaviourStrategy) {
    this.flyBehaviour = flyBehaviour;
  }

  performFly(): void {
    this.flyBehaviour.fly();
  }
}

class MallardDuck extends Duck {
  constructor() {
    super(new LongFlyBehaviour());
  }
}

class RubberDuck extends Duck {
  constructor() {
    super(new NoFlyBehaviour());
  }
}

function strategyPattern(): void {
  const mallardDuck = new MallardDuck();
  const rubberDuck = new RubberDuck();

  mallardDuck.performFly();
  rubberDuck.performFly();
}

export default strategyPattern;
