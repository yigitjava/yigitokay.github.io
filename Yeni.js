const PAGE_CONFIG = {
  Home: { prefix: "Home", hasSubtitle: true },
  Turkey: { prefix: "Turkey", hasSubtitle: false },
  Europa: { prefix: "Europa", hasSubtitle: false },
  About: { prefix: "About", hasSubtitle: true },
  Contact: { prefix: "Contact", hasSubtitle: true },
};

function getCurrentPage() {
  const filename = window.location.pathname.split("/").pop() || "Home.html";
  const name = filename.replace(".html", "").toLowerCase();

  for (const page of Object.keys(PAGE_CONFIG)) {
    if (name === page.toLowerCase()) {
      return page;
    }
  }

  return "Home";
}

function setText(id, text) {
  const element = document.getElementById(id);
  if (element && text !== undefined && text !== null) {
    element.textContent = text;
  }
}

function applyTranslations(data) {
  const page = getCurrentPage();
  const config = PAGE_CONFIG[page];
  const prefix = config.prefix;

  setText("page-title", data[`${prefix}_Title`]);

  const subtitle = document.getElementById("page-subtitle");
  if (subtitle) {
    if (config.hasSubtitle) {
      subtitle.textContent = data[`${prefix}_Title2`] || "";
      subtitle.style.display = data[`${prefix}_Title2`] ? "" : "none";
    } else {
      subtitle.style.display = "none";
    }
  }

  setText("page-content", data[`${prefix}_Content`]);
  setText("language-options", data.Language_Options);
  setText("section-lived-heading", data.Lived_Heading);
  setText("section-lived-description", data.Lived_Description);
  setText("section-visited-heading", data.Visited_Heading);
  setText("section-visited-description", data.Visited_Description);
}

function changeLanguage(lang) {
  const code = lang.toUpperCase();

  fetch(`${code}.json`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`Could not load ${code}.json`);
      }
      return response.json();
    })
    .then((data) => {
      localStorage.setItem("siteLanguage", code);
      applyTranslations(data);
    })
    .catch((error) => {
      console.error("Language switch failed:", error);
    });
}

function toggleMenu() {
  const menu = document.getElementById("main-menu");
  const button = document.querySelector(".menu-button");

  if (!menu || !button) {
    return;
  }

  const isOpen = menu.classList.toggle("is-open");
  button.setAttribute("aria-expanded", isOpen ? "true" : "false");
}

document.addEventListener("DOMContentLoaded", () => {
  const savedLanguage = localStorage.getItem("siteLanguage") || "EN";
  changeLanguage(savedLanguage);
});
