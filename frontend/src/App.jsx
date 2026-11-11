import './App.css'
import { Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/user/Home.jsx'
import Wrapper from './pages/Wrapper'
import Profile from './pages/user/Profile.jsx'
import Login from './auth/user/login.jsx'
import Register from './auth/user/register.jsx'
import AuthWrapper from './auth/user/authWrapper.jsx'
import ForgotPassword from './auth/user/forgotPass.jsx'
import CreateNewPass from './auth/user/create-new-password.jsx'
import toast, { Toaster } from 'react-hot-toast'

import AdminLayout from './layouts/AdminLayout.jsx'
import AdminProtectedRoute from './routes/AdminRoute.jsx';
import AdminGuestRoute from './routes/AdminGuestRoute.jsx';

// admin
import Dashboard from './pages/admin/Dashboard.jsx'
import ProductsList from './pages/admin/ProductsList.jsx'
import AddProduct from './pages/admin/AddProduct.jsx'
import Setting from './pages/admin/Setting.jsx'
import AdminLogin from './auth/admin/login.jsx'
import ResetPassword from './auth/admin/reset.password.jsx'
import ForgotAdminPassword from './auth/admin/forgot.password.jsx'
import ActivityLogs from './pages/admin/ActivitiesLog.jsx'
import ProtectedRoute from './routes/PrivateRoute.jsx'
import AuthRoute from './routes/authRoute.jsx'
import Users from './pages/admin/Users.jsx'
import ProductCheckout from './pages/user/ProductCheckout.jsx'
import ScrollToTop from './ScrollToTop.jsx'
import { useEffect, useState } from 'react'
import { useUserAuth } from './context/user.authContext.jsx'
import { useCart } from './context/CartContext.jsx'
import OrdersList from './pages/user/Orders.jsx'
import TrackOrder from './pages/user/TrackOrder.jsx'
import DiscoverProducts from './pages/user/DicoverProducts.jsx'
import Cart from './pages/user/Cart.jsx'
import SearchPage from './pages/user/Search.jsx'
import OrdersAdmin from './pages/admin/Orders.jsx'
import CompleteOrder from './pages/admin/CompleteOrder.jsx'
import Notifications from './pages/admin/Nofications.jsx'
import UserPageNotFound from './pages/user/UserPageNotFound.jsx'
import AdminPageNotFound from './pages/admin/AdminPageNotFound.jsx'
import AdminAdvertisement from './pages/admin/Advertisement.jsx'


function App() {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const { user } = useUserAuth();
  const { updateCart } = useCart();


  useEffect(() => {
    
    function handleOffline() {
      if (!isOffline) {
        toast.error("You are offline!");
        setIsOffline(true);
      }
    }

    function handleOnline() {
      if (isOffline) {
        toast.success("Back online");
        setIsOffline(false);
      }
    }

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [isOffline]);

  useEffect(() => {
    if(user && user.cart)
      updateCart(user?.cart);
  },[user])

  return (
    <>
      <ScrollToTop />
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        <Route path="/" element={<Wrapper />}>
          <Route index element={<Home />} />
          <Route path="discover/:cId" element={<DiscoverProducts />} />
          <Route path="search" element={<SearchPage />} />
          <Route path="checkout/:slugAndId" element={<ProductCheckout />} />

          {/* <Route path="public-page" element={<SomePublicPage />} /> */}

          <Route element={<ProtectedRoute />}>
            <Route path="profile" element={<Profile />} />
            <Route path="my-orders" element={<OrdersList />} />
            <Route path="track-order/:trackId" element={<TrackOrder />} />
            <Route path="cart" element={<Cart />} />
          </Route>

        </Route>

        <Route element={<AuthRoute />}>
          <Route path="/auth" element={<AuthWrapper />}>
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<CreateNewPass />} />
          </Route>
        </Route>

        {/* admin */}
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin/dashboard" element={
          <AdminProtectedRoute>
            <AdminLayout />
          </AdminProtectedRoute>
        }>
          <Route index element={<Dashboard />} />
          <Route path="products" element={<ProductsList />} />
          <Route path="add-products" element={<AddProduct />} />
          <Route path="setting" element={<Setting />} />
          <Route path="activity-logs" element={<ActivityLogs />} />
          <Route path="users" element={<Users />} />
          <Route path="orders" element={<OrdersAdmin />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="add-advertisement" element={<AdminAdvertisement />} />
          <Route path="complete-order/:trackId" element={<CompleteOrder />} />
          <Route path="*" element={<AdminPageNotFound />} />
        </Route>

        <Route
          path="/admin/login"
          element={
            <AdminGuestRoute>
              <AdminLogin />
            </AdminGuestRoute>
          }
        />

        <Route
          path="/admin/forgot-password"
          element={
            <AdminGuestRoute>
              <ForgotAdminPassword />
            </AdminGuestRoute>
          }
        />

        <Route
          path="/admin/reset-password"
          element={
            <AdminGuestRoute>
              <ResetPassword />
            </AdminGuestRoute>
          }
        />

        <Route path="*" element={<UserPageNotFound />} />


      </Routes>
    </>
  )
}

export default App
