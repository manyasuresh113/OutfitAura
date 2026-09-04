import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  AuraColors,
  AuraRadius,
  AuraShadow,
  AuraSpacing,
  AuraTypography,
} from '../constants/auraTheme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>OUTFITAURA</Text>

            <Text style={styles.greeting}>
              Your style, made smarter.
            </Text>
          </View>

          <TouchableOpacity style={styles.profileButton}>
            <Ionicons
              name="person-outline"
              size={20}
              color={AuraColors.navy}
            />
          </TouchableOpacity>
        </View>

        {/* Hero */}
        <View style={styles.heroCard}>
          <Image
            source={{
              uri: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=85',
            }}
            style={styles.heroImage}
          />

          <View style={styles.heroOverlay} />

          <View style={styles.heroContent}>
            <View style={styles.aiBadge}>
              <Ionicons
                name="sparkles"
                size={14}
                color={AuraColors.goldLight}
              />

              <Text style={styles.aiBadgeText}>
                AI STYLE ASSISTANT
              </Text>
            </View>

            <Text style={styles.heroTitle}>
              Dress with confidence.
            </Text>

            <Text style={styles.heroDescription}>
              Create, correct and discover looks that feel like you.
            </Text>

            <View style={styles.scoreBadge}>
              <Ionicons
                name="sparkles"
                size={14}
                color={AuraColors.gold}
              />

              <Text style={styles.scoreText}>
                Aura Score
              </Text>

              <Text style={styles.scoreValue}>
                9.4
              </Text>
            </View>
          </View>
        </View>

        {/* Main Features */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>
              What are we styling today?
            </Text>

            <Text style={styles.sectionSubtitle}>
              Choose your style journey
            </Text>
          </View>
        </View>

        {/* Correct */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.primaryFeature}
          onPress={() => router.push('/correct')}
        >
          <View style={styles.featureIconPurple}>
            <Ionicons
              name="scan-outline"
              size={25}
              color={AuraColors.purple}
            />
          </View>

          <View style={styles.featureText}>
            <View style={styles.featureTitleRow}>
              <Text style={styles.featureTitle}>
                Correct My Outfit
              </Text>

              <View style={styles.aiMiniBadge}>
                <Text style={styles.aiMiniText}>AI</Text>
              </View>
            </View>

            <Text style={styles.featureDescription}>
              Upload your outfit and get intelligent styling
              corrections.
            </Text>

            <View style={styles.featureAction}>
              <Text style={styles.featureActionText}>
                Analyze my look
              </Text>

              <Ionicons
                name="arrow-forward"
                size={16}
                color={AuraColors.purple}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Create */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.primaryFeature}
          onPress={() => router.push('/create')}
        >
          <View style={styles.featureIconGold}>
            <Ionicons
              name="sparkles-outline"
              size={25}
              color={AuraColors.gold}
            />
          </View>

          <View style={styles.featureText}>
            <View style={styles.featureTitleRow}>
              <Text style={styles.featureTitle}>
                Create My Outfit
              </Text>

              <View style={styles.aiMiniBadgeGold}>
                <Text style={styles.aiMiniTextGold}>AI</Text>
              </View>
            </View>

            <Text style={styles.featureDescription}>
              Build a personalized outfit around your occasion,
              style and preferences.
            </Text>

            <View style={styles.featureAction}>
              <Text style={styles.featureActionText}>
                Create a look
              </Text>

              <Ionicons
                name="arrow-forward"
                size={16}
                color={AuraColors.purple}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* AuraMatch */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={styles.auraMatchCard}
          onPress={() => router.push('/auramatch')}
        >
          <View style={styles.auraMatchGlow}>
            <Ionicons
              name="flash"
              size={26}
              color={AuraColors.gold}
            />
          </View>

          <View style={styles.auraMatchContent}>
            <View style={styles.auraMatchTitleRow}>
              <Text style={styles.auraMatchTitle}>
                AuraMatch
              </Text>

              <View style={styles.newBadge}>
                <Text style={styles.newBadgeText}>
                  SMART
                </Text>
              </View>
            </View>

            <Text style={styles.auraMatchSubtitle}>
              Discover what's missing from your style.
            </Text>

            <Text style={styles.auraMatchDescription}>
              AI analyzes your wardrobe and identifies style
              gaps, missing essentials and new outfit possibilities.
            </Text>

            <View style={styles.auraMatchAction}>
              <Text style={styles.auraMatchActionText}>
                Find my style gaps
              </Text>

              <Ionicons
                name="arrow-forward"
                size={17}
                color={AuraColors.goldLight}
              />
            </View>
          </View>
        </TouchableOpacity>

        {/* Quick Access */}
        <View style={styles.quickHeader}>
          <Text style={styles.sectionTitle}>
            Quick access
          </Text>
        </View>

        <View style={styles.quickGrid}>
          <QuickCard
            icon="shirt-outline"
            title="Wardrobe"
            subtitle="My closet"
            onPress={() => router.push('/wardrobe')}
          />

          <QuickCard
            icon="heart-outline"
            title="Saved"
            subtitle="Favorite looks"
            onPress={() => router.push('/saved')}
          />

          <QuickCard
            icon="albums-outline"
            title="Collections"
            subtitle="My lookbooks"
            onPress={() => {}}
          />
        </View>

        {/* Bottom Brand */}
        <View style={styles.footer}>
          <View style={styles.footerSparkles}>
            <Ionicons
              name="sparkles"
              size={13}
              color={AuraColors.gold}
            />

            <Text style={styles.footerBrand}>
              OUTFITAURA
            </Text>

            <Ionicons
              name="sparkles"
              size={13}
              color={AuraColors.gold}
            />
          </View>

          <Text style={styles.footerTagline}>
            Your style, made smarter.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

/* Quick Card */

function QuickCard({
  icon,
  title,
  subtitle,
  onPress,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      style={styles.quickCard}
      onPress={onPress}
    >
      <View style={styles.quickIcon}>
        <Ionicons
          name={icon}
          size={21}
          color={AuraColors.purple}
        />
      </View>

      <Text style={styles.quickTitle}>
        {title}
      </Text>

      <Text style={styles.quickSubtitle}>
        {subtitle}
      </Text>

      <Ionicons
        name="chevron-forward"
        size={16}
        color={AuraColors.textMuted}
        style={styles.quickArrow}
      />
    </TouchableOpacity>
  );
}

/* Styles */

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AuraColors.background,
  },

  container: {
    paddingHorizontal: AuraSpacing.lg,
    paddingBottom: 50,
  },

  /* Header */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: AuraSpacing.sm,
    paddingBottom: AuraSpacing.xl,
  },

  brand: {
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 2.1,
    color: AuraColors.navy,
  },

  greeting: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    marginTop: 4,
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AuraColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...AuraShadow.soft,
  },

  /* Hero */

  heroCard: {
    height: 355,
    borderRadius: AuraRadius.card,
    overflow: 'hidden',
    backgroundColor: AuraColors.navy,
    ...AuraShadow.card,
  },

  heroImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },

  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 19, 47, 0.52)',
  },

  heroContent: {
    flex: 1,
    justifyContent: 'flex-end',
    padding: AuraSpacing.xl,
  },

  aiBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 22, 74, 0.78)',
    borderWidth: 1,
    borderColor: 'rgba(230, 201, 141, 0.45)',
    borderRadius: AuraRadius.pill,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginBottom: AuraSpacing.md,
  },

  aiBadgeText: {
    ...AuraTypography.label,
    color: AuraColors.goldLight,
    marginLeft: 6,
    letterSpacing: 0.8,
  },

  heroTitle: {
    ...AuraTypography.display,
    color: AuraColors.white,
    maxWidth: 300,
  },

  heroDescription: {
    ...AuraTypography.body,
    color: '#E8E6F0',
    marginTop: 8,
    maxWidth: 320,
  },

  scoreBadge: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuraColors.white,
    borderRadius: AuraRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginTop: AuraSpacing.lg,
  },

  scoreText: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    marginLeft: 6,
  },

  scoreValue: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.navy,
    marginLeft: 5,
  },

  /* Section */

  sectionHeader: {
    marginTop: AuraSpacing.xxxl,
    marginBottom: AuraSpacing.md,
  },

  sectionTitle: {
    ...AuraTypography.heading,
    color: AuraColors.navy,
  },

  sectionSubtitle: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    marginTop: 3,
  },

  /* Features */

  primaryFeature: {
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    flexDirection: 'row',
    marginBottom: AuraSpacing.md,
    borderWidth: 1,
    borderColor: AuraColors.borderLight,
    ...AuraShadow.soft,
  },

  featureIconPurple: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  featureIconGold: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: AuraColors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  featureText: {
    flex: 1,
    marginLeft: AuraSpacing.md,
  },

  featureTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  featureTitle: {
    ...AuraTypography.subheading,
    color: AuraColors.navy,
  },

  aiMiniBadge: {
    backgroundColor: AuraColors.surfacePurple,
    borderRadius: AuraRadius.pill,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginLeft: 7,
  },

  aiMiniText: {
    fontSize: 9,
    fontWeight: '800',
    color: AuraColors.purple,
    letterSpacing: 0.5,
  },

  aiMiniBadgeGold: {
    backgroundColor: AuraColors.goldSoft,
    borderRadius: AuraRadius.pill,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginLeft: 7,
  },

  aiMiniTextGold: {
    fontSize: 9,
    fontWeight: '800',
    color: AuraColors.gold,
    letterSpacing: 0.5,
  },

  featureDescription: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    lineHeight: 19,
    marginTop: 5,
  },

  featureAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },

  featureActionText: {
    ...AuraTypography.small,
    color: AuraColors.purple,
    fontWeight: '600',
    marginRight: 6,
  },

  /* AuraMatch */

  auraMatchCard: {
    backgroundColor: AuraColors.navy,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    flexDirection: 'row',
    overflow: 'hidden',
    ...AuraShadow.floating,
  },

  auraMatchGlow: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: 'rgba(201, 154, 74, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  auraMatchContent: {
    flex: 1,
    marginLeft: AuraSpacing.md,
  },

  auraMatchTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  auraMatchTitle: {
    ...AuraTypography.subheading,
    color: AuraColors.white,
  },

  newBadge: {
    backgroundColor: AuraColors.gold,
    borderRadius: AuraRadius.pill,
    paddingHorizontal: 7,
    paddingVertical: 3,
    marginLeft: 8,
  },

  newBadgeText: {
    fontSize: 8,
    fontWeight: '800',
    color: AuraColors.navy,
    letterSpacing: 0.7,
  },

  auraMatchSubtitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.goldLight,
    marginTop: 4,
  },

  auraMatchDescription: {
    ...AuraTypography.small,
    color: '#C9C7D7',
    lineHeight: 19,
    marginTop: 6,
  },

  auraMatchAction: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 11,
  },

  auraMatchActionText: {
    ...AuraTypography.small,
    color: AuraColors.goldLight,
    fontWeight: '600',
    marginRight: 6,
  },

  /* Quick */

  quickHeader: {
    marginTop: AuraSpacing.xxxl,
    marginBottom: AuraSpacing.md,
  },

  quickGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  quickCard: {
    width: '31.5%',
    minHeight: 126,
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.large,
    padding: AuraSpacing.md,
    ...AuraShadow.soft,
  },

  quickIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  quickTitle: {
    ...AuraTypography.small,
    color: AuraColors.text,
    fontWeight: '600',
  },

  quickSubtitle: {
    fontSize: 11,
    lineHeight: 15,
    color: AuraColors.textMuted,
    marginTop: 2,
  },

  quickArrow: {
    position: 'absolute',
    right: 10,
    bottom: 10,
  },

  /* Footer */

  footer: {
    alignItems: 'center',
    paddingTop: 38,
  },

  footerSparkles: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  footerBrand: {
    fontSize: 14,
    fontWeight: '800',
    letterSpacing: 1.8,
    color: AuraColors.navy,
    marginHorizontal: 8,
  },

  footerTagline: {
    ...AuraTypography.small,
    color: AuraColors.textMuted,
    marginTop: 5,
  },
});