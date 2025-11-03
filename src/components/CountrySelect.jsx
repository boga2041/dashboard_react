// src/components/CountrySelect.jsx
import Select from "react-select";

export function CountrySelect({ options = [], value = { id: "", name: "" }, onChange, disabled }) {
  const rsOptions = [
    { value: "ALL", label: "Todos" },
    ...options.map((c) => ({ value: c.id, label: c.name })),
  ];

  // value llega como { id, name } o vacío; encontramos la opción correspondiente
  const rsValue =
    value && (value.id || value.name)
      ? rsOptions.find((o) =>
          value.id ? o.value === value.id : o.label === value.name
        ) || null
      : null;

  const styles = {
    control: (base, state) => ({
      ...base,
      minHeight: 40,
      height: 40,
      background: "var(--panel-2)",
      borderColor: state.isFocused ? "var(--primary)" : "var(--border)",
      boxShadow: "none",
      borderRadius: 12,
      color: "var(--text)",
      ":hover": { borderColor: "var(--border)" },
    }),
    placeholder: (base) => ({ ...base, color: "var(--muted)" }),
    singleValue: (base) => ({ ...base, color: "var(--text)" }),
    input: (base) => ({ ...base, color: "var(--text)" }),
    menu: (base) => ({
      ...base,
      background: "var(--panel)",
      border: "1px solid " + "var(--border)",
      borderRadius: 12,
      zIndex: 60,
      overflow: "hidden",
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isFocused ? "var(--nav-item-hover-bg)" : "transparent",
      color: "var(--text)",
      cursor: "pointer",
    }),
    dropdownIndicator: (base) => ({ ...base, color: "var(--text)" }),
    clearIndicator: (base) => ({ ...base, color: "var(--muted)" }),
    menuPortal: (base) => ({ ...base, zIndex: 60 }),
  };

  return (
    <Select
      options={rsOptions}
      value={rsValue}
      // 🔁 devolvemos { id, name } o vacío
      onChange={(opt) =>
        onChange?.(
          opt?.value === "ALL" || !opt
            ? { id: "", name: "" }
            : { id: opt.value, name: opt.label }
        )
      }
      isClearable
      isDisabled={disabled}
      placeholder="— Selecciona —"
      styles={styles}
      menuPortalTarget={document.body}
    />
  );
}
