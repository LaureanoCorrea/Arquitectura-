import UserManagerMongo from "../dao/Mongo/userManagerMongo.js";
import CartManagerMongo from "../dao/Mongo/cartsManagerMongo.js";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import { generateToken } from "../utils/jsonwebtoken.js";

class SessionsController {
  constructor() {
    this.userService = new UserManagerMongo();
    this.cartService = new CartManagerMongo();
  }

  async register(req, res) {
    const { first_name, last_name, email, password } = req.body;

    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.userService.getUser({ email });
      if (existingUser) {
        return res.status(400).json({ error: "El usuario ya existe" });
      }

      // Crear el nuevo usuario
      const newUser = await this.userService.createUser({
        first_name,
        last_name,
        email,
        date_of_birth: req.body.date_of_birth,
        password: createHash(password),
        cart: null,
      });

      // Crear un carrito de compras asociado al nuevo usuario
      const newCart = await this.cartService.createCart({ userId: newUser._id });

      // Actualizar el usuario con el ID del carrito
      await this.userService.updateUser(newUser._id, { cart: newCart._id });

      // Generar el token y establecer las cookies
      const token = generateToken({
        first_name: newUser.first_name,
        id: newUser._id,
        role: newUser.role,
        cart: newCart._id,
      });
      res.cookie("cookieToken", token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      });
      res.cookie("cartId", newCart._id, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      });

      res.status(201).render("exito", { name: newUser.first_name });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      res.status(500).json({ error: "Error interno del servidor" });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;

      const user = await this.userService.getUserBy({ email });
      if (!user || !isValidPassword({ password: user.password }, password))
        return res.status(401).send("Credenciales inválidas");

      const cartId = user.cart;
      if (!cartId) {
        return res.status(400).send("CartId no está presente en las cookies");
      }
      const cart = await this.cartService.getCartById(user.cart);
      const token = generateToken({
        first_name: user.first_name,
        id: user._id,
        role: user.role,
        cart: cart._id,
      });
      console.log(token);
      res.cookie("cookieToken", token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      });
      res.cookie("cartId", cart._id, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      });
      res.redirect("/products");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).send("Error interno del servidor");
    }
  }

  failLogin(req, res) {
    res.send({ status: "error", message: "Login Fails" });
  }

  logout(req, res) {
    res.clearCookie("cookieToken");
    res.redirect("/login");
  }
}

export default SessionsController;
