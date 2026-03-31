import { useState } from "react";
import { buildProductImage } from "../lib/productResolver";

const COLORS = ["black", "red", "beige", "blue"];

export default function ProductCard({ storeKey, product, addToCart }) {
  const [color, setColor] = useState("black");

  const image = buildProductImage(storeKey, product.id, color);

  return (
    <div className="productCard">
      <img src={image} className="productImage" />

      <h3>{product.name}</h3>

      <p>${product.price}</p>

      <div className="colorToggle">
        {COLORS.map((c) => (
          <button
            key={c}
            className={color === c ? "active" : ""}
            onClick={() => setColor(c)}
          >
            {c}
          </button>
        ))}
      </div>

      <button className="addCart" onClick={() => addToCart(product, color)}>
        Add to Cart
      </button>
    </div>
  );
}
