import fs from "fs/promises"

class ProductManager {
    static lastId = 0;
    constructor(path) {
      this._products = [];
      this._path = path;

      this.loadArray();
    }

    async loadArray() {
        try {
            this._products = await this.readFile();
        } catch (error) {
            console.log("error while initiating ProductManager")
        }
    }
  
    async addProduct({title, description, price, img, code, stock}) {
      if (!title || !description || !price || !code || !stock) {
        console.log("All fields are mandatory");
        return;
      }
  
      if (this._products.some(item => item.code === code)) {
        console.log("Code most be unique");
        return;
      }
  
      const lastProductId = this._products.length > 0 ? this._products[this._products.length - 1].id : 0;
      const newProduct = {
        id: lastProductId + 1,
        title,
        description,
        price,
        img,
        code,
        stock,
      };
  
      this._products.push(newProduct);

      await this.saveFile(this._products)
    }

    async getProducts() {
      try {
        const productArray = await this.readFile();
        return productArray;
      } catch (error) {
        console.log("error while reading file", error);
      }

    }

    async getProductById(id) {
      try {
        const productArray = await this.readFile();
        const searching = productArray.find(item => item.id === id);

      if (!searching) {
        console.log("Product not found");
        return null;
      }else{
          console.log("Product found");
          return searching;
      }
    } catch (error) {
        console.log("Error while searching by ID", error);
    }
  }

  async readFile() {
    const response = await fs.readFile(this._path, "utf-8");
    const productArray = JSON.parse(response);
    return productArray;
}

async saveFile(productArray) {
    await fs.writeFile(this._path, JSON.stringify(productArray, null, 2));
}

async updateProduct(id, productUpdated) {
    try {
        const productArray = await this.readFile(); 

        const index = productArray.findIndex( item => item.id === id); 

        if(index !== -1) {
            productArray[index] = {...productArray[index], ...productUpdated} ; 
            await this.saveFile(productArray); 
            console.log("Product Updated"); 
        } else {
            console.log("Product not found"); 
        }
    } catch (error) {
        console.log("There's an arror while updating products"); 
    }
}

async deleteProduct(id) {
    try {
        const productArray = await this.readFile(); 

        const index = productArray.findIndex( item => item.id === id); 

        if(index !== -1) {
            productArray.splice(index, 1); 
            await this.saveFile(productArray); 
            console.log("Product deleted"); 
            return true;
        } else {
            console.log("Product not found"); 
            return false;
        }
    } catch (error) {
        console.log("There's an error while deleting product"); 
        throw error;
    }
}

}

export default ProductManager; 


