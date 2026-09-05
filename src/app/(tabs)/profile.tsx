import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    AuraColors,
    AuraRadius,
    AuraShadow,
    AuraSpacing,
} from '../../constants/auraTheme';

type SettingRowProps = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress?: () => void;
};

function SettingRow({
  icon,
  title,
  subtitle,
  onPress,
}: SettingRowProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.settingRow,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.settingIcon}>
        <Ionicons
          name={icon}
          size={19}
          color={AuraColors.purple}
        />
      </View>

      <View style={styles.settingText}>
        <Text style={styles.settingTitle}>
          {title}
        </Text>

        <Text style={styles.settingSubtitle}>
          {subtitle}
        </Text>
      </View>

      <Ionicons
        name="chevron-forward"
        size={17}
        color={AuraColors.textMuted}
      />
    </Pressable>
  );
}

function PreferencePill({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.preferencePill}>
      <Ionicons
        name={icon}
        size={14}
        color={AuraColors.purple}
      />

      <Text style={styles.preferenceText}>
        {text}
      </Text>
    </View>
  );
}

export default function ProfileScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              YOUR AURA
            </Text>

            <Text style={styles.title}>
              Profile
            </Text>

            <Text style={styles.subtitle}>
              Your personal style profile.
            </Text>
          </View>

          <Pressable style={styles.settingsButton}>
            <Ionicons
              name="settings-outline"
              size={20}
              color={AuraColors.navy}
            />
          </Pressable>
        </View>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Ionicons
              name="person"
              size={31}
              color={AuraColors.purple}
            />
          </View>

          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>
              Your Style Profile
            </Text>

            <Text style={styles.profileDescription}>
              Personalized for your unique style.
            </Text>

            <View style={styles.profileStatus}>
              <View style={styles.statusDot} />

              <Text style={styles.statusText}>
                Profile ready
              </Text>
            </View>
          </View>

          <Pressable style={styles.editButton}>
            <Ionicons
              name="create-outline"
              size={17}
              color={AuraColors.purple}
            />
          </Pressable>
        </View>

        {/* AURA SCORE */}
        <View style={styles.scoreCard}>
          <View style={styles.scoreHeader}>
            <View>
              <Text style={styles.scoreEyebrow}>
                OUTFITAURA AI
              </Text>

              <Text style={styles.scoreTitle}>
                Your Aura Score
              </Text>
            </View>

            <View style={styles.scoreValueContainer}>
              <Ionicons
                name="sparkles"
                size={15}
                color={AuraColors.gold}
              />

              <Text style={styles.scoreValue}>
                9.4
              </Text>
            </View>
          </View>

          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          <View style={styles.scoreBottom}>
            <Text style={styles.scoreDescription}>
              Your style profile is looking great.
            </Text>

            <Text style={styles.scorePercent}>
              94%
            </Text>
          </View>
        </View>

        {/* STYLE SNAPSHOT */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>
              YOUR STYLE
            </Text>

            <Text style={styles.sectionTitle}>
              Style Snapshot
            </Text>
          </View>
        </View>

        <View style={styles.snapshotCard}>
          <View style={styles.snapshotItem}>
            <View style={styles.snapshotIcon}>
              <Ionicons
                name="body-outline"
                size={18}
                color={AuraColors.purple}
              />
            </View>

            <Text style={styles.snapshotLabel}>
              Body Type
            </Text>

            <Text style={styles.snapshotValue}>
              Balanced
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.snapshotItem}>
            <View style={styles.snapshotIcon}>
              <Ionicons
                name="color-palette-outline"
                size={18}
                color={AuraColors.purple}
              />
            </View>

            <Text style={styles.snapshotLabel}>
              Skin Tone
            </Text>

            <Text style={styles.snapshotValue}>
              Warm
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.snapshotItem}>
            <View style={styles.snapshotIcon}>
              <Ionicons
                name="resize-outline"
                size={18}
                color={AuraColors.purple}
              />
            </View>

            <Text style={styles.snapshotLabel}>
              Height
            </Text>

            <Text style={styles.snapshotValue}>
              Your profile
            </Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.snapshotItem}>
            <View style={styles.snapshotIcon}>
              <Ionicons
                name="sparkles-outline"
                size={18}
                color={AuraColors.purple}
              />
            </View>

            <Text style={styles.snapshotLabel}>
              Style
            </Text>

            <Text style={styles.snapshotValue}>
              Modern
            </Text>
          </View>
        </View>

        {/* PREFERENCES */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>
              PERSONALIZATION
            </Text>

            <Text style={styles.sectionTitle}>
              Your Preferences
            </Text>
          </View>
        </View>

        <View style={styles.preferencesCard}>
          <View style={styles.preferenceSection}>
            <Text style={styles.preferenceHeading}>
              Preferred Colors
            </Text>

            <View style={styles.pillsRow}>
              <PreferencePill
                icon="color-palette-outline"
                text="Neutrals"
              />

              <PreferencePill
                icon="color-palette-outline"
                text="Black"
              />

              <PreferencePill
                icon="color-palette-outline"
                text="Purple"
              />
            </View>
          </View>

          <View style={styles.preferenceDivider} />

          <View style={styles.preferenceSection}>
            <Text style={styles.preferenceHeading}>
              Favorite Occasions
            </Text>

            <View style={styles.pillsRow}>
              <PreferencePill
                icon="school-outline"
                text="College"
              />

              <PreferencePill
                icon="cafe-outline"
                text="Casual"
              />

              <PreferencePill
                icon="heart-outline"
                text="Date Night"
              />
            </View>
          </View>

          <View style={styles.preferenceDivider} />

          <View style={styles.preferenceSection}>
            <Text style={styles.preferenceHeading}>
              Style Mood
            </Text>

            <View style={styles.pillsRow}>
              <PreferencePill
                icon="sparkles-outline"
                text="Modern"
              />

              <PreferencePill
                icon="star-outline"
                text="Minimal"
              />

              <PreferencePill
                icon="diamond-outline"
                text="Elegant"
              />
            </View>
          </View>
        </View>

        {/* OUTFITAURA SETTINGS */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>
              OUTFITAURA
            </Text>

            <Text style={styles.sectionTitle}>
              App Preferences
            </Text>
          </View>
        </View>

        <View style={styles.settingsCard}>
          <SettingRow
            icon="sparkles-outline"
            title="AI Style Preferences"
            subtitle="Customize how OutfitAura styles you"
          />

          <View style={styles.settingDivider} />

          <SettingRow
            icon="albums-outline"
            title="Collections"
            subtitle="Organize your favorite looks"
            onPress={() => router.push('/saved')}
          />

          <View style={styles.settingDivider} />

          <SettingRow
            icon="notifications-outline"
            title="Notifications"
            subtitle="Manage your OutfitAura alerts"
          />

          <View style={styles.settingDivider} />

          <SettingRow
            icon="information-circle-outline"
            title="About OutfitAura"
            subtitle="Your style, made smarter."
          />
        </View>

        {/* AI CARD */}
        <View style={styles.aiCard}>
          <View style={styles.aiIcon}>
            <Ionicons
              name="sparkles"
              size={20}
              color={AuraColors.white}
            />
          </View>

          <View style={styles.aiText}>
            <Text style={styles.aiTitle}>
              Your style is uniquely yours.
            </Text>

            <Text style={styles.aiSubtitle}>
              OutfitAura uses your preferences to
              create recommendations made for you.
            </Text>
          </View>
        </View>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>
            OUTFITAURA
          </Text>

          <Text style={styles.footerText}>
            Your style, made smarter.
          </Text>

          <Text style={styles.version}>
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AuraColors.background,
  },

  scrollContent: {
    paddingHorizontal: AuraSpacing.xl,
    paddingTop: AuraSpacing.md,
    paddingBottom: 120,
  },

  /* HEADER */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: AuraSpacing.xl,
  },

  eyebrow: {
    color: AuraColors.purple,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 5,
  },

  title: {
    color: AuraColors.navy,
    fontSize: 30,
    lineHeight: 35,
    fontWeight: '800',
  },

  subtitle: {
    color: AuraColors.textSecondary,
    fontSize: 12,
    marginTop: 5,
  },

  settingsButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AuraColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...AuraShadow.soft,
  },

  /* PROFILE */

  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuraColors.white,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    ...AuraShadow.card,
  },

  avatar: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: AuraSpacing.md,
  },

  profileInfo: {
    flex: 1,
  },

  profileName: {
    color: AuraColors.navy,
    fontSize: 16,
    fontWeight: '700',
  },

  profileDescription: {
    color: AuraColors.textSecondary,
    fontSize: 11,
    marginTop: 3,
  },

  profileStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  statusDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: AuraColors.success,
    marginRight: 5,
  },

  statusText: {
    color: AuraColors.success,
    fontSize: 10,
    fontWeight: '600',
  },

  editButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* SCORE */

  scoreCard: {
    backgroundColor: AuraColors.navy,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    marginTop: AuraSpacing.lg,
  },

  scoreHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  scoreEyebrow: {
    color: AuraColors.goldLight,
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 1.1,
    marginBottom: 4,
  },

  scoreTitle: {
    color: AuraColors.white,
    fontSize: 18,
    fontWeight: '700',
  },

  scoreValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  scoreValue: {
    color: AuraColors.white,
    fontSize: 27,
    fontWeight: '800',
  },

  progressTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.14)',
    marginTop: 17,
    overflow: 'hidden',
  },

  progressFill: {
    width: '94%',
    height: '100%',
    borderRadius: 4,
    backgroundColor: AuraColors.gold,
  },

  scoreBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
  },

  scoreDescription: {
    color: 'rgba(255,255,255,0.65)',
    fontSize: 10,
  },

  scorePercent: {
    color: AuraColors.goldLight,
    fontSize: 10,
    fontWeight: '700',
  },

  /* SECTIONS */

  sectionHeader: {
    marginTop: AuraSpacing.xxxl,
    marginBottom: AuraSpacing.md,
  },

  sectionEyebrow: {
    color: AuraColors.purple,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginBottom: 5,
  },

  sectionTitle: {
    color: AuraColors.text,
    fontSize: 20,
    fontWeight: '700',
  },

  /* SNAPSHOT */

  snapshotCard: {
    backgroundColor: AuraColors.white,
    borderRadius: AuraRadius.large,
    paddingVertical: AuraSpacing.lg,
    ...AuraShadow.soft,
  },

  snapshotItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: AuraSpacing.lg,
    minHeight: 49,
  },

  snapshotIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: AuraSpacing.md,
  },

  snapshotLabel: {
    flex: 1,
    color: AuraColors.textSecondary,
    fontSize: 12,
  },

  snapshotValue: {
    color: AuraColors.navy,
    fontSize: 12,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: AuraColors.borderLight,
    marginHorizontal: AuraSpacing.lg,
  },

  /* PREFERENCES */

  preferencesCard: {
    backgroundColor: AuraColors.white,
    borderRadius: AuraRadius.large,
    padding: AuraSpacing.lg,
    ...AuraShadow.soft,
  },

  preferenceSection: {
    paddingVertical: 3,
  },

  preferenceHeading: {
    color: AuraColors.navy,
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 10,
  },

  pillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },

  preferencePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.surfacePurple,
  },

  preferenceText: {
    color: AuraColors.navy,
    fontSize: 10,
    fontWeight: '600',
  },

  preferenceDivider: {
    height: 1,
    backgroundColor: AuraColors.borderLight,
    marginVertical: AuraSpacing.lg,
  },

  /* SETTINGS */

  settingsCard: {
    backgroundColor: AuraColors.white,
    borderRadius: AuraRadius.large,
    paddingHorizontal: AuraSpacing.lg,
    ...AuraShadow.soft,
  },

  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 70,
  },

  settingIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: AuraSpacing.md,
  },

  settingText: {
    flex: 1,
  },

  settingTitle: {
    color: AuraColors.navy,
    fontSize: 13,
    fontWeight: '700',
  },

  settingSubtitle: {
    color: AuraColors.textMuted,
    fontSize: 10,
    marginTop: 3,
  },

  settingDivider: {
    height: 1,
    backgroundColor: AuraColors.borderLight,
  },

  /* AI */

  aiCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuraColors.navy,
    borderRadius: AuraRadius.large,
    padding: AuraSpacing.lg,
    marginTop: AuraSpacing.xl,
  },

  aiIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: AuraColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: AuraSpacing.md,
  },

  aiText: {
    flex: 1,
  },

  aiTitle: {
    color: AuraColors.white,
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 3,
  },

  aiSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    lineHeight: 16,
  },

  /* FOOTER */

  footer: {
    alignItems: 'center',
    marginTop: 32,
  },

  footerBrand: {
    color: AuraColors.navy,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
  },

  footerText: {
    color: AuraColors.textMuted,
    fontSize: 10,
    marginTop: 4,
  },

  version: {
    color: AuraColors.textMuted,
    fontSize: 9,
    marginTop: 7,
  },

  pressed: {
    opacity: 0.85,
  },
});