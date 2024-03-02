import { useEffect, useState } from "react"
import Pagination from "./components/Pagination"
import Products from "./components/Products"
import generateToken from "./utils/generateToken"
import axios from "axios"
import Form from "./components/Form"

// URL и лимит продуктов на странице
const URL = 'https://api.valantis.store:41000/'
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

   // Функция для получения идентификаторов продуктов с сервера
   async function fetchIds(offset) {
      try {
         const token = generateToken()
         const headers = {
            "X-Auth": `${token}`,
            "Content-Type": "application/json"
         }

         let body = {
            action: "get_ids"
         }

         if (offset === 0 || offset) {
            body.params = { offset, limit: LIMIT }
         }

         const response = await fetch(URL, {
            method: 'POST',
            headers,
            body: JSON.stringify(body)
         })

         if (!response.ok) {
            throw new Error(`Ошибка запроса "fetchIds"`)
         }

         const data = await response.json()
         return data.result
      } catch (error) {
         console.error("Ошибка при выполнении запроса fetchIds:", error)
      }
   }

   // Функция для получения продуктов по их идентификаторам
   async function fetchProducts(arrIDs) {
      try {
         const token = generateToken()
         const headers = {
            "X-Auth": `${token}`,
            "Content-Type": "application/json"
         }

         const response = await fetch(URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
               action: "get_items",
               params: { "ids": arrIDs }
            })
         })

         if (!response.ok) {
            throw new Error(`Ошибка запроса "fetchProducts"`);
         }

         const data = await response.json()
         return data.result
      } catch (error) {
         console.error("Ошибка при выполнении запроса fetchProducts:", error)
      }
   }

   // Функция для получения продуктов с учетом фильтрации
   async function getProducts(offset, filter) {
      try {
         setIsLoading(true)
         setIsError(false)
         setOffsetNum(offset)
         let products

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
         console.error("Error getting products:", error)
      }

   }

   // Функция для получения идентификаторов отфильтрованных продуктов
   async function fetchFilteredProducts({ filterKey, filterValue }) {
      try {
         const token = generateToken()
         const headers = {
            "X-Auth": `${token}`,
            "Content-Type": "application/json"
         }

         const response = await fetch(URL, {
            method: 'POST',
            headers,
            body: JSON.stringify({
               "action": "filter",
               "params": { [filterKey]: filterValue }
            })
         })

         if (!response.ok) {
            throw new Error(`Ошибка запроса "fetchFilteredProducts"`)
         }

         const data = await response.json()
         return data.result
      } catch (error) {
         console.error("Ошибка при выполнении запроса fetchFilteredProducts:", error)
      }
   }



   // Обработчики для навигации по страницам
   const nextProductsHandler = () => {
      document.getElementById('filter').classList.remove("void")
      if (activePage + 1 >= Math.ceil(productCount / LIMIT)) return
      setActivePage(prevPage => prevPage + 1)
      getProducts(offsetNum + LIMIT, existFilter)
   }

   const prevProductsHandler = () => {
      document.getElementById('filter').classList.remove("void")
      if (offsetNum === 0) return
      setActivePage(prevPage => prevPage - 1)
      getProducts(offsetNum - LIMIT, existFilter)
   }

   const turnPageHandler = (page) => {
      document.getElementById('filter').classList.remove("void")
      if (page === activePage) return
      setActivePage(page)
      if (page === 0) {
         getProducts(page, existFilter)
         return
      }
      getProducts(page * LIMIT, existFilter)
   }

   // Обработчики для отправки и сброса фильтра
   const submitHandler = (filter) => {
      setActivePage(0)
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


