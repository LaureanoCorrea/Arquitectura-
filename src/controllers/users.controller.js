import { cartService, userService } from "../repositories/index.js";

class UserController {
  constructor() {
    this.service = userService;
    this.service = cartService;
  }

  get = async (req, res) => {
    try {
      const users = await this.service.getUsers();
      res.send(users);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor al obtener usuarios",
      });
    }
  };

  createUser = async (req, res) => {
    try {
      const { first_name, last_name, email, password } = req.body;
      const newUser = await this.service.createUser({
        first_name,
        last_name,
        email,
        password,
      });

      const newCart = await this.service.createCart({ products: [] });
      await this.service.updateUserCart(newUser._id, newCart._id);

      res.status(201).json({
        status: "success",
        message: `El usuario ${first_name} ${last_name} ha sido creado con éxito`,
        user: newUser,
        cart: newCart,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor al crear usuario",
      });
    }
  };

  getUserById = async (req, res) => {
    try {
      const { uid } = req.params;
      const user = await this.service.getBy({ _id: uid });
      res.json({
        status: "success",
        message: `Usuario ${user.first_name} ${user.last_name} id "${uid}" encontrado`,
        result: user,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor al obtener usuario por ID",
      });
    }
  };

  updateUser = async (req, res) => {
    try {
      const { uid } = req.params;
      const userToUpdate = req.body;
      const result = await this.service.updateUser(uid, userToUpdate);
      res.status(200).json({
        status: "success",
        message: `El usuario ${result.first_name} ${result.last_name} con id "${uid}" ha sido actualizado`,
        result: result,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor al actualizar usuario",
      });
    }
  };

  deleteUser = async (req, res) => {
    try {
      const { uid } = req.params;
      const result = await this.service.deleteUser(uid);
      res.status(200).json({
        status: "success",
        message: `El usuario con id "${uid}" ha sido eliminado`,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: "error",
        message: "Error interno del servidor al eliminar usuario",
      });
    }
  };
}

export default UserController;
