import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';
import { borderRadius, shadows } from './foundations';

export const cards = StyleSheet.create({
  base: {
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  interactive: {
    backgroundColor: colors.primaryLight,
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
    backgroundColor: colors.primaryLight,
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
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textDark,
  },
  focused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  disabled: {
    backgroundColor: colors.primaryLight,
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
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.md,
    justifyContent: 'center',
  },
  optionsContainer: {
    marginTop: spacing.sm,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: borderRadius.md,
    backgroundColor: colors.backgroundLight,
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
  },
  optionSelected: {
    backgroundColor: colors.secondary,
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