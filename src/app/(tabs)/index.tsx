import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import {
    Image,
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

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=85';

const CORRECT_IMAGE =
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=900&q=85';

const CREATE_IMAGE =
  'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85';

const AURA_IMAGE =
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85';

type FeatureCardProps = {
  title: string;
  description: string;
  image: string;
  icon: keyof typeof Ionicons.glyphMap;
  action: string;
  onPress: () => void;
};

function FeatureCard({
  title,
  description,
  image,
  icon,
  action,
  onPress,
}: FeatureCardProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.featureCard,
        pressed && styles.pressed,
      ]}
    >
      {/* IMAGE */}
      <Image
        source={{ uri: image }}
        style={styles.featureImage}
      />

      {/* DARK GRADIENT-LIKE OVERLAY */}
      <View style={styles.featureOverlay} />

      {/* ICON */}
      <View style={styles.featureIcon}>
        <Ionicons
          name={icon}
          size={19}
          color={AuraColors.white}
        />
      </View>

      {/* ARROW */}
      <View style={styles.arrowCircle}>
        <Ionicons
          name="arrow-forward"
          size={17}
          color={AuraColors.navy}
        />
      </View>

      {/* CONTENT */}
      <View style={styles.featureContent}>
        <Text style={styles.featureTitle}>
          {title}
        </Text>

        <Text style={styles.featureDescription}>
          {description}
        </Text>

        <View style={styles.actionRow}>
          <Text style={styles.actionText}>
            {action}
          </Text>

          <Ionicons
            name="arrow-forward"
            size={15}
            color={AuraColors.white}
          />
        </View>
      </View>
    </Pressable>
  );
}

export default function HomeTab() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ================= HEADER ================= */}

        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              OUTFITAURA
            </Text>

            <Text style={styles.tagline}>
              Your style, made smarter.
            </Text>
          </View>

          <Pressable
            onPress={() => router.push('/profile')}
            style={styles.profileButton}
          >
            <Ionicons
              name="person-outline"
              size={21}
              color={AuraColors.navy}
            />
          </Pressable>
        </View>

        {/* ================= HERO ================= */}

        <View style={styles.heroCard}>
          <Image
            source={{ uri: HERO_IMAGE }}
            style={styles.heroImage}
          />

          <View style={styles.heroOverlay} />

          {/* AI BADGE */}
          <View style={styles.heroBadge}>
            <Ionicons
              name="sparkles"
              size={13}
              color={AuraColors.goldLight}
            />

            <Text style={styles.heroBadgeText}>
              AI STYLE ASSISTANT
            </Text>
          </View>

          {/* HERO TEXT */}
          <View style={styles.heroText}>
            <Text style={styles.heroTitle}>
              Dress with{'\n'}confidence.
            </Text>

            <Text style={styles.heroSubtitle}>
              Let your personal AI stylist
              {'\n'}
              make every outfit count.
            </Text>
          </View>

          {/* AURA SCORE */}
          <View style={styles.scoreCard}>
            <View style={styles.scoreIcon}>
              <Ionicons
                name="sparkles"
                size={15}
                color={AuraColors.gold}
              />
            </View>

            <View>
              <Text style={styles.scoreLabel}>
                AURA SCORE
              </Text>

              <Text style={styles.scoreValue}>
                9.4
              </Text>
            </View>
          </View>
        </View>

        {/* ================= MAIN SECTION ================= */}

        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionEyebrow}>
              YOUR STYLE ASSISTANT
            </Text>

            <Text style={styles.sectionTitle}>
              What can we do for you?
            </Text>
          </View>

          <View style={styles.sparkleCircle}>
            <Ionicons
              name="sparkles"
              size={17}
              color={AuraColors.purple}
            />
          </View>
        </View>

        {/* ================= CORRECT ================= */}

        <FeatureCard
          title="Correct My Outfit"
          description="Analyze your current look and make it better."
          action="Analyze my look"
          image={CORRECT_IMAGE}
          icon="scan-outline"
          onPress={() => router.push('/correct')}
        />

        {/* ================= CREATE ================= */}

        <FeatureCard
          title="Create My Outfit"
          description="Build a personalized look with AI."
          action="Create a look"
          image={CREATE_IMAGE}
          icon="color-wand-outline"
          onPress={() => router.push('/create')}
        />

        {/* ================= AURAMATCH ================= */}

        <FeatureCard
          title="AuraMatch"
          description="Discover what's missing from your style."
          action="Find my style gaps"
          image={AURA_IMAGE}
          icon="sparkles-outline"
          onPress={() => router.push('/auramatch')}
        />

        {/* ================= AI MESSAGE ================= */}

        <View style={styles.aiCard}>
          <View style={styles.aiIcon}>
            <Ionicons
              name="sparkles"
              size={19}
              color={AuraColors.white}
            />
          </View>

          <View style={styles.aiTextContainer}>
            <Text style={styles.aiTitle}>
              Your style. Your aura.
            </Text>

            <Text style={styles.aiSubtitle}>
              OutfitAura learns what makes you feel
              your best and helps you dress accordingly.
            </Text>
          </View>
        </View>

        {/* ================= FOOTER ================= */}

        <View style={styles.footer}>
          <Text style={styles.footerBrand}>
            OUTFITAURA
          </Text>

          <Text style={styles.footerTagline}>
            Your style, made smarter.
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

  /* ================= HEADER ================= */

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AuraSpacing.xl,
  },

  brand: {
    color: AuraColors.navy,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 2.2,
  },

  tagline: {
    color: AuraColors.textSecondary,
    fontSize: 12,
    marginTop: 3,
  },

  profileButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: AuraColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...AuraShadow.soft,
  },

  /* ================= HERO ================= */

  heroCard: {
    height: 390,
    borderRadius: AuraRadius.card,
    overflow: 'hidden',
    marginBottom: AuraSpacing.xxxl,
    backgroundColor: AuraColors.navy,
    ...AuraShadow.card,
  },

  heroImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  heroOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 22, 74, 0.38)',
  },

  heroBadge: {
    position: 'absolute',
    top: 18,
    left: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: AuraRadius.pill,
    backgroundColor: 'rgba(18, 22, 74, 0.78)',
    zIndex: 5,
  },

  heroBadgeText: {
    color: AuraColors.white,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },

  heroText: {
    position: 'absolute',
    left: 22,
    bottom: 30,
    zIndex: 10,
  },

  heroTitle: {
    color: AuraColors.white,
    fontSize: 37,
    lineHeight: 41,
    fontWeight: '800',
    letterSpacing: -0.7,
  },

  heroSubtitle: {
    color: 'rgba(255,255,255,0.88)',
    fontSize: 14,
    lineHeight: 21,
    marginTop: 10,
  },

  scoreCard: {
    position: 'absolute',
    right: 18,
    bottom: 18,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
    backgroundColor: AuraColors.white,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 17,
    ...AuraShadow.soft,
  },

  scoreIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: AuraColors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scoreLabel: {
    color: AuraColors.textMuted,
    fontSize: 8,
    fontWeight: '700',
    letterSpacing: 1,
  },

  scoreValue: {
    color: AuraColors.navy,
    fontSize: 19,
    fontWeight: '800',
    marginTop: 1,
  },

  /* ================= SECTION ================= */

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: AuraSpacing.lg,
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
    fontSize: 21,
    lineHeight: 27,
    fontWeight: '700',
  },

  sparkleCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ================= FEATURE CARDS ================= */

  featureCard: {
    height: 158,
    borderRadius: AuraRadius.card,
    overflow: 'hidden',
    marginBottom: AuraSpacing.md,
    backgroundColor: AuraColors.navy,
    ...AuraShadow.card,
  },

  featureImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
  },

  featureOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(18, 22, 74, 0.52)',
  },

  featureIcon: {
    position: 'absolute',
    top: 14,
    left: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(18,22,74,0.75)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  arrowCircle: {
    position: 'absolute',
    top: 14,
    right: 14,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: AuraColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  featureContent: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 14,
  },

  featureTitle: {
    color: AuraColors.white,
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 3,
  },

  featureDescription: {
    color: 'rgba(255,255,255,0.86)',
    fontSize: 12,
    lineHeight: 17,
    maxWidth: '78%',
  },

  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 7,
  },

  actionText: {
    color: AuraColors.white,
    fontSize: 12,
    fontWeight: '700',
  },

  /* ================= AI MESSAGE ================= */

  aiCard: {
    marginTop: AuraSpacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuraColors.navy,
    borderRadius: AuraRadius.large,
    padding: AuraSpacing.lg,
    gap: AuraSpacing.md,
  },

  aiIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: AuraColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  aiTextContainer: {
    flex: 1,
  },

  aiTitle: {
    color: AuraColors.white,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 4,
  },

  aiSubtitle: {
    color: 'rgba(255,255,255,0.72)',
    fontSize: 11,
    lineHeight: 17,
  },

  /* ================= FOOTER ================= */

  footer: {
    alignItems: 'center',
    marginTop: 32,
    paddingBottom: 10,
  },

  footerBrand: {
    color: AuraColors.navy,
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 2,
  },

  footerTagline: {
    color: AuraColors.textMuted,
    fontSize: 10,
    marginTop: 4,
  },

  pressed: {
    opacity: 0.92,
    transform: [{ scale: 0.995 }],
  },
});