import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import About from "./pages/About";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Portfolio from "./pages/Portfolio";
import EmailList from "./pages/EmailList";
import Training from "./pages/Training";
import Resources from "./pages/Resources";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminPosts from "./pages/admin/AdminPosts";
import AdminPostNew from "./pages/admin/AdminPostNew";
import AdminPostEdit from "./pages/admin/AdminPostEdit";
import AdminPortfolio from "./pages/admin/AdminPortfolio";
import AdminPortfolioNew from "./pages/admin/AdminPortfolioNew";
import AdminPortfolioEdit from "./pages/admin/AdminPortfolioEdit";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import AdminSubscribers from "./pages/admin/AdminSubscribers";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <AdminAuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <ScrollToTop />
              <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:slug" element={<BlogPost />} />
              <Route path="/folio" element={<Navigate to="/portfolio" replace />} />
              <Route path="/portfolio" element={<Portfolio />} />
              <Route path="/email-list" element={<EmailList />} />
              <Route path="/training" element={<Training />} />
              <Route path="/resources" element={<Resources />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/posts" element={<AdminPosts />} />
              <Route path="/admin/posts/new" element={<AdminPostNew />} />
              <Route path="/admin/posts/edit/:id" element={<AdminPostEdit />} />
              <Route path="/admin/portfolio" element={<AdminPortfolio />} />
              <Route path="/admin/portfolio/new" element={<AdminPortfolioNew />} />
              <Route path="/admin/portfolio/edit/:id" element={<AdminPortfolioEdit />} />
              <Route path="/admin/subscribers" element={<AdminSubscribers />} />
              <Route path="/admin/analytics" element={<AdminAnalytics />} />
              
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AdminAuthProvider>
    </ThemeProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
