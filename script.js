/* ============================================================
   EXPERIENCE LETTER GENERATOR — SCRIPT
   - Live preview binding
   - Letterhead & photo upload
   - Dynamic responsibility inputs
   - Print / PDF
   - Reset
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- ELEMENT REFERENCES ---------- */
  const form = document.getElementById("letterForm");

  // Company
  const companyName = document.getElementById("companyName");
  const companyAddress = document.getElementById("companyAddress");
  const companyPhone = document.getElementById("companyPhone");
  const companyEmail = document.getElementById("companyEmail");
  const companyWebsite = document.getElementById("companyWebsite");

  // Uploads
  const letterheadUpload = document.getElementById("letterheadUpload");
  const photoUpload = document.getElementById("photoUpload");
  const clearImagesBtn = document.getElementById("clearImagesBtn");

  // Employee
  const employeeName = document.getElementById("employeeName");
  const designation = document.getElementById("designation");
  const joiningDate = document.getElementById("joiningDate");
  const lastDate = document.getElementById("lastDate");

  // Responsibilities
  const responsibilityList = document.getElementById("responsibilityList");
  const addResponsibilityBtn = document.getElementById("addResponsibilityBtn");

  // Performance
  const performance = document.getElementById("performance");
  const conductLine = document.getElementById("conductLine");

  // Signatory
  const signatoryName = document.getElementById("signatoryName");
  const signatoryDesignation = document.getElementById("signatoryDesignation");
  const letterDate = document.getElementById("letterDate");

  // Buttons
  const printBtn = document.getElementById("printBtn");
  const resetBtn = document.getElementById("resetBtn");

  // Preview elements
  const pvLetterhead = document.getElementById("previewLetterhead");
  const pvCompanyName = document.getElementById("pvCompanyName");
  const pvCompanyAddress = document.getElementById("pvCompanyAddress");
  const pvCompanyContact = document.getElementById("pvCompanyContact");
  const pvDate = document.getElementById("pvDate");
  const pvPhoto = document.getElementById("previewPhoto");
  const pvEmployeeName = document.getElementById("pvEmployeeName");
  const pvCompanyNameBody = document.getElementById("pvCompanyNameBody");
  const pvDesignation = document.getElementById("pvDesignation");
  const pvJoiningDate = document.getElementById("pvJoiningDate");
  const pvLastDate = document.getElementById("pvLastDate");
  const pvResponsibilities = document.getElementById("pvResponsibilities");
  const pvPerformance = document.getElementById("pvPerformance");
  const pvSignatoryName = document.getElementById("pvSignatoryName");
  const pvSignatoryDesignation = document.getElementById("pvSignatoryDesignation");
  const pvSignatoryCompany = document.getElementById("pvSignatoryCompany");

  /* ---------- HELPERS ---------- */
  function formatDate(dateStr) {
    if (!dateStr) return "[DD/MM/YYYY]";
    const [y, m, d] = dateStr.split("-");
    return `${d}/${m}/${y}`;
  }

  function setText(el, value, fallback) {
    el.textContent = value && value.trim() !== "" ? value : fallback;
  }

  /* ---------- LIVE PREVIEW BINDING ---------- */
  function updatePreview() {
    setText(pvCompanyName, companyName.value, "[Company Name]");
    setText(pvCompanyAddress, companyAddress.value, "[Company Address]");

    const contactParts = [
      companyPhone.value || "[Phone]",
      companyEmail.value || "[Email]",
      companyWebsite.value || ""
    ].filter(Boolean);
    pvCompanyContact.textContent = contactParts.join(" | ");

    pvDate.textContent = formatDate(letterDate.value);

    setText(pvEmployeeName, employeeName.value, "[Employee Name]");
    setText(pvCompanyNameBody, companyName.value, "[Company Name]");
    setText(pvDesignation, designation.value, "[Designation]");
    pvJoiningDate.textContent = formatDate(joiningDate.value);
    pvLastDate.textContent = formatDate(lastDate.value);

    // Responsibilities
    pvResponsibilities.innerHTML = "";
    const respInputs = responsibilityList.querySelectorAll("input");
    let hasResp = false;
    respInputs.forEach((inp, idx) => {
      if (inp.value.trim() !== "") {
        hasResp = true;
        const li = document.createElement("li");
        li.textContent = inp.value.trim();
        pvResponsibilities.appendChild(li);
      }
    });
    if (!hasResp) {
      const li = document.createElement("li");
      li.textContent = "[Responsibility 1]";
      pvResponsibilities.appendChild(li);
    }

    // Performance line
    const perf = performance.value || "[Performance]";
    const conduct = conductLine.value.trim();
    let perfLine = `Their performance remained ${perf}`;
    if (conduct) perfLine += ` and ${conduct}`;
    perfLine += ".";
    pvPerformance.textContent = perfLine;

    // Signatory
    setText(pvSignatoryName, signatoryName.value, "[Signatory Name]");
    setText(pvSignatoryDesignation, signatoryDesignation.value, "[Designation]");
    setText(pvSignatoryCompany, companyName.value, "[Company Name]");
  }

  /* ---------- BIND INPUT EVENTS ---------- */
  const allInputs = form.querySelectorAll("input, textarea, select");
  allInputs.forEach((inp) => {
    inp.addEventListener("input", updatePreview);
    inp.addEventListener("change", updatePreview);
  });

  /* ---------- LETTERHEAD UPLOAD ---------- */
  letterheadUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      pvLetterhead.innerHTML = `<img src="${ev.target.result}" alt="Letterhead" />`;
    };
    reader.readAsDataURL(file);
  });

  /* ---------- PHOTO UPLOAD ---------- */
  photoUpload.addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      pvPhoto.innerHTML = `<img src="${ev.target.result}" alt="Employee Photo" />`;
    };
    reader.readAsDataURL(file);
  });

  /* ---------- CLEAR IMAGES ---------- */
  clearImagesBtn.addEventListener("click", () => {
    pvLetterhead.innerHTML = "";
    pvPhoto.innerHTML = "";
    letterheadUpload.value = "";
    photoUpload.value = "";
  });

  /* ---------- DYNAMIC RESPONSIBILITIES ---------- */
  function createResponsibilityRow(value = "") {
    const row = document.createElement("div");
    row.className = "resp-row";

    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "e.g., Maintained daily accounts and book-keeping";
    input.value = value;
    input.addEventListener("input", updatePreview);

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.textContent = "✕";
    removeBtn.title = "Remove";
    removeBtn.addEventListener("click", () => {
      row.remove();
      updatePreview();
    });

    row.appendChild(input);
    row.appendChild(removeBtn);
    return row;
  }

  addResponsibilityBtn.addEventListener("click", () => {
    responsibilityList.appendChild(createResponsibilityRow());
  });

  // Default 3 empty rows
  for (let i = 0; i < 3; i++) {
    responsibilityList.appendChild(createResponsibilityRow());
  }

  /* ---------- PRINT ---------- */
  printBtn.addEventListener("click", () => {
    window.print();
  });

  /* ---------- RESET ---------- */
  resetBtn.addEventListener("click", () => {
    setTimeout(() => {
      pvLetterhead.innerHTML = "";
      pvPhoto.innerHTML = "";
      responsibilityList.innerHTML = "";
      for (let i = 0; i < 3; i++) {
        responsibilityList.appendChild(createResponsibilityRow());
      }
      updatePreview();
    }, 10);
  });

  /* ---------- INITIAL PREVIEW ---------- */
  updatePreview();
});
