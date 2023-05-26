const { Order } = require("../database/models");

const getOrders = async () => {
  return await Order.findAll();
};

const getOrderById = async (id) => {
  return await Order.findByPk(id);
};

const getOrderByUser = (userId) => {
  return Order.findOne({
    where: {
      userID: userId,
    },
    include: [
      { association: "orders_products", include: [{ association: "products" }] },
    ],
  });
};

const insertOrder = async (data) => {
    try {
        return await Order.create(data);
    } catch (error) {
        console.error("Error while fetching order :", error);
        throw new Error("Error fetching order ");
    }
};

const updateOrder = async (data, Id) => {
    try {
        return await Order.create(data, {
            where: {
                id: Id
            }
        });
    } catch (error) {
        console.error("Error while fetching order :", error);
        throw new Error("Error fetching order ");
    }
};

const deleteOrder = async (id) => {
    try {
        return await Order.destroy({
            where: {
                id
            }
        });
    } catch (error) {
        console.error("Error while fetching order :", error);
        throw new Error("Error fetching order ");
    }
};

module.exports = {
  getOrders,
  getOrderById,
  getOrderByUser,
  insertOrder,
  updateOrder,
  deleteOrder
};