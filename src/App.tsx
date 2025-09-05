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
import BlogArticle1 from "./pages/BlogArticle1";
import BlogArticle2 from "./pages/BlogArticle2";
import BlogArticle3 from "./pages/BlogArticle3";
import BlogArticle4 from "./pages/BlogArticle4";
import BlogArticle5 from "./pages/BlogArticle5";
import BlogArticle6 from "./pages/BlogArticle6";
import BlogArticle7 from "./pages/BlogArticle7";
import BlogArticle8 from "./pages/BlogArticle8";
import BlogArticle9 from "./pages/BlogArticle9";
import BlogArticle10 from "./pages/BlogArticle10";
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
import HowItWorks from "./pages/HowItWorks";
import NotFound from "./pages/NotFound";

// Functional App Components
import LoginPage from "./app/auth/login";
import RegisterPage from "./app/auth/register";
import ForgotPasswordPage from "./app/auth/forgot-password";
import ResetPasswordPage from "./app/auth/reset-password";
import AuthCallback from "./app/auth/callback";
import DashboardLayout from "./app/dashboard/layout";
import DashboardPage from "./app/dashboard";
import OnboardingStep1 from "./app/onboarding/step1";
import OnboardingStep2 from "./app/onboarding/step2";
import OnboardingStep3 from "./app/onboarding/step3";
import OnboardingStep4 from "./app/onboarding/step4";
import OnboardingStep5 from "./app/onboarding/step5";
import OnboardingStep6 from "./app/onboarding/step6"; // Added
import ReviewProfile from "./app/onboarding/review"; // Added

// Client Onboarding Components
import ClientOnboardingStep1 from "./app/onboarding/client/step1";
import ClientOnboardingStep2 from "./app/onboarding/client/step2";
import ClientOnboardingStep3 from "./app/onboarding/client/step3";
import ClientOnboardingReview from "./app/onboarding/client/review";

// Gig Creation Components
import GigCreationStep1 from "./app/gig-creation/step1";
import GigCreationStep2 from "./app/gig-creation/step2";
import GigCreationStep3 from "./app/gig-creation/step3";
import GigCreationStep4 from "./app/gig-creation/step4";
import GigCreationStep5 from "./app/gig-creation/step5";

// Projects Components
import ProjectsPage from "./app/projects";
import GigsPage from "./app/gigs";

// Community Components
import CommunityLayout from "./routes/community/CommunityLayout";
import CommunityLanding from "./routes/community/CommunityLanding";
import CommunityTopic from "./routes/community/CommunityTopic";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Marketing Site Routes - Root Route */}
            <Route path="/" element={<MarketingHome />} />
            
            {/* Functional App Routes */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
            </Route>
            <Route path="/clients" element={<Clients />} />
            <Route path="/professionals" element={<Professionals />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/article" element={<BlogArticle />} />
            <Route path="/blog/remote-hybrid-in-office" element={<BlogArticle1 />} />
            <Route path="/blog/corporate-leadership-executive-freelancing" element={<BlogArticle2 />} />
            <Route path="/blog/ai-revolution-senior-professionals" element={<BlogArticle3 />} />
            <Route path="/blog/job-market-anomaly-older-talent" element={<BlogArticle4 />} />
            <Route path="/blog/finding-purpose-second-half-life" element={<BlogArticle5 />} />
            <Route path="/blog/building-future-flexible-work" element={<BlogArticle6 />} />
            <Route path="/blog/ai-robots-future-work-2025" element={<BlogArticle7 />} />
            <Route path="/blog/future-senior-work-flexibility-freelance" element={<BlogArticle8 />} />
            <Route path="/blog/20-percent-challenge-flexible-work-2025" element={<BlogArticle9 />} />
            <Route path="/blog/master-mental-clarity-stress-management-high-performers" element={<BlogArticle10 />} />
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
            <Route path="/how-it-works" element={<HowItWorks />} />
            
            {/* Functional App Routes */}
            <Route path="/auth/login" element={<LoginPage />} />
            <Route path="/auth/register" element={<RegisterPage />} />
            <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/auth/reset-password" element={<ResetPasswordPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardPage />} />
            </Route>
            
            {/* Onboarding Routes */}
            <Route path="/onboarding/step1" element={<OnboardingStep1 />} />
            <Route path="/onboarding/step2" element={<OnboardingStep2 />} />
            <Route path="/onboarding/step3" element={<OnboardingStep3 />} />
            <Route path="/onboarding/step4" element={<OnboardingStep4 />} />
            <Route path="/onboarding/step5" element={<OnboardingStep5 />} />
            <Route path="/onboarding/step6" element={<OnboardingStep6 />} /> {/* Added */}
            <Route path="/onboarding/review" element={<ReviewProfile />} /> {/* Added */}
            
            {/* Client Onboarding Routes */}
            <Route path="/onboarding/client/step1" element={<ClientOnboardingStep1 />} />
            <Route path="/onboarding/client/step2" element={<ClientOnboardingStep2 />} />
            <Route path="/onboarding/client/step3" element={<ClientOnboardingStep3 />} />
            <Route path="/onboarding/client/review" element={<ClientOnboardingReview />} />

            {/* Gig Creation Routes */}
            <Route path="/gig-creation/step1" element={<GigCreationStep1 />} />
            <Route path="/gig-creation/step2" element={<GigCreationStep2 />} />
            <Route path="/gig-creation/step3" element={<GigCreationStep3 />} />
            <Route path="/gig-creation/step4" element={<GigCreationStep4 />} />
            <Route path="/gig-creation/step5" element={<GigCreationStep5 />} />

            {/* Projects Routes */}
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/gigs" element={<GigsPage />} />

            {/* Community Routes */}
            <Route path="/community" element={<CommunityLayout />}>
              <Route index element={<CommunityLanding />} />
              <Route path="topic/:slug" element={<CommunityTopic />} />
            </Route>

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
