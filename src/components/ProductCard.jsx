import { useCart } from "../context/CartContext";

function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="border p-4 rounded-lg">
      <img src={product.image} alt={product.title} className="h-32 mx-auto" />
      <h2>{product.title}</h2>
      <p>${product.price}</p>
      <button
        onClick={() => addToCart(product)}
        className="bg-blue-500 text-white px-3 py-1 rounded"
      >
        Agregar al carrito
      </button>
    </div>
  );
}

export default ProductCard;
