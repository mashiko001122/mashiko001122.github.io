const localeAliases = {
  "en-US": "en",
  "es-ES": "es",
  "fr-FR": "fr",
  "de-DE": "de",
  "pt": "pt-BR",
  "pt-PT": "pt-BR",
  "zh-CN": "zh-Hans",
  "zh-SG": "zh-Hans",
  "zh-TW": "zh-Hant",
  "zh-HK": "zh-Hant"
};

const supportedLocales = ["en", "ja", "ko", "zh-Hans", "zh-Hant", "es", "fr", "de", "pt-BR"];

const pageLinkTranslations = {
  en: { supportRequest: "Open a support request", privacyPolicy: "Privacy Policy", support: "TraceBack Support" },
  ja: { supportRequest: "サポートを依頼する", privacyPolicy: "プライバシーポリシー", support: "TraceBackサポート" },
  ko: { supportRequest: "지원 요청 열기", privacyPolicy: "개인정보 처리방침", support: "TraceBack 지원" },
  "zh-Hans": { supportRequest: "提交支持请求", privacyPolicy: "隐私政策", support: "TraceBack 支持" },
  "zh-Hant": { supportRequest: "提交支援請求", privacyPolicy: "隱私權政策", support: "TraceBack 支援" },
  es: { supportRequest: "Abrir una solicitud de ayuda", privacyPolicy: "Política de privacidad", support: "Ayuda de TraceBack" },
  fr: { supportRequest: "Ouvrir une demande d’assistance", privacyPolicy: "Politique de confidentialité", support: "Assistance TraceBack" },
  de: { supportRequest: "Supportanfrage öffnen", privacyPolicy: "Datenschutzerklärung", support: "TraceBack-Support" },
  "pt-BR": { supportRequest: "Abrir uma solicitação de suporte", privacyPolicy: "Política de Privacidade", support: "Suporte do TraceBack" }
};

function resolvedLocale(candidate) {
  if (!candidate) return "en";
  if (supportedLocales.includes(candidate)) return candidate;
  if (localeAliases[candidate]) return localeAliases[candidate];
  const language = candidate.split("-")[0];
  return supportedLocales.includes(language) ? language : "en";
}

function renderPage(locale) {
  const copy = window.pageTranslations[locale] || window.pageTranslations.en;
  const linkCopy = pageLinkTranslations[locale] || pageLinkTranslations.en;
  document.documentElement.lang = locale;
  document.title = `${copy.title} | TraceBack`;
  document.querySelector("#page-title").textContent = copy.title;
  document.querySelector("#page-lead").textContent = copy.lead;
  document.querySelector("#page-updated").textContent = copy.updated;
  document.querySelector("#page-sections").replaceChildren(...copy.sections.map(section => {
    const element = document.createElement("section");
    const heading = document.createElement("h2");
    heading.textContent = section.heading;
    element.appendChild(heading);
    section.paragraphs.forEach(value => {
      const paragraph = document.createElement("p");
      paragraph.textContent = value;
      element.appendChild(paragraph);
    });
    return element;
  }));
  document.querySelectorAll("[data-link-copy]").forEach(element => {
    element.textContent = linkCopy[element.dataset.linkCopy];
  });
  localStorage.setItem("traceback-site-locale", locale);
}

const selector = document.querySelector("#language-selector");
const initialLocale = resolvedLocale(
  localStorage.getItem("traceback-site-locale") || navigator.language
);
selector.value = initialLocale;
selector.addEventListener("change", event => renderPage(event.target.value));
renderPage(initialLocale);
