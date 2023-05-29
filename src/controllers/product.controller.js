const { getProducts, getTotalProductCount, getProductById, insertProduct, updateProduct, deleteProduct } = require("../services/product.service");

module.exports = {
  getProducts: async (req, res) => {
    try {

      const { page = 1, limit = 10 } = req.query;
      const offset = (page - 1) * limit;


      const products = await getProducts(limit, offset);
      const productsResponse = products.map(({ id, name, image, description, brands, subcategories }) => {
        return {
          id,
          name,
          image,
          description,
          brands,
          subcategories,
          detail: `/api/products/${id}`
        };
      });

      const getProductCountByCategory = (products) => {
        const categoryCount = {};

        for (const product of products) {
          const categoryName = product.subcategories.categories.name;

          if (categoryCount.hasOwnProperty(categoryName)) {
            categoryCount[categoryName]++;
          } else {
            categoryCount[categoryName] = 1;
          }
        }
        return categoryCount;
      }

      const totalCount = await getTotalProductCount();
      const totalPages = Math.ceil(totalCount / limit);
      const nextPage = page < totalPages ? `/api/products?page=${parseInt(page) + 1}&limit=${limit}` : null;
      const previousPage = page > 1 ? `/api/products?page=${parseInt(page) - 1}&limit=${limit}` : null;

      const RESPONSE = {
        count: products.length,
        countByCategory: getProductCountByCategory(products),
        products: productsResponse,
        totalPages,
        currentPage: parseInt(page),
        nextPage,
        previousPage
      };

      res.status(200).json(RESPONSE);
    } catch (error) {
      console.error("Error while fetching products: ", error);
      res.status(500).json({ error: "Error while fetching products" });
    }
  },
  getProductById: async (req, res) => {
    try {
      const ID_PRODUCT = req.params.id;
      const product = await getProductById(ID_PRODUCT);
      if (product) {
        return res.status(200).json(product);
      } else {
        return res.status(400).json("Product does not exist");
      }
    } catch (error) { }
  },

  createProduct: async (req, res) => {
    try {
      const result = await insertProduct({
        ...req.body,
      });

      if (result) {
        const SUCCESS_RESPONSE = "Product created successfully";
        return res.status(201).json({ msg: SUCCESS_RESPONSE });
      } else {
        const ERROR_RESPONSE = "Somethings wrong";
        return res.status(400).json({ msg: ERROR_RESPONSE });
      }
    } catch (error) {
      return res.status(500).json({ Error: error });
    }
  },
  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const productData = req.body;

      const result = await updateProduct(id, productData);

      if (result) {
        const successResponse = "Product updated successfully";
        return res.status(200).json({ msg: successResponse });
      } else {
        const errorResponse = "Something went wrong";
        return res.status(400).json({ msg: errorResponse });
      }
    } catch (error) {
      console.error("Error updating product:", error);
      return res.status(500).json({ Error: error.message });
    }
  },
  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;

      const result = await deleteProduct(id);

      if (result) {
        const successResponse = "Product deleted successfully";
        return res.status(200).json({ msg: successResponse });
      } else {
        const errorResponse = "Product not found";
        return res.status(404).json({ msg: errorResponse });
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      return res.status(500).json({ Error: error.message });
    }
  }
};
