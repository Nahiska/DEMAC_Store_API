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
    // Extrae los datos del usuario y la dirección del cuerpo de la solicitud
    const { user, address } = userData;

    // Actualiza los datos del usuario
    await User.update(user, { where: { id } });

    // Si se proporcionan datos de dirección, actualiza la dirección asociada al usuario
    if (address) {
      // Busca la dirección existente del usuario
      const existingAddress = await Address.findOne({ where: { userId: id } });

      if (existingAddress) {
        // Si la dirección existe, actualiza sus datos
        await Address.update(address, { where: { id: existingAddress.id } });
      } else {
        // Si no hay una dirección existente, crea una nueva dirección asociada al usuario
        await Address.create({ ...address, userId: id });
      }
    }

    return true; // Devuelve true si la actualización fue exitosa
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Lanza una excepción en caso de error
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
