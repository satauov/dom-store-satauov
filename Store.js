export class Store {
  #items = [];

  constructor(initialItems = []) {
    if (Array.isArray(initialItems)) this.#items = [...initialItems];
  }

  add(item) {
    if (item && typeof item === 'object') this.#items.push(item);
  }

  remove(index) {
    if (index >= 0 && index < this.#items.length) this.#items.splice(index, 1);
  }

  updateQty(index, newQty) {
    if (index >= 0 && index < this.#items.length && newQty >= 0) {
      this.#items[index].qty = newQty;
    }
  }

  get items() { return [...this.#items]; }

  get total() {
    return this.#items.reduce((sum, item) => sum + ((item.price || 0) * (item.qty || 0)), 0);
  }
}
