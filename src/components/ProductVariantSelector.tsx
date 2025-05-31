import React from 'react';
import { cn } from '../lib/utils';
import { ProductVariant } from '../types';

interface ProductVariantSelectorProps {
  variants: ProductVariant[];
  selectedVariant: ProductVariant;
  onSelectVariant: (variant: ProductVariant) => void;
}

const ProductVariantSelector: React.FC<ProductVariantSelectorProps> = ({
  variants,
  selectedVariant,
  onSelectVariant,
}) => {
  const hasColors = variants.some(v => v.color);
  const hasSizes = variants.some(v => v.size);

  return (
    <div className="mb-6">
      <h3 className="text-sm font-medium text-gray-700 mb-2">
        {hasColors ? 'Color' : hasSizes ? 'Size' : 'Variant'}
      </h3>
      
      <div className="flex flex-wrap gap-2">
        {variants.map((variant) => (
          <button
            key={variant.id}
            type="button"
            onClick={() => onSelectVariant(variant)}
            className={cn(
              "group relative min-w-[3rem] h-10 px-2 rounded-md flex items-center justify-center transition-all duration-200 overflow-hidden",
              selectedVariant.id === variant.id 
                ? "ring-2 ring-blue-600 ring-offset-1" 
                : "border border-gray-300 hover:border-gray-400",
              hasColors && variant.color ? "p-1" : "p-2 text-sm font-medium"
            )}
            aria-label={variant.name}
          >
            {hasColors && variant.color ? (
              <>
                <span 
                  className="w-full h-full rounded block" 
                  style={{ backgroundColor: variant.color }}
                ></span>
                <span className={cn(
                  "absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30",
                  selectedVariant.id === variant.id ? "opacity-100" : ""
                )}>
                  <span className="text-white text-xs font-medium">
                    {variant.name}
                  </span>
                </span>
              </>
            ) : hasSizes && variant.size ? (
              variant.size
            ) : (
              variant.name
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default ProductVariantSelector;