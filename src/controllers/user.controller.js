const { generateToken } = require("../helpers/jwt.helper");
const {
  getUsers,
  getUserById,
  insertUser,
  updateUser,
  deleteUser,
  getUserByEmail,
} = require("../services/user.service");
const bcrypt = require("bcrypt");

module.exports = {
  getUsers: async (req, res) => {
    try {
      const users = await getUsers();
      const usersResponse = users.map(({ id, username, email, address }) => {
        return {
          id,
          username,
          email,
          detail: `/api/users/${id}`,
          address: address ? address.address : null,
        };
      });

      const RESPONSE = {
        count: users.length,
        users: usersResponse,
      };

      return res.status(200).json(RESPONSE);
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  },
  getUserById: async (req, res) => {
    try {
      const USER_ID = req.params.id;
      const { id, username, email, avatar, address, postal_code, province, city } = await getUserById(
        USER_ID
      );

      const USER_DATA_RESPONSE = {
        id,
        username,
        email,
        avatar,
        address: address ? address.address : null,
        postal_code: postal_code ? postal_code.address : null,
        province: province ? province.address : null,
        city: city ? city.address : null,
      };

      return res.status(200).json(USER_DATA_RESPONSE);
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  },
  createUser: async (req, res) => {
    try {
      const result = await insertUser({ 
        ...req.body,
        password: bcrypt.hashSync(req.body.password, 10),
        role: "user"
       });

      if (result) {
        const SUCCESS_RESPONSE = "User created successfully";
        return res.status(201).json({ msg: SUCCESS_RESPONSE });
      } else {
        const ERROR_RESPONSE = "Somethings wrong";
        return res.status(400).json({ msg: ERROR_RESPONSE });
      }
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  },
  login: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await getUserByEmail(email);
      const token = generateToken(user);

      return res.status(200).json({token})
    } catch (error) {
      return res.status(500).json({ Error: "Token error " + error });
    }
  },
  updateUser: async (req, res) => {
    try {
      const { id } = req.params;
      const userData = req.body;

      const result = await updateUser(id, userData);
  
      if (result) {
        const successResponse = "User updated successfully";
        return res.status(200).json({ msg: successResponse });
      } else {
        const errorResponse = "Something went wrong";
        return res.status(400).json({ msg: errorResponse });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      return res.status(500).json({ Error: error.message });
    }
  },
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params;
  
      const result = await deleteUser(id);
  
      if (result) {
        const successResponse = "User deleted successfully";
        return res.status(200).json({ msg: successResponse });
      } else {
        const errorResponse = "User not found";
        return res.status(404).json({ msg: errorResponse });
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ Error: error.message });
    }
  }  
};
