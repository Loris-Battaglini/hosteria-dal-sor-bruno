(() => {
  const header = document.querySelector(".site-header");
  const navLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
  const revealNodes = Array.from(document.querySelectorAll(".reveal"));
  const heroImage = document.querySelector(".hero-media img");

  const getHeaderOffset = () => (header ? header.offsetHeight : 0);

  const smoothScrollToTarget = (target) => {
    const top = target.getBoundingClientRect().top + window.scrollY - (getHeaderOffset() - 8);
    window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
  };

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", (event) => {
      const href = anchor.getAttribute("href");
      if (!href || href === "#") {
        return;
      }

      const target = document.querySelector(href);
      if (!target) {
        return;
      }

      event.preventDefault();
      smoothScrollToTarget(target);
    });
  });

  if (revealNodes.length) {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -50px 0px"
      }
    );

    revealNodes.forEach((node) => revealObserver.observe(node));
  }

  const sectionMap = navLinks
    .map((link) => {
      const href = link.getAttribute("href");
      const section = href ? document.querySelector(href) : null;
      return section ? { link, section } : null;
    })
    .filter(Boolean);

  const setActiveNavLink = () => {
    if (!sectionMap.length) {
      return;
    }

    const marker = window.scrollY + getHeaderOffset() + 120;
    let active = sectionMap[0].link;

    sectionMap.forEach(({ link, section }) => {
      if (marker >= section.offsetTop) {
        active = link;
      }
    });

    navLinks.forEach((link) => {
      link.classList.toggle("is-active", link === active);
    });
  };

  const setHeaderState = () => {
    if (!header) {
      return;
    }
    header.classList.toggle("is-scrolled", window.scrollY > 18);
  };

  const updateHeroParallax = () => {
    if (!heroImage) {
      return;
    }

    const shift = Math.min(window.scrollY * 0.11, 48);
    heroImage.style.transform = `translate3d(0, ${shift}px, 0) scale(1.08)`;
  };

  let ticking = false;
  const onScroll = () => {
    if (ticking) {
      return;
    }

    window.requestAnimationFrame(() => {
      setHeaderState();
      setActiveNavLink();
      updateHeroParallax();
      ticking = false;
    });

    ticking = true;
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", setActiveNavLink);

  setHeaderState();
  setActiveNavLink();
  updateHeroParallax();

  const yearNode = document.getElementById("year");
  if (yearNode) {
    yearNode.textContent = String(new Date().getFullYear());
  }
})();
