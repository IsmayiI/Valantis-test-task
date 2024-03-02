
const Product = ({ brand, id, price, product }) => {
   return (
      <tr>
         <td>{id}</td>
         <td>{product || 'Unknown'}</td>
         <td>{brand || 'Unknown'}</td>
         <td>{price || 'Unknown'}</td>
      </tr>
   )
}

export default Product