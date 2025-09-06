import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../utils/api';
import toast from 'react-hot-toast';

const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      total: 0,
      itemCount: 0,
      isLoading: false,

      // Actions
      setLoading: (isLoading) => set({ isLoading }),

      fetchCart: async () => {
        const { token } = useAuthStore.getState();
        if (!token) return;

        set({ isLoading: true });
        try {
          const response = await api.get('/cart');
          set({ 
            items: response.data.items,
            total: response.data.total,
            itemCount: response.data.itemCount,
            isLoading: false 
          });
        } catch (error) {
          console.error('Fetch cart error:', error);
          set({ isLoading: false });
        }
      },

      addToCart: async (productId, quantity = 1) => {
        set({ isLoading: true });
        try {
          await api.post('/cart/add', { productId, quantity });
          await get().fetchCart();
          toast.success('Item added to cart');
        } catch (error) {
          console.error('Add to cart error:', error);
          toast.error(error.response?.data?.message || 'Failed to add item to cart');
        } finally {
          set({ isLoading: false });
        }
      },

      updateQuantity: async (productId, quantity) => {
        set({ isLoading: true });
        try {
          await api.put('/cart/update', { productId, quantity });
          await get().fetchCart();
          if (quantity === 0) {
            toast.success('Item removed from cart');
          } else {
            toast.success('Cart updated');
          }
        } catch (error) {
          console.error('Update cart error:', error);
          toast.error(error.response?.data?.message || 'Failed to update cart');
        } finally {
          set({ isLoading: false });
        }
      },

      removeFromCart: async (productId) => {
        set({ isLoading: true });
        try {
          await api.delete(`/cart/remove/${productId}`);
          await get().fetchCart();
          toast.success('Item removed from cart');
        } catch (error) {
          console.error('Remove from cart error:', error);
          toast.error(error.response?.data?.message || 'Failed to remove item from cart');
        } finally {
          set({ isLoading: false });
        }
      },

      clearCart: async () => {
        set({ isLoading: true });
        try {
          await api.delete('/cart/clear');
          set({ items: [], total: 0, itemCount: 0 });
          toast.success('Cart cleared');
        } catch (error) {
          console.error('Clear cart error:', error);
          toast.error('Failed to clear cart');
        } finally {
          set({ isLoading: false });
        }
      },

      // Helper functions
      getItemQuantity: (productId) => {
        const item = get().items.find(item => item.product_id === productId);
        return item ? item.quantity : 0;
      },

      isInCart: (productId) => {
        return get().items.some(item => item.product_id === productId);
      }
    }),
    {
      name: 'cart-storage',
      partialize: (state) => ({ 
        items: state.items,
        total: state.total,
        itemCount: state.itemCount
      }),
    }
  )
);

export { useCartStore };
