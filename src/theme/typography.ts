import { StyleSheet } from 'react-native';
import { colors } from './colors';
import { spacing } from './spacing';

// ⚠️ Asegúrate de que diga "export const text", NO "export default"
export const text = StyleSheet.create({
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
  buttonTextColorless: {
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
  label: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.primary,
    marginTop: spacing.md,
    marginBottom: spacing.sm,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  detailTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.primary,
    textAlign: 'center',
    marginHorizontal: spacing.md,
    marginTop: spacing.sm,
    marginBottom: spacing.md,
    flexWrap: 'wrap',
    lineHeight: 32,
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
    color: colors.textMuted,
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