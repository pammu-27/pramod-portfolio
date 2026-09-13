import { useEffect, useState } from "react";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Projects", href: "#projects" },
  { label: "Certifications", href: "#certifications" },
  { label: "Contact", href: "#contact" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      setDarkMode(true);
    }
  }, []);

  function toggleTheme() {
    const nextTheme = darkMode ? "light" : "dark";

    document.documentElement.setAttribute("data-theme", nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
    setDarkMode(!darkMode);
  }

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 16);
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.href.substring(1)))
      .filter((section): section is HTMLElement => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      {
        rootMargin: "-20% 0px -65% 0px",
        threshold: [0, 0.1, 0.25, 0.5],
      }
    );

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, []);

  function handleNavClick() {
    setMenuOpen(false);
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4 lg:px-7">
      <nav
        className={`
          mx-auto flex h-[62px] max-w-[1280px] items-center justify-between
          rounded-[17px] border border-[var(--glass-border)]
          bg-[var(--nav-bg)] px-4 backdrop-blur-2xl
          transition-all duration-300 sm:h-[66px] sm:px-6 lg:px-7
          ${scrolled ? "shadow-[0_12px_40px_rgba(0,0,0,0.16)]" : ""}
        `}
      >
        {/* Logo */}
        <a
          href="#home"
          onClick={handleNavClick}
          aria-label="Pramod - Home"
          className="group flex shrink-0 items-center gap-1"
        >
          <span className="text-[18px] font-bold tracking-[-0.04em] text-[var(--text)]">
            Pramod
          </span>
          <span className="text-[20px] font-bold leading-none text-[var(--accent)] transition-transform duration-300 group-hover:-translate-y-px">
            .
          </span>
        </a>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-0.5 lg:flex">
          {navItems.map((item) => {
            const sectionId = item.href.substring(1);
            const isActive = activeSection === sectionId;

            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={`
                  relative rounded-lg px-3 py-2.5 text-[13px] font-medium
                  tracking-[-0.01em] transition-all duration-200
                  ${
                    isActive
                      ? "text-[var(--text)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text)]"
                  }
                `}
              >
                {item.label}

                <span
                  className={`
                    absolute bottom-0.5 left-1/2 h-[2px] -translate-x-1/2
                    rounded-full bg-[var(--accent)] transition-all duration-300
                    ${isActive ? "w-5 opacity-100" : "w-0 opacity-0"}
                  `}
                />
              </a>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode ? "Light mode" : "Dark mode"}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-[var(--text-secondary)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] sm:h-10 sm:w-10"
          >
            {darkMode ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[17px] w-[17px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.6}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1.5M12 19.5V21M4.22 4.22l1.06 1.06M18.72 18.72l1.06 1.06M3 12h1.5M19.5 12H21M4.22 19.78l1.06-1.06M18.72 5.28l1.06-1.06M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[17px] w-[17px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.6}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
                />
              </svg>
            )}
          </button>

          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((current) => !current)}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--glass-border)] bg-[var(--glass)] text-[var(--text)] transition-all duration-300 hover:border-[var(--accent)] hover:text-[var(--accent)] lg:hidden sm:h-10 sm:w-10"
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[18px] w-[18px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-[18px] w-[18px]"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.8}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="mx-auto mt-2 max-w-[1280px] overflow-hidden rounded-[17px] border border-[var(--glass-border)] bg-[var(--nav-bg)] p-2 backdrop-blur-2xl lg:hidden"
        >
          <div className="flex flex-col">
            {navItems.map((item) => {
              const sectionId = item.href.substring(1);
              const isActive = activeSection === sectionId;

              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={handleNavClick}
                  aria-current={isActive ? "page" : undefined}
                  className={`
                    flex items-center justify-between rounded-xl px-4 py-3.5
                    text-sm font-medium transition-all duration-200
                    ${
                      isActive
                        ? "bg-[var(--accent)]/10 text-[var(--accent)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--glass)] hover:text-[var(--text)]"
                    }
                  `}
                >
                  <span>{item.label}</span>
                  {isActive && (
                    <span className="h-1.5 w-1.5 rounded-full bg-[var(--accent)]" />
                  )}
                </a>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
