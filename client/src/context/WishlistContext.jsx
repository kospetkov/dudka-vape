import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
};

const WISHLIST_KEY = 'dudka_wishlist';
const WISHLIST_PRODUCTS_KEY = 'dudka_wishlist_products';

export const WishlistProvider = ({ children }) => {
    const { isAuthenticated, user } = useAuth();
    const [wishlist, setWishlist] = useState([]); // Full product objects
    const [wishlistIds, setWishlistIds] = useState(new Set());
    const [loading, setLoading] = useState(true);

    // Load from localStorage
    const loadFromStorage = useCallback(() => {
        try {
            const savedIds = localStorage.getItem(WISHLIST_KEY);
            const savedProducts = localStorage.getItem(WISHLIST_PRODUCTS_KEY);
            
            if (savedIds) {
                setWishlistIds(new Set(JSON.parse(savedIds)));
            }
            if (savedProducts) {
                setWishlist(JSON.parse(savedProducts));
            }
        } catch (error) {
            console.error('Failed to load wishlist:', error);
        }
    }, []);

    // Save to localStorage
    const saveToStorage = useCallback((ids, products) => {
        try {
            localStorage.setItem(WISHLIST_KEY, JSON.stringify([...ids]));
            localStorage.setItem(WISHLIST_PRODUCTS_KEY, JSON.stringify(products));
        } catch (error) {
            console.error('Failed to save wishlist:', error);
        }
    }, []);

    // Initial load
    useEffect(() => {
        loadFromStorage();
        setLoading(false);
    }, [loadFromStorage]);

    // Check if product is in wishlist
    const isInWishlist = useCallback((productId) => {
        if (!productId) return false;
        return wishlistIds.has(productId);
    }, [wishlistIds]);

    // Toggle wishlist
    const toggleWishlist = useCallback((product) => {
        if (!product || !product._id) return false;

        const productId = product._id;
        const wasInWishlist = wishlistIds.has(productId);

        let newIds;
        let newProducts;

        if (wasInWishlist) {
            // Remove
            newIds = new Set(wishlistIds);
            newIds.delete(productId);
            newProducts = wishlist.filter(p => p._id !== productId);
        } else {
            // Add
            newIds = new Set(wishlistIds);
            newIds.add(productId);
            newProducts = [...wishlist, product];
        }

        setWishlistIds(newIds);
        setWishlist(newProducts);
        saveToStorage(newIds, newProducts);

        // Sync with server if authenticated
        if (isAuthenticated) {
            api.post(`/wishlist/toggle/${productId}`).catch(console.error);
        }

        return !wasInWishlist;
    }, [wishlistIds, wishlist, isAuthenticated, saveToStorage]);

    // Add to wishlist
    const addToWishlist = useCallback((product) => {
        if (!product || !product._id || wishlistIds.has(product._id)) return;

        const newIds = new Set(wishlistIds);
        newIds.add(product._id);
        const newProducts = [...wishlist, product];

        setWishlistIds(newIds);
        setWishlist(newProducts);
        saveToStorage(newIds, newProducts);

        if (isAuthenticated) {
            api.post(`/wishlist/add/${product._id}`).catch(console.error);
        }
    }, [wishlistIds, wishlist, isAuthenticated, saveToStorage]);

    // Remove from wishlist
    const removeFromWishlist = useCallback((productId) => {
        if (!productId || !wishlistIds.has(productId)) return;

        const newIds = new Set(wishlistIds);
        newIds.delete(productId);
        const newProducts = wishlist.filter(p => p._id !== productId);

        setWishlistIds(newIds);
        setWishlist(newProducts);
        saveToStorage(newIds, newProducts);

        if (isAuthenticated) {
            api.delete(`/wishlist/remove/${productId}`).catch(console.error);
        }
    }, [wishlistIds, wishlist, isAuthenticated, saveToStorage]);

    // Clear wishlist
    const clearWishlist = useCallback(() => {
        setWishlist([]);
        setWishlistIds(new Set());
        localStorage.removeItem(WISHLIST_KEY);
        localStorage.removeItem(WISHLIST_PRODUCTS_KEY);
    }, []);

    const value = {
        wishlist,
        wishlistCount: wishlist.length,
        loading,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist
    };

    return (
        <WishlistContext.Provider value={value}>
            {children}
        </WishlistContext.Provider>
    );
};

export default WishlistContext;
