/* ==========================================================================
   CONTACT PAGE — curtain-style custom dropdown + simulated form success.
   The form does not submit anywhere yet; this only validates client-side
   and swaps in a success state, per the current UI-only scope.
   ========================================================================== */
(function () {
  /* ---------------- Curtain dropdown ---------------- */
  const curtain = document.querySelector("[data-curtain-select]");
  if (curtain) {
    const trigger = curtain.querySelector(".curtain-select__trigger");
    const label = curtain.querySelector("[data-curtain-select-label]");
    const panel = curtain.querySelector(".curtain-select__panel");
    const hiddenInput = curtain.querySelector("[data-curtain-select-value]");
    const options = Array.from(curtain.querySelectorAll('[role="option"]'));

    function openPanel() {
      curtain.classList.add("is-open");
      trigger.setAttribute("aria-expanded", "true");
      panel.hidden = false;
    }
    function closePanel() {
      curtain.classList.remove("is-open");
      trigger.setAttribute("aria-expanded", "false");
      setTimeout(() => { if (!curtain.classList.contains("is-open")) panel.hidden = true; }, 350);
    }
    function selectOption(option) {
      options.forEach((o) => {
        o.classList.toggle("is-active", o === option);
        o.setAttribute("aria-selected", String(o === option));
      });
      label.textContent = option.textContent;
      hiddenInput.value = option.dataset.value;
      trigger.removeAttribute("data-placeholder");
      closePanel();
      trigger.focus();
    }

    trigger.addEventListener("click", () => {
      curtain.classList.contains("is-open") ? closePanel() : openPanel();
    });

    options.forEach((option) => {
      option.addEventListener("click", () => selectOption(option));
    });

    document.addEventListener("click", (e) => {
      if (!curtain.contains(e.target)) closePanel();
    });

    curtain.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closePanel();
        trigger.focus();
      }
      if ((e.key === "ArrowDown" || e.key === "ArrowUp") && curtain.classList.contains("is-open")) {
        e.preventDefault();
        const current = options.findIndex((o) => o.classList.contains("is-active"));
        const dir = e.key === "ArrowDown" ? 1 : -1;
        const next = options[(current + dir + options.length) % options.length];
        next.focus();
      }
    });
  }

  /* ---------------- Custom validation ---------------- */
  const form = document.querySelector("[data-enquiry-form]");
  const successPanel = document.querySelector("[data-enquiry-success]");
  const resetBtn = document.querySelector("[data-enquiry-reset]");

  function setError(field, message) {
    const errorSpan = document.querySelector(`[data-error-for="${field}"]`);
    const input = form.querySelector(`[name="${field}"]`);
    if (errorSpan) errorSpan.textContent = message;
    if (input) input.classList.add("has-error");
    if (field === "serviceInterest") curtain.classList.add("has-error");
  }

  function clearError(field) {
    const errorSpan = document.querySelector(`[data-error-for="${field}"]`);
    const input = form.querySelector(`[name="${field}"]`);
    if (errorSpan) errorSpan.textContent = "";
    if (input) input.classList.remove("has-error");
    if (field === "serviceInterest") curtain.classList.remove("has-error");
  }

  function validateForm() {
    let isValid = true;

    // Clear all errors
    form.querySelectorAll('.error-message').forEach(el => el.textContent = "");
    form.querySelectorAll('.has-error').forEach(el => el.classList.remove("has-error"));
    curtain.classList.remove("has-error");

    // Full Name validation
    const fullName = form.fullName.value.trim();
    if (!fullName) {
      setError("fullName", "Please enter your full name.");
      isValid = false;
    }

    // Email validation
    const email = form.email.value.trim();
    if (!email) {
      setError("email", "Please enter your email address.");
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("email", "Please enter a valid email address.");
      isValid = false;
    }

    // Phone validation (optional but if filled check format)
    const phone = form.phone.value.trim();
    if (phone && !/^[+\d\s\-()]{7,20}$/.test(phone)) {
      setError("phone", "Please enter a valid phone number.");
      isValid = false;
    }

    // Service Interest validation
    const service = form.serviceInterest.value;
    if (!service) {
      setError("serviceInterest", "Please select a service option.");
      isValid = false;
    }

    // Requirements validation
    const requirements = form.requirements.value.trim();
    if (!requirements) {
      setError("requirements", "Please tell us about your requirements.");
      isValid = false;
    }

    return isValid;
  }

  if (form && successPanel) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      if (!validateForm()) {
        return;
      }
      form.hidden = true;
      successPanel.hidden = false;
      
      // Reset animations and replay
      const circle = successPanel.querySelector(".enquiry-success__circle");
      const check = successPanel.querySelector(".enquiry-success__check");
      if (circle && check) {
        circle.style.animation = "none";
        check.style.animation = "none";
        void circle.offsetWidth;
        circle.style.animation = "";
        check.style.animation = "";
      }
    });

    if (resetBtn) {
      resetBtn.addEventListener("click", () => {
        form.reset();
        const curtainLabel = form.querySelector("[data-curtain-select-label]");
        const curtainValue = form.querySelector("[data-curtain-select-value]");
        if (curtainLabel) curtainLabel.textContent = "Select an option";
        if (curtainValue) curtainValue.value = "";
        
        // Clear all errors on reset
        form.querySelectorAll('.error-message').forEach(el => el.textContent = "");
        form.querySelectorAll('.has-error').forEach(el => el.classList.remove("has-error"));
        curtain.classList.remove("has-error");
        
        successPanel.hidden = true;
        form.hidden = false;
      });
    }
  }
})();