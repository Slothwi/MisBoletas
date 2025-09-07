import React from "react";

export default function Contacto() {
  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Contacto</h1>
      <p style={styles.text}>
        ¿Tienes dudas, sugerencias o necesitas ayuda? ¡Contáctanos!
      </p>
      <form style={styles.form}>
        <label style={styles.label}>
          Nombre
          <input type="text" name="nombre" style={styles.input} placeholder="Tu nombre" />
        </label>
        <label style={styles.label}>
          Correo electrónico
          <input type="email" name="email" style={styles.input} placeholder="tu@email.com" />
        </label>
        <label style={styles.label}>
          Mensaje
          <textarea name="mensaje" style={styles.textarea} placeholder="Escribe tu mensaje aquí..." />
        </label>
        <button type="submit" style={styles.button}>Enviar</button>
      </form>
      <div style={styles.info}>
        <p><strong>Email:</strong> contacto@misboletas.com</p>
        <p><strong>Teléfono:</strong> +56 9 1234 5678</p>
      </div>
    </div>
  );
}

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    maxWidth: 400,
    margin: "40px auto",
    padding: 24,
    background: "#fff",
    borderRadius: 12,
    boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
    fontFamily: "Space Mono, monospace",
  },
  title: {
    fontSize: 28,
    fontWeight: 700,
    marginBottom: 16,
    color: "#1976d2",
    fontFamily: "Space Mono, monospace",
  },
  text: {
    fontSize: 16,
    marginBottom: 24,
    color: "#333",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
    marginBottom: 24,
  },
  label: {
    fontWeight: 600,
    marginBottom: 4,
    color: "#222",
    fontFamily: "Space Mono, monospace",
  },
  input: {
    width: "100%",
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    marginTop: 4,
    fontSize: 16,
    fontFamily: "Space Mono, monospace",
  },
  textarea: {
    width: "100%",
    minHeight: 80,
    padding: "8px 12px",
    borderRadius: 6,
    border: "1px solid #ccc",
    marginTop: 4,
    fontSize: 16,
    fontFamily: "Space Mono, monospace",
    resize: "vertical",
  },
  button: {
    background: "#1976d2",
    color: "#fff",
    fontWeight: 700,
    fontSize: 16,
    border: "none",
    borderRadius: 6,
    padding: "10px 0",
    cursor: "pointer",
    fontFamily: "Space Mono, monospace",
    marginTop: 8,
  },
  info: {
    marginTop: 16,
    fontSize: 15,
    color: "#444",
    fontFamily: "Space Mono, monospace",
  },
};