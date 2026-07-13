import { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import FrenchLayout from './FrenchLayout';

const Home = lazy(() => import('../pages/home/page'));
const Shop = lazy(() => import('../pages/shop/page'));
const BulkDeals = lazy(() => import('../pages/bulk-deals/page'));
const Product = lazy(() => import('../pages/product/page'));
const Hosting = lazy(() => import('../pages/hosting/page'));
const Services = lazy(() => import('../pages/services/page'));
const About = lazy(() => import('../pages/about/page'));
const Contact = lazy(() => import('../pages/contact/page'));
const Cart = lazy(() => import('../pages/cart/page'));
const Checkout = lazy(() => import('../pages/checkout/page'));
const OrderSuccess = lazy(() => import('../pages/order-success/page'));
const Crm = lazy(() => import('../pages/crm/page'));
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
    path: '/bulk-deals',
    element: <BulkDeals />,
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
    path: '/contact',
    element: <Contact />,
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
    path: '/crm',
    element: <Crm />,
  },
  // Former internal Ecwid test routes — removed from the production site. Redirect
  // any old preview link / bookmark to the real shop so it never 404s. (A Netlify
  // edge redirect in netlify.toml / _redirects handles a hard load before the app
  // boots; this handles in-app navigation.)
  {
    path: '/store-test',
    element: <Navigate to="/shop" replace />,
  },
  {
    path: '/store-test-cart',
    element: <Navigate to="/shop" replace />,
  },
  // Localized French URLs. Same pages, French locale. Keeps English routes intact.
  {
    path: '/fr',
    element: <FrenchLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'shop', element: <Shop /> },
      { path: 'bulk-deals', element: <BulkDeals /> },
      { path: 'product', element: <Product /> },
      { path: 'hosting', element: <Hosting /> },
      { path: 'services', element: <Services /> },
      { path: 'about', element: <About /> },
      { path: 'contact', element: <Contact /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
