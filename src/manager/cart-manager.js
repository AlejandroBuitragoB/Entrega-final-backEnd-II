import fs from "fs/promises";

class CartManager {
  constructor(path) {
    this._path = path;
    this._carts = [];
    this._lastId = 0;

    this.loadCarts();
  }

  async loadCarts() {
    try {
      const data = await fs.readFile(this._path, "utf-8");
      this._carts = JSON.parse(data);
      if (this._carts.length > 0) {
        this._lastId = Math.max(...this._carts.map((cart) => cart.id));
      }
    } catch (error) {
      console.log("Error while loading cart");
      await this.saveCarts();
    }
  }

  async saveCarts() {
    await fs.writeFile(this._path, JSON.stringify(this._carts, null, 2));
  }

  async createCart() {
    const newCart = {
      id: ++this._lastId,
      products: [],
    };

    this._carts.push(newCart);

    await this.saveCarts();
    return newCart;
  }

  async getCartById(cartId) {
    try {
      const searchedCart = this._carts.find((cart) => cart.id === cartId);

      if (!searchedCart) {
        throw new Error("There's no cart with that ID");
      }
      return searchedCart;
    } catch (error) {
      throw new Error("Error at getting cards");
    }
  }

  async addProductToCart(cartId, productId, quantity = 1) {
    const cart = await this.getCartById(cartId);
    const productExist = cart.products.find(item => item.product === productId);
    if (productExist) {
      productExist.quantity += quantity;
    } else {
      cart.products.push({ product: productId, quantity });
    }

    await this.saveCarts();
    return cart;
  }
}

export default CartManager;
