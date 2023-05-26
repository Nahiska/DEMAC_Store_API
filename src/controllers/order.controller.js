const {
  deleteOrder,
  getOrderById,
  getOrderByUser,
  getOrders,
  insertOrder,
  updateOrder,
} = require("../services/order.service");
const {
  deleteOrderItem,
  getOrderItemById,
  getOrderItemsByOrder,
  getOrdersItems,
  insertOrderItem,
  updateOrderItem,
  bulkDeleteOrderItems,
} = require("../services/orderItems.service");

module.exports = {
  getOrders: async (req, res) => {
    try {
      const orders = await getOrders();
      const RESPONSE = {
        count: orders.length,
        orders,
      };
      return res.status(200).json(RESPONSE);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
  getOrderById: async (req, res) => {
    try {
      const ORDER_ID = req.params.orderID;
      const order = await getOrderById(ORDER_ID);
      return res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
  getOrderByUser: async (req, res) => {
    try {
      const { id } = req.user;
      const order = await getOrderByUser(id);

      let response;

      if (order) {
        return res.status(200).json(order);
      } else {
        response = `El usuario ${id} no tiene orden creada`;
        return res.status(400).json(response);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
  addToOrder: async (req, res) => {
    try {
      // id usuario
      const { id: userID } = req.user;
      // Verificar si existe una orden para el usuario
      const order = await getOrderByUser(userID);

      // id producto + quantity
      const { productID, productQuantity } = req.body;

      if (order) {
        // Si existe una orden, agregar el item
        // id orden
        const { id } = order;
        let orderItemData;
        // Obtener todos los productos de la order
        const itemsFromOrder = await getOrderItemsByOrder(id);
        // Busco el producto en la lista
        const itemToAdd = itemsFromOrder?.find(
          (item) => item.productID === productID
        );

        if (itemToAdd) {
          // Si el item que voy a agregar existe en la orden, incremento el valor de quantity
          orderItemData = {
            productID: itemToAdd.productID,
            orderID: itemToAdd.orderID,
            productQuantity: itemToAdd.productQuantity + 1,
          };

          const updateOrderItemFetch = await updateOrderItem(
            orderItemData,
            itemToAdd.id
          );

          return res.status(200).json("Producto modificado");
        } else {
          // Si el item que voy a agregar NO existe en la orden, lo agrego con quantity 1
          orderItemData = {
            productID,
            orderID: id,
            productQuantity: 1,
          };

          const createOrdenItemInOrder = await insertOrderItem(orderItemData);

          return res.status(201).json("Producto Agregado a la orden " + id);
        }
      } else {
        // Si No existe una orden, crear la orden y agregar el item
        const data = {
          userID: userID,
          state: "PENDIENTE",
        };
        const createdOrder = await insertOrder(data);
        let orderItemData = {
          productID,
          orderID: createdOrder.id,
          productQuantity: 1,
        };
        const createOrdenItemInOrder = await insertOrderItem(orderItemData);

        res.status(201).json("Orden creada, e item agregado");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
  removeOneItemFromOrder: async (req, res) => {
    try {
      // id item
      const { itemId } = req.params;

      const item = await getOrderItemById(itemId);

      if (!item) return res.status(400).json(`El item ${itemId} no existe`);

      if (item.productQuantity > 1) {
        // Si el item en el campo quatity tiene mas de 1, actualizo la cantidad (-1)
        const updatedItem = {
          ...item,
          productQuantity: item.productQuantity - 1,
        };

        const updateItemResult = await updateOrderItem(updatedItem, itemId);

        return updateItemResult
          ? res.status(200).json("Item actualizado correctamente")
          : res.status(400).json("Hubo un problema al actualizar el item");
      }

      if (item.productQuantity === 1) {
        // Si el item en el campo quantity tiene 1, elimino el item
        const itemDeleteResult = await deleteOrderItem(itemId);
        const itemsOrder = await getOrderItemsByOrder(item.orderID);

        const orderHaveMoreItems = itemsOrder.length > 0;

        if (!orderHaveMoreItems) {
          // si la orden no tiene mas items asignados, elimino la orden
          const orderDeleteResult = await deleteOrder(item.orderID);

          return itemDeleteResult && orderDeleteResult
            ? res.status(200).json("Item y orden eliminados correctamente")
            : res
                .status(400)
                .json("Hubo un problema al eliminar el item o la orden");
        }

        return itemDeleteResult
          ? res.status(200).json("Item eliminado correctamente")
          : res.status(400).json("Hubo un problema al eliminar el item");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
  removeAllFromOrder: async (req, res) => {
    try {
      // id item
      const { itemId } = req.params;

      const item = await getOrderItemById(itemId);

      if (!item) return res.status(400).json(`El item ${itemId} no existe`);

      const productOrder = await getOrderItemsByOrder(item.orderID);

      const orderHaveMoreOfOneItem = productOrder.length > 1;

      const itemDeleteResult = await deleteOrderItem(itemId);

      if (orderHaveMoreOfOneItem) {
        // Si la orden tiene mas de 1 item, elimino el item\
        return itemDeleteResult
          ? res.status(200).json("Item eliminado correctamente")
          : res.status(400).json("Hubo un problema al querer eliminar el item");
      } else {
        // Si la orden tiene 1 item, elimino el item, elimino la orden
        const orderDeleteResult = await deleteOrder(item.orderID);
        return itemDeleteResult && orderDeleteResult
          ? res.status(200).json("Item y orden eliminados correctamente")
          : res
              .status(400)
              .json("Hubo un problema al querer eliminar el item o la orden");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
  clearOrder: async (req, res) => {
    try {
      // id orden
      const { orderID } = req.params;
      // Elimino los items de la orden
      const itemsDeleteResult = await bulkDeleteOrderItems(orderID);
      // Elimino la orden
      const orderDeleteResult = await deleteOrder(orderID);

      return itemsDeleteResult && orderDeleteResult
        ? res.status(200).json("Orden eliminada correctamente")
        : res.status(400).json("Hubo un error al eliminar la orden");
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
};