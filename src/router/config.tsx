import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';
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
// Hidden internal PoC route — Ecwid storefront embed. Not in nav or sitemap.
const StoreTest = lazy(() => import('../pages/store-test/page'));
// Hidden internal PoC route — Ecwid cart/checkout handoff via JS API. Not in nav or sitemap.
const StoreTestCart = lazy(() => import('../pages/store-test-cart/page'));
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
  // Hidden internal PoC — Ecwid storefront test. Not linked in nav; noindex; not in sitemap.
  {
    path: '/store-test',
    element: <StoreTest />,
  },
  // Hidden internal PoC — Ecwid cart/checkout handoff test. Not linked in nav; noindex; not in sitemap.
  {
    path: '/store-test-cart',
    element: <StoreTestCart />,
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
