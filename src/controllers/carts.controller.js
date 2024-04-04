import CartManagerMongo from "../dao/Mongo/cartsManagerMongo.js";

class CartController {
  constructor() {
    console.log("Initializing CartController");
    this.cService = new CartManagerMongo();
  }
  
  async createCart(req, res) {
    try {
      const { products } = req.body;
      const newCart = await this.cService.createCart({ products });

      res.status(201).json({
        status: "success",
        message: 'Carrito agregado exitosamente "vacio"',
        cart: newCart,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async addToCart(req, res) {
    console.log("THIS", this)
    try {
      const { productId, quantity } = req.body;
      const cartId = req.user.cart;
  
      const cart = await this.cService.addToCart(
        cartId,
        productId,
        quantity
      );
      console.log('controlerID', cartId)
      res.status(200).json({
        status: "success",
        message: "Producto agregado al carrito exitosamente",
        cart,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor al agregar el producto al carrito",
      });
    }
  }

  async getCart(req, res) {
    try {
      const cartId = req.user.cart;
      const cart = await this.cService.getCartById(cartId);

      if (!cart) {
        return res.status(404).json({
          status: "error",
          message: "El carrito especificado no existe",
        });
      }

      res.render("cart", {
        cartId, // Utilizar el ID del carrito obtenido
        cart, // Pasar el carrito directamente como una propiedad
        style: "index.css",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor",
      });
    }
  }

  async updateCart(req, res) {
    try {
      const { productId } = req.params;
      const { quantity } = req.body;
      const cartId = req.user.cart;

      // Lógica para actualizar la cantidad del producto en el carrito
      const updatedCart = await this.cService.updateCart(
        cartId,
        productId,
        quantity
      );

      res.status(200).json({
        status: "success",
        message: "Cantidad del producto actualizada exitosamente",
        updatedCart,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message:
          "Error interno del servidor al actualizar la cantidad del producto en el carrito",
      });
    }
  }

  async removeFromCart(req, res) {
    const { productId } = req.params;
    const cartId = req.user.cart;

    try {
      await this.cService.removeFromCart(cartId, productId);
      res.json({ message: "Producto eliminado del carrito correctamente" });
    } catch (error) {
      next(error);
    }
  }

  async removeAllFromCart(req, res) {
    const cartId = req.user.cart;
    try {
      await this.cService.removeAllFromCart(cartId);
      res.json({ message: "Carrito vaciado correctamente" });
    } catch (error) {
      next(error);
    }
  }
}

export default CartController;
