import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Hero } from "@/components/sections/hero";
import { About } from "@/components/sections/about";
import { Skills } from "@/components/sections/skills";
import { GithubStatsSection } from "@/components/sections/github-stats";
import { OmsCase } from "@/components/sections/oms-case";
import { Projects } from "@/components/sections/projects";
import { Process } from "@/components/sections/process";
import { Experience } from "@/components/sections/experience";
import { Contact } from "@/components/sections/contact";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <GithubStatsSection />
        <OmsCase />
        <Projects />
        <Process />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
