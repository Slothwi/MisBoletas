import { StyleSheet } from 'react-native';

/**
 * CENTRALIZED DESIGN SYSTEM
 * 
 * This file contains all shared styles, tokens, and component variants.
 * Use this instead of inline StyleSheet.create() in pages.
 * 
 * STRUCTURE:
 * - spacing: xs, sm, md, lg, xl, xxl (4-32px)
 * - colors: primary, danger, edit, text variants
 * - borderRadius: sm, md, lg, full
 * - shadows: sm, md, lg
 * - containers: page, centered, row, etc.
 * - cards: base, interactive, profile
 * - buttons: primary, small, secondary, danger, edit, disabled, fab
 * - text: Various typography variants (label, title, cardText, etc.)
 * - inputs: base, focused, disabled, error states
 * - states: Reusable state modifiers (disabled, focused, error)
 * - pickers: Dropdown/custom picker styles
 * - misc: Logos, indicators, dividers, etc.
 * 
 * USAGE EXAMPLES:
 * import AppStyles from '@/components/styles';
 * 
 * <View style={AppStyles.containers.page}>
 * <TouchableOpacity style={AppStyles.buttons.primary}>
 * <Text style={AppStyles.text.label}>Label</Text>
 * <ThemedTextInput style={AppStyles.inputs.base} />
 * <View style={[AppStyles.cards.base, AppStyles.states.disabled]} />
 */

// Design tokens
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const colors = {
  primary: '#e77573',
  primaryLight: '#f5f7fa',
  background: '#a8cbf0',
  backgroundLight: '#fff',
  textDark: '#222',
  textMuted: '#666',
  textLight: '#fff',
  border: '#ddd',
  shadow: '#000',
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  full: 999,
};

export const shadows = {
  sm: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOpacity: 0.1,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
};

// Reusable style variants
export const containers = StyleSheet.create({
  page: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.background,
    padding: spacing.lg,
    alignItems: 'center',
  },
  pageDark: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    padding: spacing.xl,
    alignItems: 'center',
  },
  scrollPage: {
    width: '100%',
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollPageContent: {
    width: '100%',
    paddingHorizontal: spacing.sm,
    paddingBottom: spacing.xl,
    alignItems: 'center',
  },
  pageContent: {
    padding: spacing.xl,
    alignItems: 'center',
  },
  scrollContent: {
    width: '100%',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  rowSpaceBetween: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  // CENTERED: Base for loading, empty states, centered layouts
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export const cards = StyleSheet.create({
  base: {
    width: '100%',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.md,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.sm,
  },
  interactive: {
    width: '100%',
    backgroundColor: colors.primaryLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.lg - 2,
    paddingHorizontal: spacing.lg - 4,
    borderRadius: borderRadius.md,
    marginBottom: spacing.sm,
    ...shadows.sm,
  },
  profile: {
    width: '100%',
    backgroundColor: colors.primaryLight,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    marginBottom: spacing.xxl,
    alignItems: 'center',
    ...shadows.md,
  },
});

export const buttons = StyleSheet.create({
  // PRIMARY: Main action button (red)
  primary: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.lg - 8,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  // SMALL: Compact button for forms (same padding structure, reduced size)
  small: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  // PRIMARY ROW: Button with icon + text (flex row)
  primaryRow: {
    backgroundColor: colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.lg - 8,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    width: '100%',
    gap: spacing.md,
    ...shadows.lg,
  },
  // SECONDARY: Outline button (white + border)
  secondary: {
    backgroundColor: colors.backgroundLight,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingVertical: spacing.lg - 8,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  // DANGER: Delete/destructive action (red danger color)
  danger: {
    backgroundColor: '#dc3545',
    paddingVertical: spacing.lg - 8,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  // EDIT: Edit action button (blue)
  edit: {
    backgroundColor: '#1b23fa',
    paddingVertical: spacing.lg - 8,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.lg,
  },
  // DISABLED: Disabled state (gray)
  disabled: {
    backgroundColor: '#ccc',
    paddingVertical: spacing.lg - 8,
    paddingHorizontal: spacing.xl,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.6,
  },
  // FAB: Floating Action Button (round, absolute position)
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

export const text = StyleSheet.create({
  // Existing variants
  profileName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.textDark,
    marginBottom: spacing.sm,
  },
  profileEmail: {
    fontSize: 16,
    color: colors.textMuted,
    fontStyle: 'italic',
  },
  cardText: {
    color: colors.textDark,
    fontSize: 18,
    fontWeight: '600',
  },
  buttonText: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: '600',
  },
  buttonTextSmall: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: '600',
  },
  youtubeLabel: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
    color: colors.textLight,
    marginTop: spacing.xl + spacing.lg,
    marginBottom: spacing.md,
  },
  // New variants for forms, details, and empty states
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  detailTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textDark,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textDark,
  },
  cardSubtitle: {
    fontSize: 14,
    color: colors.textMuted,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.lg,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
    marginTop: spacing.sm,
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
  },
  infoValue: {
    fontSize: 16,
    color: colors.textDark,
    textAlign: 'right',
    flex: 1,
  },
  helperText: {
    fontSize: 12,
    color: colors.textMuted,
    marginTop: spacing.xs,
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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.border,
    color: colors.textDark,
    marginTop: spacing.sm,
    marginBottom: spacing.sm,
  },
  focused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  disabled: {
    backgroundColor: '#f0f0f0',
    borderColor: '#ddd',
    color: colors.textMuted,
  },
  error: {
    borderColor: '#dc3545',
    borderWidth: 2,
  },
});

// COMPONENT STATES: Reusable state modifiers for any component
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

// PICKERS/DROPDOWNS: Custom dropdown/picker styles
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
    borderBottomColor: '#f0f0f0',
  },
  optionItemSelected: {
    backgroundColor: '#e3f2fd',
  },
  optionSelected: {
    backgroundColor: '#e3f2fd',
  },
  optionText: {
    fontSize: 16,
    color: colors.textDark,
  },
  optionTextSelected: {
    color: colors.primary,
    fontWeight: '600',
  },
});

// MISCELLANEOUS: Logos, images, indicators, etc.
export const misc = StyleSheet.create({
  logo: {
    width: 140,
    height: 140,
    borderRadius: borderRadius.full,
    resizeMode: 'cover',
    alignSelf: 'center',
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: colors.primaryLight,
    ...shadows.lg,
  },
  linkCard: {
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.xs,
    borderRadius: borderRadius.sm,
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
},
  colorIndicator: {
    width: 16,
    height: 16,
    borderRadius: 8,
    marginRight: spacing.sm,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.md,
  },
  loadingText: {
    marginTop: spacing.sm,
    fontSize: 16,
    color: colors.textMuted,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.lg,
    padding: spacing.sm,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },
});

// Export all as default object for convenience
const AppStyles = {
  spacing,
  colors,
  borderRadius,
  shadows,
  containers,
  cards,
  buttons,
  text,
  inputs,
  states,
  pickers,
  misc,
};

export default AppStyles;
