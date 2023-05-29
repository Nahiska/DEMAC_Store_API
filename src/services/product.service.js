const { Product } = require("../database/models");

const getProducts = async (limit, offset) => {
    try {
      const products = await Product.findAll({
        limit,
        offset,
        include: [
          { association: "brands" },
          { association: "subcategories", include: [{ association: "categories" }] },
        ],
      });
  
      return products;
    } catch (error) {
      console.error("Error while fetching products: ", error);
      throw new Error("Error while fetching products");
    }
  };
  
  const getTotalProductCount = async () => {
    try {
      const totalCount = await Product.count();
      return totalCount;
    } catch (error) {
      console.error("Error while getting total product count: ", error);
      throw new Error("Error while getting total product count");
    }
  };

const getProductById = async (productId) => {
    try {
          const product = await Product.findByPk(productId, {
            include: [
                { association: "brands" },
                { association: "subcategories", include: [{ association: "categories"}] },
            ],
          });
          return product;
    } catch (error) {
          console.error("Error while fetching product: ", error);
          throw new Error("Error ehile fetching product: ");
    }
};
const insertProduct = async (productData) => {
    try {
      return await Product.create(productData, {
        include: [
          { association: "brands" },
          { association: "subcategories", include: [{ association: "categories" }] },
        ],
      });
    } catch (error) {
      console.error("Error while insert product:", error);
      throw new Error("Error insert product");
    }
  };

const updateProduct = async (id, productData) => {
    try {
      return await Product.update(productData, {
        where: { id },
        include: [
          { association: "brands" },
          { association: "subcategories", include: [{ association: "categories" }] },
        ],
      });
    } catch (error) {
      console.error("Error while updating product:", error);
      throw new Error("Error updating product");
    }
};

const deleteProduct = async (id) => {
  try {
    return await Product.destroy({ where: { id }});
  } catch (error) {
    console.error("Error while deleting product:", error);
    throw new Error("Error deleting product")
  }
}

module.exports = {
    getProducts,
    getProductById,
    getTotalProductCount,
    insertProduct,
    updateProduct,
    deleteProduct
}