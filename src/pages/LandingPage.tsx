import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Share2, Star } from 'lucide-react';
import { toast } from 'react-toastify';
import {productApi} from '../api/product'
import { useCart } from '../context/CartContext';
import Button from '../components/ui/Button';
import Header from '../components/Header';
import ProductVariantSelector from '../components/ProductVariantSelector';
import QuantitySelector from '../components/QuantitySelector';
import { formatCurrency } from '../lib/utils';
import { Product, ProductVariant } from '../types';
import Spinner from '../components/ui/Spinner';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await productApi.getProducts();
        if (response.success && response.data && response.data.length > 0) {
          setProduct(response.data[0]);
          setSelectedVariant(response.data[0].variants[0]);
        } else {
          setError('No products available');
        }
      } catch (error) {
        setError('Failed to load products');
        console.error('Error fetching products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBuyNow = () => {
    if (!product || !selectedVariant) return;

    setIsAddingToCart(true);
    
    try {
      addToCart(product, selectedVariant, quantity);
      toast.success('Added to cart successfully!');
      navigate('/checkout');
    } catch (error) {
      toast.error('Failed to add item to cart');
      console.error('Add to cart error:', error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !product || !selectedVariant) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Product not found'}</p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-100 rounded-lg overflow-hidden relative group">
            <img 
              src={selectedVariant.image} 
              alt={product.title}
              className="w-full h-auto object-cover transform transition-transform duration-300 group-hover:scale-105"
              style={{ maxHeight: '600px' }}
            />
            <div className="absolute top-4 right-4 flex flex-col space-y-2">
              <button 
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Add to favorites"
              >
                <Heart className="h-5 w-5 text-gray-600" />
              </button>
              <button 
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                aria-label="Share product"
              >
                <Share2 className="h-5 w-5 text-gray-600" />
              </button>
            </div>
          </div>
          
          {/* Product Details */}
          <div className="flex flex-col">
            <div className="flex justify-between items-start">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">{product.title}</h1>
              <div className="flex items-center bg-blue-50 px-2 py-1 rounded">
                <Star className="h-4 w-4 text-yellow-500 fill-current" />
                <span className="ml-1 text-sm font-medium">4.9</span>
              </div>
            </div>
            
            <div className="mt-2">
              <p className="text-2xl font-semibold text-gray-900">
                {formatCurrency(selectedVariant.price)}
              </p>
              <p className="text-sm text-green-600 mt-1">In stock</p>
            </div>
            
            <div className="my-6">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>
            
            <div className="space-y-6">
              {/* Variant Selector */}
              <ProductVariantSelector
                variants={product.variants}
                selectedVariant={selectedVariant}
                onSelectVariant={setSelectedVariant}
              />
              
              {/* Quantity Selector */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Quantity</h3>
                <QuantitySelector
                  quantity={quantity}
                  onQuantityChange={setQuantity}
                  max={product.inventory}
                />
              </div>
              
              {/* Add to Cart Button */}
              <div className="mt-8">
                <Button
                  onClick={handleBuyNow}
                  isLoading={isAddingToCart}
                  fullWidth
                  size="lg"
                  className="group"
                >
                  <span className="group-hover:translate-x-1 transition-transform">
                    Buy Now
                  </span>
                </Button>
              </div>
              
              {/* Additional Information */}
              <div className="mt-6 border-t border-gray-200 pt-6 text-sm text-gray-500">
                <div className="flex items-center mb-2">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p>Free shipping on orders over $100</p>
                </div>
                <div className="flex items-center">
                  <svg
                    className="h-5 w-5 text-green-500 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <p>30-day money-back guarantee</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;