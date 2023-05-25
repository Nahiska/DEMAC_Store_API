const { User } = require("../database/models");

const getUsers = async () => {
  try {
    return await User.findAll();
  } catch (error) {
    console.error("Error while fetching users:", error);
    throw new Error("Error fetching users");
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findByPk(id);
    
    if (!user) {
      throw new Error("Usuario no encontrado");
    }
    
    return user;
  } catch (error) {
    console.error("Error while fetching user:", error);
    throw new Error("Error fetching user");
  }
};

module.exports = {
    getUsers,
    getUserById
  };
  