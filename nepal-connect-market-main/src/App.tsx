import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Browse from "./pages/Browse";
import AdDetail from "./pages/AdDetail";
import PostAd from "./pages/PostAd";
import Chat from "./pages/Chat";
import Dashboard from "./pages/Dashboard";
import AdminPanel from "./pages/AdminPanel";
import About from "./pages/About";
import SafetyTips from "./pages/SafetyTips";
import PostingRules from "./pages/PostingRules";
import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const noFooter = ['/chat', '/admin'].includes(location.pathname);
  return (
    <>
      <Navbar />
      <main>{children}</main>
      {!noFooter && <Footer />}
    </>
  );
};

const AppRoutes = () => (
  <Layout>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/browse" element={<Browse />} />
      <Route path="/ad/:id" element={<AdDetail />} />
      <Route path="/post-ad" element={<ProtectedRoute><PostAd /></ProtectedRoute>} />
      <Route path="/chat" element={<ProtectedRoute><Chat /></ProtectedRoute>} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/admin" element={<ProtectedRoute adminOnly><AdminPanel /></ProtectedRoute>} />
      <Route path="/about" element={<About />} />
      <Route path="/safety-tips" element={<SafetyTips />} />
      <Route path="/posting-rules" element={<PostingRules />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  </Layout>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
