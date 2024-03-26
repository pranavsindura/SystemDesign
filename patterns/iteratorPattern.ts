interface CustomIterator<T> {
  hasNext: () => boolean;
  next: () => T;
}

interface Menu {
  createIterator: () => CustomIterator<MenuItem>;
}

class MenuItem {
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
}

class BreakfastMenuIterator implements CustomIterator<MenuItem> {
  list: MenuItem[];
  index: number;

  constructor(list: MenuItem[]) {
    this.list = list;
    this.index = -1;
  }

  next(): MenuItem {
    this.index += 1;
    return this.list[this.index];
  }

  hasNext(): boolean {
    return this.index + 1 < this.list.length;
  }
}

class BreakfastMenu implements Menu {
  menuItems: MenuItem[];

  constructor() {
    this.menuItems = [];
    this.addItem(new MenuItem("Omelet", "Omelet made with 3 eggs", 100, false));
    this.addItem(
      new MenuItem(
        "Poha",
        "Indori Poha with peanuts and fresh vegetables",
        60,
        true,
      ),
    );
  }

  addItem(item: MenuItem): void {
    this.menuItems.push(item);
  }

  createIterator(): BreakfastMenuIterator {
    return new BreakfastMenuIterator(this.menuItems);
  }
}

class DinerMenuIterator implements CustomIterator<MenuItem> {
  set: Set<MenuItem>;
  valuesIterator: IterableIterator<MenuItem>;
  valuesSeen: number;

  constructor(set: Set<MenuItem>) {
    this.set = set;
    this.valuesIterator = set.values();
    this.valuesSeen = 0;
  }

  next(): MenuItem {
    this.valuesSeen += 1;
    return this.valuesIterator.next().value;
  }

  hasNext(): boolean {
    return this.valuesSeen + 1 <= this.set.size;
  }
}

class DinerMenu implements Menu {
  menuItems: Set<MenuItem>;

  constructor() {
    this.menuItems = new Set();
    this.addItem(
      new MenuItem("Pav Bhaji", "Masala Bhaji served with 4 Pavs", 120, true),
    );
    this.addItem(
      new MenuItem(
        "Hyderabadi Biryani",
        "Flavourful hyderabadi biryani served with a small coke",
        250,
        false,
      ),
    );
  }

  addItem(item: MenuItem): void {
    this.menuItems.add(item);
  }

  createIterator: () => CustomIterator<MenuItem> = () => {
    return new DinerMenuIterator(this.menuItems);
  };
}

class Waitress {
  dinerMenu: DinerMenu;
  breakfastMenu: BreakfastMenu;

  constructor(dinerMenu: DinerMenu, breakfastMenu: BreakfastMenu) {
    this.breakfastMenu = breakfastMenu;
    this.dinerMenu = dinerMenu;
  }

  getMenu(): void {
    const breakfastMenuIterator = this.breakfastMenu.createIterator();
    this.getMenuWithIterator(breakfastMenuIterator);
    const dinerMenuIterator = this.dinerMenu.createIterator();
    this.getMenuWithIterator(dinerMenuIterator);
  }

  getMenuWithIterator(iterator: CustomIterator<MenuItem>): void {
    while (iterator.hasNext()) {
      const item = iterator.next();
      console.log(
        item.getName(),
        "-",
        item.getDescription(),
        `(${item.isVegetarian() ? "VEG" : "NON-VEG"})`,
        "-",
        `Rs. ${item.price}`,
      );
    }
  }
}

function iteratorPattern(): void {
  const waitress = new Waitress(new DinerMenu(), new BreakfastMenu());

  waitress.getMenu();
}

iteratorPattern();
export {};
