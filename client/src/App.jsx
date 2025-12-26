import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// UI Components
import Header from './components/UI/Header';
import FloatingCart from './components/UI/FloatingCart';

// Pages
import Home from './pages/Home';
import Catalog from './pages/Catalog';
import ProductPage from './pages/ProductPage';
import Account from './pages/Account';
import Wishlist from './pages/Wishlist';
import About from './pages/About';
import Contact from './pages/Contact';

// Legal Pages
import { PrivacyPolicy, TermsOfService, PublicOffer } from './pages/Legal';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProductManagement from './pages/Admin/ProductManagement';
import CategoryManagement from './pages/Admin/CategoryManagement';
import UserManagement from './pages/Admin/UserManagement';
import OrderManagement from './pages/Admin/OrderManagement';
import StoreSettings from './pages/Admin/StoreSettings';
import ContactMessages from './pages/Admin/ContactMessages';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { isAuthenticated, isAdmin } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    if (adminOnly && !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

// Layout Component
const AppLayout = ({ children }) => {
    const handleCheckout = () => {
        console.log('Checkout clicked');
    };

    return (
        <div className="app">
            <Header storeName="DUDKA" logoUrl="/logo.png" />
            <main className="main-content">
                {children}
            </main>
            <FloatingCart onCheckout={handleCheckout} />
        </div>
    );
};

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <WishlistProvider>
                    <CartProvider>
                        <AppLayout>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/catalog" element={<Catalog />} />
                                <Route path="/product/:id" element={<ProductPage />} />

                                {/* Legal Pages */}
                                <Route path="/privacy" element={<PrivacyPolicy />} />
                                <Route path="/terms" element={<TermsOfService />} />
                                <Route path="/offer" element={<PublicOffer />} />
                                <Route path="/wishlist" element={<Wishlist />} />
                                <Route path="/about" element={<About />} />
                                <Route path="/contact" element={<Contact />} />

                                <Route
                                    path="/account"
                                    element={
                                        <ProtectedRoute>
                                            <Account />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route
                                    path="/admin"
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <AdminDashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/products"
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <ProductManagement />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/categories"
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <CategoryManagement />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/users"
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <UserManagement />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/orders"
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <OrderManagement />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/settings"
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <StoreSettings />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/admin/messages"
                                    element={
                                        <ProtectedRoute adminOnly>
                                            <ContactMessages />
                                        </ProtectedRoute>
                                    }
                                />

                                <Route path="*" element={<Navigate to="/" replace />} />
                            </Routes>
                        </AppLayout>
                    </CartProvider>
                </WishlistProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;