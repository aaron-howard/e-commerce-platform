import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CreditCard, MapPin, User, Phone, Mail } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import api from '../utils/api';

// Stripe configuration
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here');

const CheckoutForm = ({ onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { items, total, clearCart } = useCartStore();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      // Create payment intent
      const { data } = await api.post('/orders/create-payment-intent');
      const { clientSecret } = data;

      // Confirm payment
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (error) {
        toast.error(error.message);
        setIsProcessing(false);
      } else if (paymentIntent.status === 'succeeded') {
        // Create order
        const orderData = {
          shippingAddress: JSON.parse(localStorage.getItem('shippingAddress') || '{}'),
          billingAddress: JSON.parse(localStorage.getItem('billingAddress') || '{}'),
          paymentMethodId: paymentIntent.payment_method
        };

        await api.post('/orders/create', orderData);
        
        // Clear cart
        clearCart();
        
        toast.success('Payment successful! Order created.');
        onSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="card p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Payment Information
        </h3>
        
        <div className="border border-gray-300 rounded-lg p-4">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: '16px',
                  color: '#424770',
                  '::placeholder': {
                    color: '#aab7c4',
                  },
                },
                invalid: {
                  color: '#9e2146',
                },
              },
            }}
          />
        </div>
      </div>

      <Button
        type="submit"
        disabled={!stripe || isProcessing}
        loading={isProcessing}
        className="w-full"
        size="lg"
      >
        {isProcessing ? 'Processing...' : `Pay $${total.toFixed(2)}`}
      </Button>
    </form>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, total, itemCount, fetchCart } = useCartStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [addresses, setAddresses] = useState({
    shipping: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      zipCode: user?.zipCode || '',
      country: user?.country || 'US'
    },
    billing: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      address: user?.address || '',
      city: user?.city || '',
      state: user?.state || '',
      zipCode: user?.zipCode || '',
      country: user?.country || 'US'
    }
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch
  } = useForm({
    defaultValues: addresses.shipping
  });

  const sameAsShipping = watch('sameAsShipping');

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const onSubmit = (data) => {
    const { sameAsShipping, ...shippingAddress } = data;
    
    setAddresses(prev => ({
      ...prev,
      shipping: shippingAddress,
      billing: sameAsShipping ? shippingAddress : prev.billing
    }));

    // Save addresses to localStorage
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    localStorage.setItem('billingAddress', JSON.stringify(sameAsShipping ? shippingAddress : addresses.billing));

    setCurrentStep(2);
  };

  const handlePaymentSuccess = () => {
    navigate('/order-success');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">
            Complete your order in {currentStep === 1 ? '2' : '1'} step{currentStep === 1 ? 's' : ''}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-4 ${
              currentStep >= 2 ? 'bg-primary-600' : 'bg-gray-300'
            }`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              currentStep >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-300 text-gray-600'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm text-gray-600">Shipping Information</span>
            <span className="text-sm text-gray-600">Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {currentStep === 1 ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Shipping Address */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    Shipping Address
                  </h3>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <Input
                      label="First Name"
                      {...register('firstName', { required: 'First name is required' })}
                      error={errors.firstName?.message}
                    />
                    <Input
                      label="Last Name"
                      {...register('lastName', { required: 'Last name is required' })}
                      error={errors.lastName?.message}
                    />
                  </div>

                  <Input
                    label="Address"
                    {...register('address', { required: 'Address is required' })}
                    error={errors.address?.message}
                    className="mt-6"
                  />

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 mt-6">
                    <Input
                      label="City"
                      {...register('city', { required: 'City is required' })}
                      error={errors.city?.message}
                    />
                    <Input
                      label="State"
                      {...register('state', { required: 'State is required' })}
                      error={errors.state?.message}
                    />
                    <Input
                      label="ZIP Code"
                      {...register('zipCode', { required: 'ZIP code is required' })}
                      error={errors.zipCode?.message}
                    />
                  </div>

                  <Input
                    label="Country"
                    {...register('country', { required: 'Country is required' })}
                    error={errors.country?.message}
                    className="mt-6"
                  />
                </div>

                {/* Billing Address */}
                <div className="card p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2" />
                    Billing Address
                  </h3>

                  <div className="flex items-center mb-4">
                    <input
                      type="checkbox"
                      id="sameAsShipping"
                      {...register('sameAsShipping')}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor="sameAsShipping" className="ml-2 block text-sm text-gray-900">
                      Same as shipping address
                    </label>
                  </div>

                  {!sameAsShipping && (
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <Input
                          label="First Name"
                          {...register('billingFirstName', { 
                            required: !sameAsShipping ? 'First name is required' : false 
                          })}
                          error={errors.billingFirstName?.message}
                        />
                        <Input
                          label="Last Name"
                          {...register('billingLastName', { 
                            required: !sameAsShipping ? 'Last name is required' : false 
                          })}
                          error={errors.billingLastName?.message}
                        />
                      </div>

                      <Input
                        label="Address"
                        {...register('billingAddress', { 
                          required: !sameAsShipping ? 'Address is required' : false 
                        })}
                        error={errors.billingAddress?.message}
                      />

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <Input
                          label="City"
                          {...register('billingCity', { 
                            required: !sameAsShipping ? 'City is required' : false 
                          })}
                          error={errors.billingCity?.message}
                        />
                        <Input
                          label="State"
                          {...register('billingState', { 
                            required: !sameAsShipping ? 'State is required' : false 
                          })}
                          error={errors.billingState?.message}
                        />
                        <Input
                          label="ZIP Code"
                          {...register('billingZipCode', { 
                            required: !sameAsShipping ? 'ZIP code is required' : false 
                          })}
                          error={errors.billingZipCode?.message}
                        />
                      </div>

                      <Input
                        label="Country"
                        {...register('billingCountry', { 
                          required: !sameAsShipping ? 'Country is required' : false 
                        })}
                        error={errors.billingCountry?.message}
                      />
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full" size="lg">
                  Continue to Payment
                </Button>
              </form>
            ) : (
              <Elements stripe={stripePromise}>
                <CheckoutForm onSuccess={handlePaymentSuccess} />
              </Elements>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card p-6 sticky top-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Summary</h2>
              
              {/* Cart Items */}
              <div className="space-y-4 mb-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3">
                    <img
                      src={item.image_url || '/placeholder-product.jpg'}
                      alt={item.name}
                      className="w-12 h-12 object-cover rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {item.name}
                      </h4>
                      <p className="text-sm text-gray-500">
                        Qty: {item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-900">
                      ${item.total_price.toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-2 border-t pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium text-green-600">Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span className="font-medium">$0.00</span>
                </div>
                <div className="flex justify-between text-lg font-semibold border-t pt-2">
                  <span>Total</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
