abstract class CaffienatedBeverage {
  // template method
  prepareRecipe(): void {
    this.boilWater();
    this.brew();
    this.beforePouringInCup();
    this.pourInCup();
    if (this.customerNeedsCondiments()) {
      this.addCondiments();
    }
  }

  boilWater(): void {
    console.log("Boiling Water at 100deg Celcius");
  }

  abstract brew(): void;

  // concrete method
  pourInCup(): void {
    console.log("Pouring into cup");
  }

  // abstract method
  abstract addCondiments(): void;

  // hook
  customerNeedsCondiments(): boolean {
    return true;
  }

  // hook
  beforePouringInCup(): void {}
}

class Tea extends CaffienatedBeverage {
  brew(): void {
    console.log("Steeping Tea in Water");
  }

  addCondiments(): void {
    console.log("Adding Milk and Sugar");
  }

  beforePouringInCup(): void {
    console.log("Choosing favorite mug");
  }
}

class Coffee extends CaffienatedBeverage {
  brew(): void {
    console.log("Putting water into coffee filter");
  }

  addCondiments(): void {}

  customerNeedsCondiments(): boolean {
    return false;
  }
}

function templatePattern(): void {
  const tea = new Tea();
  const coffee = new Coffee();

  tea.prepareRecipe();
  coffee.prepareRecipe();
}

templatePattern();
