import AboutUs from "@/components/AboutUs";
import Category from "@/components/Category";

import Enroll from "@/components/Enroll";
import HeroSection from "@/components/HeroSection";
import NewLetter from "@/components/NewLetter";

export default function Home() {
  return (
    <div>
      <HeroSection />
      <Category />
      <Enroll />
      <AboutUs />
      <NewLetter />
      <div className="h-24"></div>
    </div>
  );
}
