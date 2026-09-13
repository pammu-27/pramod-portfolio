import Hero from "../../components/public/Hero";
import About from "../../components/public/About";
import Skills from "../../components/public/Skills";
import Experience from "../../components/public/Experience";
import Education from "../../components/public/Education";
import Projects from "../../components/public/Projects";
import Certifications from "../../components/public/Certifications";
import Contact from "../../components/public/Contact";
import Footer from "../../components/public/Footer";
function Home() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-500">
      {/* ======================================
          HERO
      ====================================== */}
      <Hero />

      {/* ======================================
          ABOUT
      ====================================== */}

     <About />

      {/* ======================================
          SKILLS
      ====================================== */}

      <Skills />
      {/* ======================================
          EXPERIENCE
      ====================================== */}

     <Experience />
      {/* ======================================
          EDUCATION
      ====================================== */}

      <Education />

      {/* ======================================
          PROJECTS
      ====================================== */}

      <Projects />

      {/* ======================================
          CERTIFICATIONS
      ====================================== */}

      <Certifications />

      {/* ======================================
          CONTACT
      ====================================== */}

      <Contact />
      {/* ======================================
          FOOTER
      ====================================== */}

      <Footer />
    </main>
  );
}

export default Home;
