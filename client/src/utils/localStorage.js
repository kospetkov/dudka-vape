// Cart management
export const getCart = () => {
    const cart = localStorage.getItem('cart');
    return cart ? JSON.parse(cart) : [];
};

export const saveCart = (cart) => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

export const clearCart = () => {
    localStorage.removeItem('cart');
};

// Checkout form data
export const getCheckoutForm = () => {
    const form = localStorage.getItem('checkoutForm');
    return form ? JSON.parse(form) : {};
};

export const saveCheckoutForm = (formData) => {
    localStorage.setItem('checkoutForm', JSON.stringify(formData));
};

export const clearCheckoutForm = () => {
    localStorage.removeItem('checkoutForm');
};

// Auth
export const getToken = () => {
    return localStorage.getItem('token');
};

export const saveToken = (token) => {
    localStorage.setItem('token', token);
};

export const getUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const saveUser = (user) => {
    localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
};
