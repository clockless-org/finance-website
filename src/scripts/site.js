import "../styles/site.css";

const currentPath = window.location.pathname.endsWith("/")
  ? window.location.pathname
  : `${window.location.pathname}/`;

for (const nav of document.querySelectorAll("[data-site-nav] a, [data-mobile-nav] a")) {
  const href = nav.getAttribute("href");
  if (!href) continue;
  const normalized = href.endsWith("/") ? href : `${href}/`;
  if (normalized === currentPath) {
    nav.setAttribute("aria-current", "page");
  }
}

for (const trigger of document.querySelectorAll("[data-menu-toggle]")) {
  const targetId = trigger.getAttribute("aria-controls");
  if (!targetId) continue;
  const panel = document.getElementById(targetId);
  if (!panel) continue;

  trigger.addEventListener("click", () => {
    const expanded = trigger.getAttribute("aria-expanded") === "true";
    trigger.setAttribute("aria-expanded", String(!expanded));
    panel.classList.toggle("is-open", !expanded);
  });
}

const intentField = document.querySelector("[data-intent-field]");
for (const chip of document.querySelectorAll("[data-intent-chip]")) {
  chip.addEventListener("click", () => {
    if (!(intentField instanceof HTMLSelectElement)) return;
    const value = chip.getAttribute("data-intent-chip");
    if (!value) return;
    intentField.value = value;
    for (const peer of document.querySelectorAll("[data-intent-chip]")) {
      peer.classList.toggle("is-active", peer === chip);
    }
  });
}

const form = document.querySelector("[data-consultation-form]");
if (form instanceof HTMLFormElement) {
  const endpoint = "https://app.clockless.ai/api/leads/finance-contact";
  const feedback = form.querySelector("[data-form-feedback]");
  const submitButton = form.querySelector("[data-submit-button]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!(submitButton instanceof HTMLButtonElement)) return;

    const honey = form.elements.namedItem("_honey");
    if (honey instanceof HTMLInputElement && honey.value.trim()) return;

    if (feedback instanceof HTMLElement) {
      feedback.className = "form-feedback";
      feedback.textContent = "Sending your message...";
    }

    submitButton.disabled = true;

    const firstName = form.elements.namedItem("first_name")?.value?.trim?.() || "";
    const lastName = form.elements.namedItem("last_name")?.value?.trim?.() || "";
    const payload = {
      name: `${firstName} ${lastName}`.trim(),
      first_name: firstName,
      last_name: lastName,
      email: form.elements.namedItem("email")?.value?.trim?.() || "",
      phone: form.elements.namedItem("phone")?.value?.trim?.() || "",
      intent: form.elements.namedItem("intent")?.value || "Comprehensive Plan",
      details: form.elements.namedItem("details")?.value?.trim?.() || "",
      page: window.location.pathname || "/contact/",
      source: window.location.hostname || "finance.clockless.ai",
      cta_variant: "website-design-v2-contact-form",
    };

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      form.reset();
      if (feedback instanceof HTMLElement) {
        feedback.classList.add("is-success");
        feedback.textContent = "Thank you. Maya will follow up within one business day.";
      }
      for (const chip of document.querySelectorAll("[data-intent-chip]")) {
        chip.classList.remove("is-active");
      }
    } catch {
      if (feedback instanceof HTMLElement) {
        feedback.classList.add("is-error");
        feedback.textContent = "Something went wrong. Please call or email Maya directly.";
      }
    } finally {
      submitButton.disabled = false;
    }
  });
}
