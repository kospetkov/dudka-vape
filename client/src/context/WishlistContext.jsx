import { createContext, useContext, useState, useEffect } from 'react';

const WishlistContext = createContext();

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (!context) {
        throw new Error('useWishlist must be used within WishlistProvider');
    }
    return context;
};

export const WishlistProvider = ({ children }) => {
    const [wishlist, setWishlist] = useState(() => {
        const saved = localStorage.getItem('wishlist');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
    }, [wishlist]);

    const isInWishlist = (productId) => {
        return wishlist.includes(productId);
    };

    const toggleWishlist = (productId) => {
        setWishlist(prev => 
            prev.includes(productId)
                ? prev.filter(id => id !== productId)
                : [...prev, productId]
        );
    };

    const addToWishlist = (productId) => {
        if (!wishlist.includes(productId)) {
            setWishlist(prev => [...prev, productId]);
        }
    };

    const removeFromWishlist = (productId) => {
        setWishlist(prev => prev.filter(id => id !== productId));
    };

    const clearWishlist = () => {
        setWishlist([]);
    };

    const value = {
        wishlist,
        isInWishlist,
        toggleWishlist,
        addToWishlist,
        removeFromWishlist,
        clearWishlist,
        wishlistCount: wishlist.length
    };

    return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
