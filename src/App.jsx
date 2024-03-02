import { useEffect, useState } from "react"
import Pagination from "./components/Pagination"
import Products from "./components/Products"
import generateToken from "./utils/generateToken"
import axios from "axios"
import Form from "./components/Form"

const URL = 'http://api.valantis.store:40000/'
const LIMIT = 50


function App() {
   const [products, setProducts] = useState([])
   const [productCount, setProductCount] = useState(0)
   const [offsetNum, setOffsetNum] = useState(0)
   const [activePage, setActivePage] = useState(0)
   const [isError, setIsError] = useState(false)
   const [isLoading, setIsLoading] = useState(false)
   const [existFilter, setExistFilter] = useState(false)


   useEffect(() => {
      getProducts(offsetNum, existFilter)
   }, [isError])


   async function fetchIds(offset) {

      try {
         const token = generateToken();

         let response;

         if (offset === 0 || offset) {
            response = await axios({
               method: 'POST',
               url: URL,
               headers: {
                  "X-Auth": `${token}`,
                  "Content-Type": "application/json"
               },
               data: {
                  action: "get_ids",
                  params: { offset, limit: LIMIT }
               }
            })
         } else {
            response = await axios({
               method: 'POST',
               url: URL,
               headers: {
                  "X-Auth": `${token}`,
                  "Content-Type": "application/json"
               },
               data: {
                  action: "get_ids"
               }
            })
         }

         if (response.statusText !== 'OK') throw new Error('Ошибка функции запроса "fetchIds"!')

         const data = await response.data
         return data.result
      } catch (error) {
         console.error("Error fetching IDs:", error);
      }

   }

   async function fetchProducts(arrIDs) {

      try {
         const token = generateToken();

         const response = await axios({
            method: 'POST',
            url: URL,
            headers: {
               "X-Auth": `${token}`,
               "Content-Type": "application/json"
            },
            data: {
               action: "get_items",
               params: { "ids": arrIDs }
            }
         })

         if (response.statusText !== 'OK') throw new Error('Ошибка функции запроса "fetchProducts"!')

         const data = await response.data
         return data.result
      } catch (error) {
         console.error("Error fetching products:", error);
      }
   }

   async function getProducts(offset, filter) {
      try {
         setIsLoading(true)
         setIsError(false)
         setOffsetNum(offset)
         let products;

         if (filter) {
            const filteredIds = await fetchFilteredProducts(filter);
            if (!filteredIds) throw new Error('Ошибка функции запроса "fetchFilteredProducts"!')
            setProductCount(filteredIds.length)


            products = await fetchProducts(filteredIds)
            if (!products) throw new Error('Ошибка функции запроса "fetchProducts"!')
            products = products.slice(offset, offset + LIMIT)
         }
         else {
            const allIds = await fetchIds()
            if (!allIds) throw new Error('Ошибка функции запроса "fetchIds"!')

            if (allIds.length !== productCount) setProductCount(allIds.length)

            const dataIds = await fetchIds(offset)
            if (!dataIds) throw new Error('Ошибка функции запроса "fetchIds"!')

            products = await fetchProducts(dataIds)
            if (!products) throw new Error('Ошибка функции запроса "fetchProducts"!')
         }

         setProducts(products)
         setIsError(false)
         setIsLoading(false)
         return products
      } catch (error) {
         setIsError(true)
         console.error("Error getting products:", error);
      }

   }

   async function fetchFilteredProducts({ filterKey, filterValue }) {
      console.log(filterKey, filterValue)

      try {
         const token = generateToken();
         console.log(token)

         const response = await axios({
            method: 'POST',
            url: URL,
            headers: {
               "X-Auth": `${token}`,
               "Content-Type": "application/json"
            },
            data: {
               "action": "filter",
               "params": { [filterKey]: filterValue }
            }
         })
         console.log(response)
         if (response.statusText !== 'OK') throw new Error('Ошибка функции запроса "fetchFilteredProducts"!')


         const data = await response.data
         console.log(data.result)
         return data.result
      } catch (error) {
         console.error("Error fetching products:", error);
      }
   }




   const nextProductsHandler = () => {
      if (activePage + 1 >= Math.ceil(productCount / LIMIT)) return
      setActivePage(prevPage => prevPage + 1)
      getProducts(offsetNum + LIMIT, existFilter)
   }

   const prevProductsHandler = () => {
      if (offsetNum === 0) return
      setActivePage(prevPage => prevPage - 1)
      getProducts(offsetNum - LIMIT, existFilter)
   }

   const turnPageHandler = (page) => {
      if (page === activePage) return
      setActivePage(page)
      if (page === 0) {
         getProducts(page, existFilter)
         return
      }
      getProducts(page * LIMIT, existFilter)
   }

   const submitHandler = (filter) => {
      setExistFilter(filter)
      getProducts(0, filter)
   }

   const resetHandler = () => {
      setExistFilter(false)
      setActivePage(0)
      getProducts(0, false)
   }


   return (
      <div>
         <div className="card">
            <div className="card-header">
               <h3 className="card-title">Products</h3>
            </div>
            <Form
               onSubmit={submitHandler}
               onReset={resetHandler} />
            <Products
               products={products}
               isLoading={isLoading} />
            <Pagination
               pageCount={Math.ceil(productCount / LIMIT)}
               activePage={activePage}
               onNext={nextProductsHandler}
               onPrev={prevProductsHandler}
               onTurnPage={turnPageHandler} />
         </div>

      </div>
   )

}

export default App


