const { getProducts, getProductById } = require("../services/product.service");

module.exports = {
    getProducts: async (req, res) => {
        try {
            const products = await getProducts();
            const productsResponse = products.map(
                ({ id, name, image, description, brands, subcategories }) => {
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

                if(categoryCount.hasOwnProperty(categoryName)) {
                    categoryCount[categoryName]++;
                } else {
                    categoryCount[categoryName] = 1;
                }
            }
            return categoryCount;
        }

        const RESPONSE = {
        count: products.length,
        countByCategory: getProductCountByCategory(products),
        products: productsResponse,
      }

      return res.status(200).json(RESPONSE);
    } catch (error) {}
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
    } catch (error) {}
},
    createProduct: async (req, res) => {},
    updateProduct: async (req, res) => {},
    deleteProduct: async (req, res) => {},
  };
  