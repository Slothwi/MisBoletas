/**
 * Validadores centralizados
 */

/**
 * Valida que un email tenga formato correcto
 */
export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

/**
 * Valida que una contraseña cumpla requisitos mínimos
 */
export const validatePassword = (password: string): { valid: boolean; message?: string } => {
  if (!password || password.length < 6) {
    return { valid: false, message: 'La contraseña debe tener al menos 6 caracteres' };
  }
  return { valid: true };
};

/**
 * Valida que ambas contraseñas coincidan
 */
export const validatePasswordMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Valida que un nombre no esté vacío
 */
export const validateName = (name: string): boolean => {
  return name.trim().length > 0;
};
