const { getCategories, getCategoryById } = require("../services/category.service");

module.exports = {
  getCategories: async (req, res) => {
    try {
      const categories = await getCategories();
      
      return res.status(200).json(categories)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;
      const category = await getCategoryById(id);
      
      return res.status(200).json(category)
    } catch (error) {
      console.error(error);
      res.status(500).json({ error });
    }
  },
};
