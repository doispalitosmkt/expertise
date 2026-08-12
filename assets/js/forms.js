(() => {
  const MAX_CV_SIZE = 10 * 1024 * 1024;
  const allowedCvTypes = new Set([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ]);

  const getErrorElement = (field) => {
    const id = field.getAttribute("aria-describedby");
    if (!id) return null;
    return id.split(/\s+/).map((item) => document.getElementById(item)).find((element) => {
      return element?.classList.contains("field-error");
    }) || null;
  };

  const setFieldError = (field, message) => {
    const error = getErrorElement(field);
    field.setAttribute("aria-invalid", message ? "true" : "false");
    if (error) error.textContent = message;
  };

  const validateField = (field) => {
    let message = "";

    if (field.validity.valueMissing) {
      message = field.type === "checkbox" ? "É necessário aceitar para continuar." : "Preencha este campo.";
    } else if (field.validity.typeMismatch) {
      message = "Informe um e-mail válido.";
    } else if (field.validity.patternMismatch) {
      message = "Confira o formato informado.";
    }

    if (field.type === "file" && field.files?.length) {
      const file = field.files[0];
      const extension = file.name.split(".").pop()?.toLowerCase();
      const allowedExtension = ["pdf", "doc", "docx"].includes(extension || "");
      if ((!allowedCvTypes.has(file.type) && !allowedExtension)) {
        message = "Envie um arquivo PDF, DOC ou DOCX.";
      } else if (file.size > MAX_CV_SIZE) {
        message = "O arquivo deve ter no máximo 10 MB.";
      }
    }

    setFieldError(field, message);
    return !message;
  };

  document.querySelectorAll("form[data-preview-form]").forEach((form) => {
    const fields = [...form.querySelectorAll("input, select, textarea")];
    const status = form.querySelector("[data-form-status]");

    fields.forEach((field) => {
      field.addEventListener(field.type === "checkbox" || field.type === "file" || field.tagName === "SELECT" ? "change" : "blur", () => {
        validateField(field);
      });
    });

    const validatePreview = () => {
      const valid = fields.map(validateField).every(Boolean);

      if (!status) return;
      status.hidden = false;
      status.classList.toggle("form-status--success", valid);
      status.classList.toggle("form-status--error", !valid);

      if (valid) {
        status.textContent = "Pré-visualização concluída. Os dados foram validados, mas não foram enviados nem armazenados.";
        status.focus();
      } else {
        status.textContent = "Revise os campos destacados antes de continuar.";
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        firstInvalid?.focus();
      }
    };

    // `method="dialog"` prevents a network request even if this script fails;
    // this handler supplies the validation feedback for the preview.
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      validatePreview();
    });
  });
})();
