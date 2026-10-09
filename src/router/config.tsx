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
const Legal = lazy(() => import('../pages/legal/page'));
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
  // Policy pages (EN + FR under /fr).
  { path: '/privacy', element: <Legal doc="privacy" /> },
  { path: '/terms', element: <Legal doc="terms" /> },
  { path: '/shipping-returns', element: <Legal doc="shipping" /> },
  { path: '/warranty', element: <Legal doc="warranty" /> },
  {
    path: '/cart',
    element: <Cart />,
  },
  {
    path: '/checkout',
    element: <Checkout />,
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
      { path: 'privacy', element: <Legal doc="privacy" /> },
      { path: 'terms', element: <Legal doc="terms" /> },
      { path: 'shipping-returns', element: <Legal doc="shipping" /> },
      { path: 'warranty', element: <Legal doc="warranty" /> },
      { path: 'cart', element: <Cart /> },
      { path: 'checkout', element: <Checkout /> },
      { path: '*', element: <NotFound /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
