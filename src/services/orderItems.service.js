const { OrderProduct } = require("../database/models");

const getOrdersItems = async () => {
  try {
    return await OrderProduct.findAll();
  } catch (error) {
    console.error("Error while fetching order item:", error);
    throw new Error("Error fetching order item");
  }
};

const getOrderItemById = async (id) => {
  try {
    return await OrderProduct.findByPk(id);
  } catch (error) {
    console.error("Error while fetching order item:", error);
    throw new Error("Error fetching order item");
  }
};

const getOrderItemsByOrder = async (orderID) => {
  try {
    return await OrderProduct.findAll({
      where: {
        orderID,
      },
      include: [{ association: "products" }],
    });
  } catch (error) {
    console.error("Error while fetching order item:", error);
    throw new Error("Error fetching order item");
  }
};

const insertOrderItem = async (data) => {
  try {
    return await OrderProduct.create(data);
  } catch (error) {
    console.error("Error while fetching order item:", error);
    throw new Error("Error fetching order item");
  }
};

const updateOrderItem = async (data, itemId) => {
  try {
    return await OrderProduct.update(data, {
      where: {
        id: itemId,
      },
    });
  } catch (error) {
    console.error("Error while updating order item:", error);
    throw new Error("Error updating order item");
  }
};

const deleteOrderItem = async (id) => {
  try {
    return await OrderProduct.destroy({
      where: {
        id,
      },
    });
  } catch (error) {
    console.error("Error while deleting order item:", error);
    throw new Error("Error deleting order item");
  }
};

const bulkDeleteOrderItems = async (orderID) => {
  try {
    return await OrderProduct.destroy({
      where: {
        orderID,
      },
    });
  } catch (error) {
    console.error("Error while deleting order items:", error);
    throw new Error("Error deleting order items");
  }
};

module.exports = {
  getOrdersItems,
  getOrderItemById,
  getOrderItemsByOrder,
  insertOrderItem,
  updateOrderItem,
  deleteOrderItem,
  bulkDeleteOrderItems
};
