import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import Features from "@/components/landing/Features";
import Pricing from "@/components/landing/Pricing";
import DemoForm from "@/components/landing/DemoForm";
import Footer from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="bg-[#0f0f1a] min-h-screen text-[#f1f1f1] selection:bg-purple-500/30">
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <Pricing />
      <DemoForm />
      <Footer />
    </div>
  );
}
