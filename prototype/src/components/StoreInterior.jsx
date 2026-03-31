import { Html } from "@react-three/drei";
import { STORE_PRODUCTS } from "../data/storeProducts";
import ProductCard from "./ProductCard";

export default function StoreInterior({ storeKey, onExit, addToCart }) {
  const products = STORE_PRODUCTS[storeKey] || [];

  return (
    <Html center>
      <div className="storeInterior">
        <h2>{storeKey.toUpperCase()}</h2>

        <div className="storeGrid">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              storeKey={storeKey}
              product={p}
              addToCart={addToCart}
            />
          ))}
        </div>

        <button className="exitStore" onClick={onExit}>
          Exit Store
        </button>
      </div>
    </Html>
  );
}
