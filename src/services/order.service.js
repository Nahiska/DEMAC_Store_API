const { Order } = require("../database/models");

const getOrders = async () => {
  return await Order.findAll();
};

const getOrderById = async (id) => {
  return await Order.findByPk(id);
};

const getOrderByUser = (userID) => {
  return Order.findOne({
    where: {
      userID,
    },
    include: [
      { 
        association: "orders_products",
        include: [{ association: "products" }]
      },
      { 
        association: "users"
      }
    ],
  });
};


const insertOrder = async (data) => {
  try {
    return await Order.create(data);
  } catch (error) {
    console.error("Error while creating order:", error);
    throw new Error("Error creating order");
  }
};

const updateOrder = async (data, id) => {
    try {
        return await Order.create(data, {
            where: {
                id,
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