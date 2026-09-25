import { About } from "@/components/sections/about";
import { Experience } from "@/components/sections/experience";
import { Hero } from "@/components/sections/hero";
import { Projects } from "@/components/sections/projects";
import { Skills } from "@/components/sections/skills";
import { HashFocus } from "@/components/shared/hash-focus";

export default function HomePage() {
  return (
    <>
      <HashFocus />
      <Hero />
      <About />
      <Skills />
      <Experience />
      <Projects />
      {/* Contact بمرحلة 08 */}
    </>
  );
}
