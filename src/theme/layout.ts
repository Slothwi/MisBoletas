// ========================================================================
// INICIO: MOVER A /src/theme/layout.ts
// Contiene `containers` y `misc`.
// ========================================================================

import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';
import { borderRadius, shadows } from './foundations';


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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

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
    alignItems: 'flex-start',
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
// ========================================================================
// FIN: MOVER A /src/theme/layout.ts
// ========================================================================
