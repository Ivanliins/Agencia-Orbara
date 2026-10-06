import { useEffect } from "react";
import { useTheme } from "@/context/theme";
import { startSmoothScroll, ScrollTrigger, scrollToId } from "@/lib/motion";
import { InstantAudit } from "@/components/InstantAudit";
import { CasesShowcase } from "@/components/CasesShowcase";
import { PlansShowcase } from "@/components/PlansShowcase";
import { Cursor, ScrollProgress, Navbar, WhatsAppFab } from "@/components/site/Chrome";
import { Hero } from "@/components/site/Hero";
import { Manifesto } from "@/components/site/Manifesto";
import { Services } from "@/components/site/Services";
import { SeoJourney } from "@/components/site/SeoJourney";
import { Process } from "@/components/site/Process";
import { Testimonials } from "@/components/site/Testimonials";
import { Audience, Stats } from "@/components/site/Audience";
import { Faq } from "@/components/site/Faq";
import { Vision, Contact, Footer } from "@/components/site/Closing";

export default function Home() {
  const { isDark, toggleTheme } = useTheme();

  useEffect(() => startSmoothScroll(), []);

  // Recalcula posições quando as fontes terminam de carregar e respeita âncoras (ex.: /#contato vindo de um case)
  useEffect(() => {
    document.fonts?.ready.then(() => {
      ScrollTrigger.refresh();
      const id = window.location.hash.slice(1);
      if (id) setTimeout(() => scrollToId(id), 300);
    });
  }, []);

  const bg = isDark ? "bg-[#0d0101]" : "bg-white";

  return (
    <div className={`${bg} min-h-screen font-sans overflow-x-clip selection:bg-[#ff5d00] selection:text-[#0d0101] transition-colors duration-500`}>
      <ScrollProgress />
      <Cursor />
      <WhatsAppFab />
      <Navbar isDark={isDark} toggleTheme={toggleTheme} />

      <Hero />
      <InstantAudit isDark={isDark} />
      <Manifesto isDark={isDark} />
      <Services isDark={isDark} />
      <SeoJourney isDark={isDark} />
      <Process isDark={isDark} />
      <CasesShowcase isDark={isDark} />
      <Testimonials isDark={isDark} />
      <Audience isDark={isDark} />
      <Stats isDark={isDark} />
      <PlansShowcase isDark={isDark} />
      <Faq isDark={isDark} />
      <Vision isDark={isDark} />
      <Contact isDark={isDark} />
      <Footer />
    </div>
  );
}
