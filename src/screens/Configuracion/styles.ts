import { StyleSheet } from 'react-native';
import { spacing, colors, borderRadius, shadows } from '@/src/theme';

export const styles = StyleSheet.create({
  // Contenedor principal del Scroll
  scrollView: {
    width: '100%',
    flex: 1,
  },
  
  // Sección de las tarjetas de menú
  cardsSection: {
    width: '100%',
    gap: spacing.lg,          // Reemplaza 16px
    marginBottom: spacing.xxl, // Reemplaza 32px
  },

  // Estilo específico para la tarjeta de perfil
  profileCard: {
    width: '100%',            // Para que ocupe todo el ancho
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    alignItems: 'center',
    ...shadows.md,            // Usamos las sombras globales
  },

  // Botón de Youtube (específico de esta pantalla)
  youtubeContainer: {
    width: '100%', 
    alignItems: 'center',
    marginTop: spacing.xl,
  },
  youtubeButton: {
    backgroundColor: '#FF0000', // Color de marca Youtube
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadows.sm,
  },

  // Tus columnas (por si las usas para un layout de grilla)
  twoColumnContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: spacing.md,
  },
  column: {
    flex: 1, // Ocupa el 50% disponible
  },
});