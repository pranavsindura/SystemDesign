const UnsupportedException = new Error("UnsupportedException");

interface CustomIterator<T> {
  hasNext: () => boolean;
  next: () => T;
}

class NullIterator implements CustomIterator<null> {
  next: () => null = () => null;
  hasNext: () => boolean = () => false;
}

class ArrayIterator<T> implements CustomIterator<T> {
  list: T[];
  index: number;

  constructor(list: T[]) {
    this.list = list;
    this.index = -1;
  }

  hasNext: () => boolean = () => {
    return this.index + 1 < this.list.length;
  };

  next: () => T = () => {
    this.index += 1;
    return this.list[this.index];
  };
}

class CompositeIterator implements CustomIterator<MenuComponent | null> {
  stack: Array<CustomIterator<MenuComponent | null>>;

  constructor(iterator: CustomIterator<MenuComponent | null>) {
    this.stack = [];
    this.stack.push(iterator);
  }

  next: () => MenuComponent | null = () => {
    if (this.hasNext()) {
      const top = this.stack[this.stack.length - 1];
      const next = top.next();

      if (next instanceof Menu) {
        this.stack.push(next.createIterator());
      }

      return next;
    } else {
      return null;
    }
  };

  hasNext: () => boolean = () => {
    while (this.stack.length > 0) {
      const top = this.stack[this.stack.length - 1];
      if (top.hasNext()) {
        return true;
      }
      this.stack.pop();
    }

    return false;
  };
}

abstract class MenuComponent {
  getName(): string {
    throw UnsupportedException;
  }

  getDescription(): string {
    throw UnsupportedException;
  }

  getPrice(): number {
    throw UnsupportedException;
  }

  isVegetarian(): boolean {
    throw UnsupportedException;
  }

  abstract createIterator(): CustomIterator<MenuComponent | null>;

  print(): void {
    throw UnsupportedException;
  }

  addChild(_item: MenuComponent): void {
    throw UnsupportedException;
  }

  removeChild(_item: MenuComponent): void {
    throw UnsupportedException;
  }
}

class MenuItem extends MenuComponent {
  name: string;
  description: string;
  price: number;
  vegetarian: boolean;

  constructor(
    name: string,
    description: string,
    price: number,
    vegetarian: boolean,
  ) {
    super();
    this.name = name;
    this.description = description;
    this.price = price;
    this.vegetarian = vegetarian;
  }

  getName(): string {
    return this.name;
  }

  getDescription(): string {
    return this.description;
  }

  getPrice(): number {
    return this.price;
  }

  isVegetarian(): boolean {
    return this.vegetarian;
  }

  print(): void {
    console.log(
      this.name,
      `(${!this.vegetarian ? "NON-" : ""}VEG)`,
      "-",
      this.description,
      "-",
      this.price,
    );
  }

  createIterator(): CustomIterator<null> {
    return new NullIterator();
  }
}

class Menu extends MenuComponent {
  name: string;
  menuItems: MenuComponent[];

  constructor(name: string) {
    super();
    this.name = name;
    this.menuItems = [];
  }

  getName(): string {
    return this.name;
  }

  print(): void {
    console.log(this.name);
    console.log("----------------");
  }

  addChild(item: MenuComponent): void {
    this.menuItems.push(item);
  }

  removeChild(item: MenuComponent): void {
    const index = this.menuItems.indexOf(item);
    if (index >= 0) {
      this.menuItems.splice(index, 1);
    }
  }

  createIterator(): CustomIterator<MenuComponent | null> {
    return new ArrayIterator(this.menuItems);
  }
}

class Waitress {
  menu: MenuComponent;

  constructor(menu: MenuComponent) {
    this.menu = menu;
  }

  printMenu(): void {
    console.log("All Menu");
    console.log("----------------");
    const iterator = new CompositeIterator(this.menu.createIterator());
    while (iterator.hasNext()) {
      const next = iterator.next();
      if (next != null) {
        next.print();
      }
    }
  }

  printVegetarianMenu(): void {
    console.log("Vegetarian Menu");
    console.log("----------------");
    const iterator = new CompositeIterator(this.menu.createIterator());
    while (iterator.hasNext()) {
      const next = iterator.next();
      try {
        if (next != null && next.isVegetarian()) {
          next.print();
        }
      } catch (e) {}
    }
  }
}

function compositePattern(): void {
  const allMenu = new Menu("All Menu");
  const dinerMenu = new Menu("Diner Menu");
  const cafeMenu = new Menu("Cafe Menu");
  const dessertMenu = new Menu("Dessert Menu");

  allMenu.addChild(dinerMenu);
  allMenu.addChild(cafeMenu);

  cafeMenu.addChild(
    new MenuItem("Omelet", "Omelet made with 3 eggs", 100, false),
  );
  cafeMenu.addChild(
    new MenuItem(
      "Poha",
      "Indori Poha with peanuts and fresh vegetables",
      60,
      true,
    ),
  );

  dinerMenu.addChild(
    new MenuItem("Pav Bhaji", "Masala Bhaji served with 4 Pavs", 120, true),
  );
  dinerMenu.addChild(
    new MenuItem(
      "Hyderabadi Biryani",
      "Flavourful hyderabadi biryani served with a small coke",
      250,
      false,
    ),
  );
  dinerMenu.addChild(dessertMenu);

  dessertMenu.addChild(
    new MenuItem("Mysore Pak", "Besan barfi with ghee", 120, true),
  );
  dessertMenu.addChild(
    new MenuItem("Tiramisu", "Coffee chocolate Tiramisu", 250, false),
  );

  const waitress = new Waitress(allMenu);
  waitress.printVegetarianMenu();
  waitress.printMenu();
}

export default compositePattern;
