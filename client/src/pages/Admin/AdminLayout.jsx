import { NavLink, Outlet } from 'react-router-dom';
import './admin.css';

const AdminLayout = () => {
    return (
        <div className="admin-container">
            <aside className="admin-sidebar">
                <h2 className="admin-title">Admin Panel</h2>
                <nav className="admin-nav">
                    <NavLink to="/admin" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Dashboard</NavLink>
                    <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Products</NavLink>
                    <NavLink to="/admin/categories" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Categories</NavLink>
                    <NavLink to="/admin/users" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Users</NavLink>
                    <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>Orders</NavLink>
                </nav>
            </aside>
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
};

export default AdminLayout;
