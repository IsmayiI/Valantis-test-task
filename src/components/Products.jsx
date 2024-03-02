import Product from "./Product"
import Loading from "./UI/Loading"

const Products = ({ products, isLoading }) => {

   // Удаление дубликатов продуктов на основе их идентификаторов
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

   // Отображение основного контента
   let content = (
      <table className="table table-bordered">
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
   )

   // Обработчик обновления страницы
   const onRefresh = () => {
      window.location.reload()
   }

   // Проверка на загрузку данных
   if (isLoading) {
      content = <Loading />
   }

   // Проверка на отсутствие данных и вывод сообщения "Not Found"
   if (!isLoading && !uniqueProducts.length) {
      content = (
         <div className="notFound">Not Found
            <br />
            <button onClick={onRefresh} type="reset" className="btn btn-primary mt-3">
               Refresh
            </button>
         </div>
      )
   }

   return (
      <div className="card-body">
         {content}
      </div>
   )
}

export default Products