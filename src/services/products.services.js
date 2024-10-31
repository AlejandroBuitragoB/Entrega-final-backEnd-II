import  ProductsModel  from "../models/products.models.js"

export const getProductsServices = async ({limit=2, page= 1, sort, query}) =>{
    try {
        page = page==0 ? 1: page;
        page = Number(page);
        limit = Number(limit);
        const skip =(page-1) * limit;
        const sortOrderOptions = {'asc': -1, 'desc': 1}
        sort = sortOrderOptions[sort] || null;
    
        try {
            if(query)
                query = JSON.parse(decodeURIComponent(query))
        } catch (error) {
            console.log("error al parsear: ", error)
            query={}
            
        }
    
        const queryProducts = ProductsModel.find(query).limit(limit).skip(skip).lean();
        if(sort !== null)
            queryProducts.sort({price:sort});
    
        const [Products, totalDocs] = await Promise.all([queryProducts, ProductsModel.countDocuments(query)]);
    
        const totalPages = Math.ceil(totalDocs/limit);
        const hasNextPage = page < totalPages;
        const hasPrevPage = page > 1;
        const prevPage = hasPrevPage ? page -1 : null;
        const nextPage = hasNextPage ? page +1 : null;
    
        return {
            limit,
            query,
            page,
            totalDocs,
            totalPages,
            hasNextPage,
            hasPrevPage,
            prevPage,
            nextPage,
            payload: Products,
        }
    
    
    
    } catch (error) {
        console.log("getProductsServices= ", error);
 throw error;
    }
    };
    


export const getProductsByIdServices = async (pid) => {
        try {
          return await ProductsModel.findById(pid);

        } catch (error) {
          console.log("getProductsByIdServices = ", error);
          throw error;
        }
      };
      


      export const addProductServices = async ({title, description, price, img, code, stock }) => {
        try {
          return await ProductsModel.create({
            title,
            description,
            price,
            img,
            code,
            stock,
          });
        } catch (error) {
          console.log("addProductServices = ", error);
          throw error;
        }
      };


      
      export const updateProductServices = async (pid, rest) => {
        try {
          return await ProductsModel.findByIdAndUpdate(
            pid,
            { ...rest },
            { new: true }
          );

        } catch (error) {
          console.log("updateProductServices = ", error);
          throw error;
        }
      };


      
      export const deleteProductServices = async (pid) => {
        try {
          return await ProductsModel.findByIdAndDelete(pid);
        } catch (error) {
          console.log("deleteProductServices = ", error);
          throw error;
        }
      };
      