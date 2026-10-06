/* LeadLock — small interactive bits: nav, mobile menu, reveal on scroll, audit form. */
(function () {
  "use strict";

  /* Sticky nav shadow on scroll */
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 10);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* Mobile hamburger menu */
  var hamburger = document.getElementById("hamburger");
  var navLinks = document.getElementById("navLinks");
  hamburger.addEventListener("click", function () {
    var open = navLinks.classList.toggle("open");
    hamburger.setAttribute("aria-expanded", open ? "true" : "false");
    hamburger.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });
  navLinks.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navLinks.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
      hamburger.setAttribute("aria-label", "Open menu");
    });
  });

  /* Reveal-on-scroll animations */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { observer.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("visible"); });
  }

  /* Audit form -> opens visitor's email client with a pre-filled request */
  var CONTACT_EMAIL = "hello@leadlock.site"; // PLACEHOLDER: wire up real inbox before launch
  var form = document.getElementById("auditForm");
  var note = document.getElementById("formNote");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }
    var data = new FormData(form);
    var get = function (k) { return (data.get(k) || "").toString().trim(); };
    var subject = "Free Lead-Leak Audit Request — " + get("business");
    var body = [
      "Hi LeadLock,",
      "",
      "I'd like a free lead-leak audit for my business.",
      "",
      "Name: " + get("name"),
      "Business: " + get("business"),
      "Phone: " + get("phone"),
      "Email: " + get("email"),
      "Trade: " + get("trade"),
      "City: " + get("city"),
      "",
      "Thanks!"
    ].join("\n");
    window.location.href =
      "mailto:" + CONTACT_EMAIL +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
    note.textContent = "Opening your email app… if nothing happens, email us directly at " + CONTACT_EMAIL + ".";
  });
})();
