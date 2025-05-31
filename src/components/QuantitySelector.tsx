import React from 'react';
import { Plus, Minus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (quantity: number) => void;
  min?: number;
  max?: number;
}

const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  onQuantityChange,
  min = 1,
  max = 10,
}) => {
  const handleDecrease = () => {
    if (quantity > min) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    if (quantity < max) {
      onQuantityChange(quantity + 1);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= min && value <= max) {
      onQuantityChange(value);
    }
  };

  return (
    <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-32">
      <button
        type="button"
        onClick={handleDecrease}
        disabled={quantity <= min}
        className="flex items-center justify-center w-8 h-8 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        aria-label="Decrease quantity"
      >
        <Minus size={16} />
      </button>
      
      <input
        type="text"
        value={quantity}
        onChange={handleInputChange}
        min={min}
        max={max}
        className="w-full text-center border-0 focus:ring-0 text-sm py-2 [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        aria-label="Quantity"
      />
      
      <button
        type="button"
        onClick={handleIncrease}
        disabled={quantity >= max}
        className="flex items-center justify-center w-8 h-8 bg-gray-50 text-gray-600 hover:bg-gray-100 disabled:opacity-50"
        aria-label="Increase quantity"
      >
        <Plus size={16} />
      </button>
    </div>
  );
};

export default QuantitySelector;