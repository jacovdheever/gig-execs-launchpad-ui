import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./auth/context/AuthContext";
import Maintenance from "./pages/Maintenance";
import MarketingHome from "./pages/MarketingHome";
import Clients from "./pages/Clients";
import Professionals from "./pages/Professionals";
import Blog from "./pages/Blog";
import BlogArticle from "./pages/BlogArticle";
import ExecutiveFreelancePlatform from "./pages/ExecutiveFreelancePlatform";
import NavigatingAI from "./pages/NavigatingAI";
import BigAnomaly from "./pages/BigAnomaly";
import FindingPurpose from "./pages/FindingPurpose";
import BuildingTheFuture from "./pages/BuildingTheFuture";
import AIRobotsBuckleUp from "./pages/AIRobotsBuckleUp";
import ChallengeFor2025 from "./pages/ChallengeFor2025";
import FutureOfSeniorWork from "./pages/FutureOfSeniorWork";
import MasterMentalClarity from "./pages/MasterMentalClarity";
import Pricing from "./pages/Pricing";
import AboutUs from "./pages/AboutUs";
import DataPrivacyPolicy from "./pages/DataPrivacyPolicy";
import TermsAndConditions from "./pages/TermsAndConditions";
import HelpAndSupport from "./pages/HelpAndSupport";
import NotFound from "./pages/NotFound";

// Functional App Components
import LoginPage from "./app/auth/login";
import RegisterPage from "./app/auth/register";
import AuthCallback from "./app/auth/callback";
import DashboardLayout from "./app/dashboard/layout";
import DashboardPage from "./app/dashboard";
import OnboardingStep1 from "./app/onboarding/step1";
import OnboardingStep2 from "./app/onboarding/step2";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Functional App Routes - Root Route */}
            <Route path="/" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
            </Route>
            
            {/* Marketing Site Routes */}
            <Route path="/marketing" element={<MarketingHome />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/professionals" element={<Professionals />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/article" element={<BlogArticle />} />
            <Route path="/blog/executive-freelance-platform" element={<ExecutiveFreelancePlatform />} />
            <Route path="/blog/navigating-ai" element={<NavigatingAI />} />
            <Route path="/blog/big-anomaly" element={<BigAnomaly />} />
            <Route path="/blog/finding-purpose" element={<FindingPurpose />} />
            <Route path="/blog/building-the-future" element={<BuildingTheFuture />} />
            <Route path="/blog/ai-robots-buckle-up" element={<AIRobotsBuckleUp />} />
            <Route path="/blog/challenge-for-2025" element={<ChallengeFor2025 />} />
            <Route path="/blog/future-of-senior-work" element={<FutureOfSeniorWork />} />
            <Route path="/blog/master-mental-clarity" element={<MasterMentalClarity />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/data-privacy-policy" element={<DataPrivacyPolicy />} />
            <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
            <Route path="/help" element={<HelpAndSupport />} />
            
            {/* Functional App Routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
            </Route>
            
            {/* Onboarding Routes */}
            <Route path="/onboarding/step1" element={<OnboardingStep1 />} />
            <Route path="/onboarding/step2" element={<OnboardingStep2 />} />
            
            {/* Maintenance Page */}
            <Route path="/maintenance" element={<Maintenance />} />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
