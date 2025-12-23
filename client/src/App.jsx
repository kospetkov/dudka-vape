import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// UI Components
import Header from './components/UI/Header';
import FloatingCart from './components/UI/FloatingCart';

// Pages
import Home from './pages/Home';
import ProductPage from './pages/ProductPage';
import Account from './pages/Account';

// Admin Pages
import AdminDashboard from './pages/Admin/AdminDashboard';
import ProductManagement from './pages/Admin/ProductManagement';
import CategoryManagement from './pages/Admin/CategoryManagement';
import UserManagement from './pages/Admin/UserManagement';
import OrderManagement from './pages/Admin/OrderManagement';

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
            <Header storeName="DudkaVape" />
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
                <CartProvider>
                    <AppLayout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/product/:id" element={<ProductPage />} />
                            
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

                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </AppLayout>
                </CartProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;
