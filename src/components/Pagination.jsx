
const Pagination = ({ onNext, onPrev, onTurnPage, pageCount, activePage }) => {

   // Количество видимых страниц на пагинации
   const maxVisiblePages = 6;
   // Половина от максимального количества видимых страниц
   const halfMaxVisiblePages = Math.floor(maxVisiblePages / 2)

   // Начальная страница, учитывая половину видимых страниц
   const startPage = Math.max(0, activePage - halfMaxVisiblePages)
   // Конечная страница, учитывая половину видимых страниц
   const endPage = Math.min(pageCount - 1, startPage + maxVisiblePages - 1)

   // Массив для хранения видимых страниц
   let pages = []
   for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
   }

   return (
      <div className="card-footer clearfix">
         <ul className="pagination pagination-sm m-0 float-right">
            <li onClick={() => onTurnPage(0)} className="page-item"><a className="page-link" href="#">««</a></li>
            <li onClick={onPrev} className="page-item"><a className="page-link" href="#">«</a></li>
            {pages.map((page) => {
               const id = crypto.randomUUID();
               const activePageClass = activePage === page ? "page-item active" : "page-item";
               return <li key={id} onClick={() => onTurnPage(page)} className={activePageClass}><a className="page-link" href="#">{page + 1}</a></li>;
            })}
            <li onClick={onNext} className="page-item"><a className="page-link" href="#">»</a></li>
            <li onClick={() => onTurnPage(pageCount - 1)} className="page-item"><a className="page-link" href="#">»»</a></li>
         </ul>
      </div>
   );
}

export default Pagination;

