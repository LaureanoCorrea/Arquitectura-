class ProductRepository {
  constructor(productDao) {
    this.dao = productDao;
  }

  getProducts = async (filter = {}) => {
    const result = await this.dao.get(filter);
    return result;
  };

  getById = async (pid) => {
    try {
      console.log("PID-product-repository", pid); 
      return await this.dao.getById( pid );
    } catch (error) {
      throw new Error(`Error encontrando ID producto: ${error.message}`);
    }
  };
  

  createProduct = async (newProduct) => {
    try {
      return await this.dao.create(newProduct);
    } catch (error) {
      throw new Error(`Error creando producto: ${error.message}`);
    }
  };

  updateProduct = async (pid, productToUpdate) => {
    try {
      return await this.dao.update(pid, productToUpdate);
    } catch (error) {
      throw new Error(`Error actualizando producto: ${error.message}`);
    }
  };

  deleteProduct = async (pid) => {
    try {
      return await this.dao.delete(pid);
    } catch (error) {
      throw new Error(`Error eliminando producto: ${error.message}`);
    }
  };
}

export default ProductRepository;