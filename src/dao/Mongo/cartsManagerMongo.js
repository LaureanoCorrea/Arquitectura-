import cartsModel from "../models/carts.model.js";

class CartManagerMongo {
  constructor() {
    this.cartsModel = cartsModel;
  }

  async getCarts() {
    try {
      return await this.cartsModel.find({});
    } catch (error) {
      throw new Error("Error al obtener los carritos");
    }
  }

  async getCartByUserId(userId) {
    try {
      const cart = await this.cartsModel.findOne({ user: userId });
      if (!cart) {
        throw new Error("Cart not found for user");
      }
      return cart;
    } catch (error) {
      throw new Error(`Error getting cart: ${error.message}`);
    }
  }

  async getCartById(cartId) {
    try {
      const cart = await this.cartsModel.findById(cartId);
      if (!cart) {
        throw new Error("Cart not found");
      }
      return cart;
    } catch (error) {
      throw new Error(`Error getting cart: ${error.message}`);
    }
  }

  async getCartByIdLean(cartId) {
    try {
      const cart = await this.cartsModel.findById(cartId).lean();
      if (!cart) {
        throw new Error("Cart not found");
      }
      return cart;
    } catch (error) {
      throw new Error(`Error getting cart: ${error.message}`);
    }
  }

  async createCart(newCart) {
    try {
      const cart = await this.cartsModel.create(newCart);
      return cart;
    } catch (error) {
      throw new Error("Error al crear el carrito");
    }
  }

  async addToCart(cartId, productId, quantity) {
    try {
      let cart = await this.cartsModel.findById(cartId);
      console.log("carrito manager", cartId);
      if (!cart) {
        return { message: "El carrito no ha sido encontrado" };
        console.log("no hay cart");
      } else {
        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.products.findIndex(
          (item) => item.product.equals(productId),
          console.log("equal")
        );

        if (existingProductIndex !== -1) {
          // Si el producto ya está en el carrito, actualizar la cantidad
          cart.products[existingProductIndex].quantity += quantity;
        } else {
          // Si el producto no está en el carrito, agregarlo
          cart.products.push({ product: productId, quantity });
          console.log("agregado");
        }
      }
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(`Error adding product to cart: ${error.message}`);
    }
  }

  async updateCart(cartId, productId, nuevaCantidad) {
    try {
      const updatedCart = await this.cartsModel.findByIdAndUpdate(
        cartId,
        { $set: { "products.$[elem].quantity": nuevaCantidad } },
        {
          new: true,
          arrayFilters: [{ "elem._id": productId }],
        }
      );
      return updatedCart;
    } catch (error) {
      console.error("Error al actualizar el carrito:", error);
      throw new Error("Error al actualizar el carrito en la base de datos");
    }
  }

  async removeFromCart(cartId, productId) {
    try {
      const cart = await this.cartsModel.findById(cartId);
      if (!cart) {
        throw new Error("El carrito no ha sido encontrado");
      }

      console.log("Cart before removing product:", cart);

      // Buscar el índice del producto en el array de productos del carrito
      const index = cart.products.findIndex(
        (item) => item._id.toString() === productId.toString()
      );
      if (index !== -1) {
        // Eliminar el producto del array utilizando splice
        cart.products.splice(index, 1);
      } else {
        console.log("El producto no se encontró en el carrito");
      }

      console.log("Cart after removing product:", cart);

      // Guardar los cambios en el carrito en la base de datos
      const updatedCart = await cart.save();
      return updatedCart;
    } catch (error) {
      throw new Error(
        `Error al eliminar el producto del carrito: ${error.message}`
      );
    }
  }

  async removeAllFromCart(cartId) {
    try {
      const cart = await this.cartsModel.findById(cartId);
      if (!cart) {
        throw new Error("El carrito no ha sido encontrado");
      }
      // Eliminar todos los productos del carrito
      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      throw new Error(
        `Error al eliminar todos los productos del carrito: ${error.message}`
      );
    }
  }

  async deleteCart(cid) {
    try {
      return await this.cartsModel.findByIdAndDelete(cid);
    } catch (error) {
      throw new Error("Error al eliminar el carrito");
    }
  }
}

export default CartManagerMongo;
