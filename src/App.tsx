import React, { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';

// Lazily load top-level page components from src/app
const HomePage = React.lazy(() => import('./app/page'));
const AboutPage = React.lazy(() => import('./app/about/page'));
const ContactPage = React.lazy(() => import('./app/contact/page'));
const PortfolioPage = React.lazy(() => import('./app/portfolio/page'));
const PricingPage = React.lazy(() => import('./app/pricing/page'));
const ServicesPage = React.lazy(() => import('./app/services/page'));
const BlogPage = React.lazy(() => import('./app/blog/page'));
const GalleryPage = React.lazy(() => import('./app/gallery/page'));

// Admin Dashboard Pages
const AdminDashboardPage = React.lazy(() => import('./app/admin/page'));
const AdminProjectsPage = React.lazy(() => import('./app/admin/projects/page'));
const AdminServicesPage = React.lazy(() => import('./app/admin/services/page'));
const AdminPricingPage = React.lazy(() => import('./app/admin/pricing/page'));
const AdminTestimonialsPage = React.lazy(() => import('./app/admin/testimonials/page'));
const AdminInquiriesPage = React.lazy(() => import('./app/admin/inquiries/page'));
const AdminBlogPage = React.lazy(() => import('./app/admin/blog/page'));
const AdminContentPage = React.lazy(() => import('./app/admin/content/page'));
const AdminSecurityPage = React.lazy(() => import('./app/admin/security/page'));

// Account Pages
const SignInPage = React.lazy(() => import('./app/account/signin/page'));
const ForgotPasswordPage = React.lazy(() => import('./app/account/forgot-password/page'));
const ResetPasswordPage = React.lazy(() => import('./app/account/reset-password/page'));
const LogoutPage = React.lazy(() => import('./app/account/logout/page'));

// Simple loading fallback
const LoadingFallback = () => (
  <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-medium">Loading Nurses Alliance Network...</p>
    </div>
  </div>
);

export default function App() {
  return (
    <>
      <Toaster position="bottom-right" theme="dark" />
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/blog/*" element={<BlogPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          
          <Route path="/admin" element={<AdminDashboardPage />} />
          <Route path="/admin/projects" element={<AdminProjectsPage />} />
          <Route path="/admin/services" element={<AdminServicesPage />} />
          <Route path="/admin/pricing" element={<AdminPricingPage />} />
          <Route path="/admin/testimonials" element={<AdminTestimonialsPage />} />
          <Route path="/admin/inquiries" element={<AdminInquiriesPage />} />
          <Route path="/admin/blog" element={<AdminBlogPage />} />
          <Route path="/admin/content" element={<AdminContentPage />} />
          <Route path="/admin/security" element={<AdminSecurityPage />} />
          
          <Route path="/account/signin" element={<SignInPage />} />
          <Route path="/account/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/account/reset-password" element={<ResetPasswordPage />} />
          <Route path="/account/logout" element={<LogoutPage />} />
        </Routes>
      </Suspense>
    </>
  );
}
