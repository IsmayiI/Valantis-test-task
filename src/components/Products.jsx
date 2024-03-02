import Product from "./Product"
import Loading from "./UI/Loading"

const Products = ({ products, isLoading }) => {
   console.log(products)
   let uniqueProducts
   if (products) {
      uniqueProducts = products.reduce((acc, curObj) => {
         if (!curObj) acc.push(curObj)
         const existingObj = acc.find(obj => obj.id === curObj.id)

         if (!existingObj) {
            acc.push(curObj)
         }

         return acc;
      }, [])
   }

   let content = <table className="table table-bordered">
      <thead>
         <tr>
            <th style={{ width: '10px' }}>#</th>
            <th>Name</th>
            <th>Brand</th>
            <th style={{ width: '40px' }}>Price</th>
         </tr>
      </thead>
      <tbody>
         {uniqueProducts.map((product) => {
            return <Product key={product.id} {...product} />
         })}
      </tbody>
   </table>

   const onRefresh = () => {
      window.location.reload()
   }

   if (isLoading) {
      content = <Loading />
   }

   if (!isLoading && !uniqueProducts.length) {
      content = (
         <div className="notFound">Not Found
            <br />
            <button onClick={onRefresh} type="reset" className="btn btn-primary">
               Refresh
            </button>
         </div>
      )
   }

   return (
      <div className="card-body">
         {content}
         {/* {isLoading ? <Loading /> : <table className="table table-bordered">
            <thead>
               <tr>
                  <th style={{ width: '10px' }}>#</th>
                  <th>Name</th>
                  <th>Brand</th>
                  <th style={{ width: '40px' }}>Price</th>
               </tr>
            </thead>
            <tbody>
               {uniqueProducts.map((product) => {
                  return <Product key={product.id} {...product} />
               })}
            </tbody>
         </table>}
         {!isLoading && !products && <div style={{ display: "flex", justifyContent: "center", margin: "50px", fontSize: "20px" }}>Not Found</div>} */}
      </div>
   )
}

export default Products