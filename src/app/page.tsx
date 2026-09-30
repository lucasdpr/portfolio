import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { Manifesto } from "@/components/sections/manifesto";
import { Showcase } from "@/components/sections/showcase";
import { About } from "@/components/sections/about";
import { Services } from "@/components/sections/services";
import { Skills } from "@/components/sections/skills";
import { GithubStatsSection } from "@/components/sections/github-stats";
import { Projects } from "@/components/sections/projects";
import { Process } from "@/components/sections/process";
import { Experience } from "@/components/sections/experience";
import { CtaMarquee } from "@/components/sections/cta-marquee";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <Manifesto />
        <Showcase />
        <About />
        <Services />
        <Projects />
        <Skills />
        <GithubStatsSection />
        <Process />
        <Experience />
        <CtaMarquee />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
