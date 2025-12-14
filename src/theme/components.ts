import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';
import { borderRadius, shadows } from './foundations';

export const cards = StyleSheet.create({
  base: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  interactive: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  profile: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    alignItems: 'center',
    ...shadows.md,
  },
});

export const buttons = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    ...shadows.lg,
  },
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg - 8,
    paddingHorizontal: spacing.xl,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    ...shadows.lg,
  },
  small: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    marginTop: spacing.xs,
    marginBottom: spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    ...shadows.lg,
  },
  secondary: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.lg - 8,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    ...shadows.lg,
  },
  danger: {
    backgroundColor: colors.alert,
    paddingVertical: spacing.lg - 8,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    ...shadows.lg,
  },
  edit: {
    backgroundColor: colors.secondary,
    paddingVertical: spacing.lg - 8,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    ...shadows.lg,
  },
  disabled: {
    backgroundColor: '#ccc',
    paddingVertical: spacing.lg - 8,
    paddingHorizontal: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.md,
    opacity: 0.6,
  },
  fab: {
    position: 'absolute',
    bottom: spacing.xl,
    right: spacing.xl,
    backgroundColor: colors.primary,
    width: 60,
    height: 60,
    borderRadius: borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
});

export const inputs = StyleSheet.create({
  container: {
    marginBottom: spacing.lg,
  },
  base: {
    width: '100%',
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    fontSize: 16,
    borderWidth: 2,
    borderColor: colors.border,
    color: colors.textDark,
    fontWeight: '500',
  },
  focused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  disabled: {
    backgroundColor: '#f5f5f5',
    borderColor: '#ddd',
    color: colors.textMuted,
  },
  error: {
    borderColor: '#dc3545',
    borderWidth: 2,
  },
});

export const pickers = StyleSheet.create({
  base: {
    backgroundColor: '#ffffff',
    borderRadius: borderRadius.md,
    borderWidth: 2,
    borderColor: colors.primary,
    padding: spacing.md,
    justifyContent: 'center',
  },
  baseFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    backgroundColor: '#ffffff',
  },
  optionsContainer: {
    marginTop: spacing.sm,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: borderRadius.md,
    backgroundColor: '#ffffff',
    maxHeight: 200,
    elevation: 5,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    zIndex: 1000,
  },
  optionsScroll: {
    maxHeight: 200,
  },
  optionItem: {
    padding: spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    backgroundColor: 'transparent',
  },
  optionSelected: {
    backgroundColor: colors.primary,
    borderLeftWidth: 4,
    borderLeftColor: colors.primary,
    paddingLeft: spacing.md - 4,
  },
});

export const states = StyleSheet.create({
  disabled: {
    opacity: 0.6,
  },
  focused: {
    opacity: 1,
  },
  error: {
    borderColor: '#dc3545',
  },
});