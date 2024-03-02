import { useState } from 'react'

const Form = ({ onSubmit, onReset }) => {
   const [filterType, setFilterType] = useState('product')
   const [inputText, setInputText] = useState('')

   // Обработчик изменения типа фильтрации
   const handleFilterChange = (e) => {
      setFilterType(e.target.value)
   }

   // Обработчик изменения ввода текста
   const handleInputChange = (e) => {
      setInputText(e.target.value)
   }

   // Обработчик отправки формы
   const handleSubmit = (e) => {
      e.preventDefault()

      if (!inputText.length) {
         document.getElementById('filter').classList.add("void")
         return
      }

      document.getElementById('filter').classList.remove("void")

      const filter = {
         filterKey: filterType,
         filterValue: filterType === 'price' ? +inputText : inputText
      }

      onSubmit(filter)
   }

   // Обработчик сброса формы
   const handleReset = (e) => {
      document.getElementById('filter').classList.remove("void")
      setInputText('')
      setFilterType('product')

      onReset()
   }

   return (
      <form className="m-3" onReset={handleReset} onSubmit={handleSubmit}>
         <div className="form-check">
            <input
               className="form-check-input"
               type="radio"
               name="flexRadioDefault"
               id="flexRadioDefault1"
               value="product"
               checked={filterType === 'product'}
               onChange={handleFilterChange}
            />
            <label className="form-check-label" htmlFor="flexRadioDefault1">
               Name
            </label>
         </div>
         <div className="form-check">
            <input
               className="form-check-input"
               type="radio"
               name="flexRadioDefault"
               id="flexRadioDefault2"
               value="brand"
               checked={filterType === 'brand'}
               onChange={handleFilterChange}
            />
            <label className="form-check-label" htmlFor="flexRadioDefault2">
               Brand
            </label>
         </div>
         <div className="form-check">
            <input
               className="form-check-input"
               type="radio"
               name="flexRadioDefault"
               id="flexRadioDefault3"
               value="price"
               checked={filterType === 'price'}
               onChange={handleFilterChange}
            />
            <label className="form-check-label" htmlFor="flexRadioDefault3">
               Price
            </label>
         </div>
         <div className="m-3">
            <label htmlFor="filter" className="form-label">
               Filter
            </label>
            <input
               placeholder={`Search by ${filterType === 'product' ? 'name' : filterType}`}
               type="inputText"
               value={inputText}
               className="form-control"
               id="filter"
               aria-describedby="filterHelp"
               onChange={handleInputChange}
            />
         </div>
         <button type="submit" className="btn btn-primary m-3">
            Filter
         </button>
         <button type="reset" className="btn btn-primary">
            Reset
         </button>
      </form>
   )
}

export default Form
