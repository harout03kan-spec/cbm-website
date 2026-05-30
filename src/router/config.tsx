import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

const Home = lazy(() => import('../pages/home/page'));
const Shop = lazy(() => import('../pages/shop/page'));
const Product = lazy(() => import('../pages/product/page'));
const Hosting = lazy(() => import('../pages/hosting/page'));
const Services = lazy(() => import('../pages/services/page'));
const About = lazy(() => import('../pages/about/page'));
const Cart = lazy(() => import('../pages/cart/page'));
const Checkout = lazy(() => import('../pages/checkout/page'));
const OrderSuccess = lazy(() => import('../pages/order-success/page'));
const NotFound = lazy(() => import('../pages/NotFound'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/shop',
    element: <Shop />,
  },
  {
    path: '/product',
    element: <Product />,
  },
  {
    path: '/hosting',
    element: <Hosting />,
  },
  {
    path: '/services',
    element: <Services />,
  },
  {
    path: '/about',
    element: <About />,
  },
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '/checkout',
    element: <Checkout />,
  },
  {
    path: '/order-success',
    element: <OrderSuccess />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
