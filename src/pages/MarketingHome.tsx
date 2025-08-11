import Header from "@/components/Header"
import Hero from "@/components/Hero"
import About from "@/components/About"
import HeroBanner from "@/components/HeroBanner"
import Features from "@/components/Features"
import Footer from "@/components/Footer"

const Index = () => {
  return (
    <div className="min-h-screen ">
      <Header />
      <Hero />
      <About />
      <HeroBanner />
      <Footer />
    </div>
  );
};

export default Index;
