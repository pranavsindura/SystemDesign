enum PizzaType {
  CHEESE,
  VEGGIE,
}

abstract class Pizza {
  name: string = "UNKNOWN";
  dough: string = "UNKNOWN";
  sauce: string = "UNKNOWN";
  toppings: string[] = [];

  prepare(): void {
    console.log("Preparing", this.name);
    console.log("Tossing dough", this.dough);
    console.log("Adding Sauce", this.sauce);
    console.log("Adding Toppings", this.toppings.join(", "));
  }

  bake(): void {
    console.log("Bake for 25m at 350");
  }

  cut(): void {
    console.log("Cutting the pizza into diagonal slices");
  }

  box(): void {
    console.log("Place pizza in official PizzaStore box");
  }

  getName(): string {
    return this.name;
  }
}

class NYStyleCheesePizza extends Pizza {
  constructor() {
    super();
    this.name = "NY Style Sauce and Cheese Pizza";
    this.dough = "Thin Crust Dough";
    this.sauce = "Marinara Sauce";
    this.toppings.push("Grated Reggiano Cheese");
  }
}

class NYStyleVeggiePizza extends Pizza {
  constructor() {
    super();
    this.name = "NY Style Veggie Pizza";
    this.dough = "Medium Crust Dough";
    this.sauce = "Ranch Sauce";
    this.toppings.push("Black Olives");
    this.toppings.push("Capsicum");
    this.toppings.push("Tomatoes");
  }
}

class ChicagoStyleCheesePizza extends Pizza {
  constructor() {
    super();
    this.name = "Chicago Style Deep Dish Cheese Pizza";
    this.dough = "Extra Thick Crust Dough";
    this.sauce = "Plum Tomato Sauce";
    this.toppings.push("Shredded Mozzarella Cheese");
  }

  cut(): void {
    console.log("Cutting the pizza into square slices");
  }
}

abstract class PizzaFactory {
  orderPizza(type: PizzaType): Pizza | null {
    const pizza = this.createPizza(type);
    if (pizza == null) {
      return null;
    }
    pizza.prepare();
    pizza.bake();
    pizza.cut();
    pizza.box();

    return pizza;
  }

  protected abstract createPizza(type: PizzaType): Pizza | null;
}

class NYPizzaFactory extends PizzaFactory {
  protected override createPizza(type: PizzaType): Pizza | null {
    switch (type) {
      case PizzaType.CHEESE:
        return new NYStyleCheesePizza();
      case PizzaType.VEGGIE:
        return new NYStyleVeggiePizza();
      default:
        return null;
    }
  }
}

class ChicagoPizzaFactory extends PizzaFactory {
  protected createPizza(type: PizzaType): Pizza | null {
    switch (type) {
      case PizzaType.CHEESE:
        return new ChicagoStyleCheesePizza();
      default:
        return null;
    }
  }
}

function factoryPattern(): void {
  const chicagoPizzaFactory = new ChicagoPizzaFactory();
  const nyPizzaFactory = new NYPizzaFactory();

  let pizza = chicagoPizzaFactory.orderPizza(PizzaType.CHEESE);
  console.log(pizza?.getName());

  pizza = chicagoPizzaFactory.orderPizza(PizzaType.VEGGIE);
  console.log(pizza?.getName());

  pizza = nyPizzaFactory.orderPizza(PizzaType.CHEESE);
  console.log(pizza?.getName());

  pizza = nyPizzaFactory.orderPizza(PizzaType.VEGGIE);
  console.log(pizza?.getName());
}

factoryPattern();
