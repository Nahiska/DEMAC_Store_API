const { User, Address } = require("../database/models");

const getUsers = async () => {
  try {
    return await User.findAll({
      include: [{ model: Address, as: "address" }],
    });
  } catch (error) {
    console.error("Error while fetching users:", error);
    throw new Error("Error fetching users");
  }
};

const getUserById = async (id) => {
  try {
    return await User.findByPk(id, {
      include: [{ model: Address, as: "address" }],
    });
  } catch (error) {
    console.error("Error while fetching user:", error);
    throw new Error("Error fetching user");
  }
};

const getUserByEmail = async (email) => {
  try {
    return await User.findOne({
      where: { email },
      include: [{ model: Address, as: "address" }],
    });
  } catch (error) {
    console.error("Error while fetching user:", error);
    throw new Error("Error fetching user");
  }
};

const insertUser = async (userData) => {
  try {
    return await User.create(userData, {
      include: [
        { association: "address" },
      ],
    });
  } catch (error) {
    console.error("Error while insert user:", error);
    throw new Error("Error insert user");
  }
};

const updateUser = async (id, userData) => {
  try {
    return await User.update(userData, {
      where: { id },
      include: [
        { association: "address" },
      ],
    });
  } catch (error) {
    console.error("Error while updating user:", error);
    throw new Error("Error updating user");
  }
};

const deleteUser = async (userId) => {
  try {
    const user = await User.findOne({ where: { id: userId } });

    if (!user) {
      throw new Error("User not found");
    }

    await Address.destroy({ where: { userId: userId } });
    await User.destroy({ where: { id: userId } });

    return true;
  } catch (error) {
    console.log("Error while deleting user:", error);
    throw error;
  }
};

module.exports = {
  getUsers,
  getUserById,
  getUserByEmail,
  insertUser,
  updateUser,
  deleteUser
};
