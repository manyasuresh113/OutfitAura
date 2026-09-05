import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
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
    AuraTypography,
} from '../constants/auraTheme';

const SAVED_KEY = '@outfitaura_saved_looks';

const HERO_IMAGE =
  'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1000&q=85';

const LOOK_IMAGES = [
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85',
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=85',
];

type Step =
  | 'home'
  | 'analyzing'
  | 'gaps'
  | 'looks'
  | 'customize';

type Gap = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  reason: string;
  priority: 'High' | 'Medium';
};

type Look = {
  id: string;
  title: string;
  occasion: string;
  score: number;
  description: string;
  image: string;
  missingPiece: string;
  pieces: string[];
};

const gaps: Gap[] = [
  {
    icon: 'shirt-outline',
    title: 'Versatile Neutral Top',
    reason:
      'A clean neutral top would create more combinations with your existing bottoms.',
    priority: 'High',
  },
  {
    icon: 'footsteps-outline',
    title: 'Everyday Minimal Footwear',
    reason:
      'A versatile footwear option would connect your casual and smart-casual looks.',
    priority: 'High',
  },
  {
    icon: 'bag-handle-outline',
    title: 'Structured Everyday Bag',
    reason:
      'Your wardrobe would benefit from one polished bag that works across occasions.',
    priority: 'Medium',
  },
  {
    icon: 'sparkles-outline',
    title: 'Statement Accessory',
    reason:
      'A subtle statement piece would give your simpler outfits more personality.',
    priority: 'Medium',
  },
];

const recommendedLooks: Look[] = [
  {
    id: 'auramatch-1',
    title: 'Modern Everyday',
    occasion: 'College',
    score: 9.5,
    description:
      'A clean, effortless combination designed around versatile neutrals.',
    image: LOOK_IMAGES[0],
    missingPiece: 'Neutral Structured Top',
    pieces: [
      'Structured White Shirt',
      'Straight Black Trousers',
      'White Sneakers',
      'Structured Black Bag',
    ],
  },
  {
    id: 'auramatch-2',
    title: 'Polished Casual',
    occasion: 'Casual',
    score: 9.3,
    description:
      'A relaxed look with enough structure to feel intentional and put together.',
    image: LOOK_IMAGES[1],
    missingPiece: 'Minimal Everyday Footwear',
    pieces: [
      'Beige Relaxed Top',
      'Dark Denim',
      'Minimal Flats',
      'Neutral Shoulder Bag',
    ],
  },
  {
    id: 'auramatch-3',
    title: 'Soft Evening',
    occasion: 'Date Night',
    score: 9.6,
    description:
      'A refined combination that adds elegance without feeling overdressed.',
    image: LOOK_IMAGES[2],
    missingPiece: 'Statement Accessory',
    pieces: [
      'Black Fitted Top',
      'Beige Wide-Leg Pants',
      'Black Loafers',
      'Gold Minimal Jewelry',
    ],
  },
];

const customizationOptions = {
  top: [
    'Structured White Shirt',
    'Relaxed Beige Top',
    'Black Fitted Top',
  ],
  bottom: [
    'Straight Black Trousers',
    'Dark Denim',
    'Beige Wide-Leg Pants',
  ],
  footwear: [
    'White Sneakers',
    'Black Loafers',
    'Minimal Flats',
  ],
  bag: [
    'Structured Black Bag',
    'Neutral Shoulder Bag',
    'No Bag',
  ],
  accessories: [
    'Gold Minimal Jewelry',
    'Silver Minimal Jewelry',
    'No Accessories',
  ],
};

function Header({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}) {
  return (
    <View style={styles.header}>
      <Pressable
        onPress={onBack ?? (() => router.back())}
        style={styles.backButton}
      >
        <Ionicons
          name="arrow-back"
          size={21}
          color={AuraColors.navy}
        />
      </Pressable>

      <View style={styles.headerText}>
        <Text style={styles.headerTitle}>{title}</Text>

        {subtitle ? (
          <Text style={styles.headerSubtitle}>{subtitle}</Text>
        ) : null}
      </View>

      <View style={styles.headerSparkle}>
        <Ionicons
          name="sparkles"
          size={19}
          color={AuraColors.gold}
        />
      </View>
    </View>
  );
}

function PrimaryButton({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.primaryButton}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={19}
          color={AuraColors.white}
        />
      ) : null}

      <Text style={styles.primaryButtonText}>{title}</Text>

      <Ionicons
        name="arrow-forward"
        size={18}
        color={AuraColors.white}
      />
    </Pressable>
  );
}

function SecondaryButton({
  title,
  icon,
  onPress,
}: {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={styles.secondaryButton}
    >
      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={AuraColors.purple}
        />
      ) : null}

      <Text style={styles.secondaryButtonText}>
        {title}
      </Text>
    </Pressable>
  );
}

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow?: string;
  title: string;
}) {
  return (
    <View style={styles.sectionTitleWrap}>
      {eyebrow ? (
        <Text style={styles.sectionEyebrow}>
          {eyebrow}
        </Text>
      ) : null}

      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export default function AuraMatch() {
  const [step, setStep] = useState<Step>('home');
  const [progress, setProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState(
    'Scanning your wardrobe...'
  );

  const [selectedLook, setSelectedLook] =
    useState<Look | null>(null);

  const [customization, setCustomization] = useState({
    top: customizationOptions.top[0],
    bottom: customizationOptions.bottom[0],
    footwear: customizationOptions.footwear[0],
    bag: customizationOptions.bag[0],
    accessories: customizationOptions.accessories[0],
  });

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (step !== 'analyzing') return;

    setProgress(0);

    const stages = [
      'Scanning your wardrobe...',
      'Mapping your existing pieces...',
      'Checking outfit combinations...',
      'Finding style gaps...',
      'Comparing versatility...',
      'Preparing personalized matches...',
    ];

    let current = 0;

    const interval = setInterval(() => {
      current += 17;

      setProgress(Math.min(current, 100));

      const index = Math.min(
        Math.floor(current / 18),
        stages.length - 1
      );

      setAnalysisStage(stages[index]);

      if (current >= 100) {
        clearInterval(interval);

        setTimeout(() => {
          setStep('gaps');
        }, 500);
      }
    }, 600);

    return () => clearInterval(interval);
  }, [step]);

  const startAuraMatch = () => {
    setStep('analyzing');
  };

  const openLook = (look: Look) => {
    setSelectedLook(look);

    setCustomization({
      top:
        look.pieces[0] ??
        customizationOptions.top[0],
      bottom:
        look.pieces[1] ??
        customizationOptions.bottom[0],
      footwear:
        look.pieces[2] ??
        customizationOptions.footwear[0],
      bag:
        look.pieces[3] ??
        customizationOptions.bag[0],
      accessories:
        customizationOptions.accessories[0],
    });

    setSaved(false);
    setStep('customize');
  };

  const saveLook = async () => {
    try {
      const existing = await AsyncStorage.getItem(
        SAVED_KEY
      );

      const savedLooks = existing
        ? JSON.parse(existing)
        : [];

      const newLook = {
        id: `auramatch-${Date.now()}`,
        title:
          selectedLook?.title ??
          'AuraMatch Look',
        occasion:
          selectedLook?.occasion ??
          'Casual',
        score:
          selectedLook?.score ??
          9.4,
        image:
          selectedLook?.image ??
          HERO_IMAGE,
        source: 'auramatch',
        outfit: {
          top: customization.top,
          bottom: customization.bottom,
          footwear: customization.footwear,
          bag: customization.bag,
          accessories: customization.accessories,
        },
      };

      await AsyncStorage.setItem(
        SAVED_KEY,
        JSON.stringify([
          newLook,
          ...savedLooks,
        ])
      );

      setSaved(true);

      Alert.alert(
        'Look Saved ✨',
        'Your AuraMatch outfit has been added to Saved Looks.',
        [
          {
            text: 'View Saved',
            onPress: () => router.push('/saved'),
          },
          {
            text: 'Stay Here',
            style: 'cancel',
          },
        ]
      );
    } catch {
      Alert.alert(
        'Could not save',
        'Something went wrong while saving this look.'
      );
    }
  };

  const restart = () => {
    setStep('home');
    setSelectedLook(null);
    setProgress(0);
    setSaved(false);
  };

  /* =========================================================
     AURAMATCH HOME
  ========================================================= */

  if (step === 'home') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Header
            title="AuraMatch"
            subtitle="Discover what's missing"
          />

          <View style={styles.heroCard}>
            <Image
              source={{ uri: HERO_IMAGE }}
              style={styles.heroImage}
            />

            <View style={styles.heroOverlay} />

            <View style={styles.heroContent}>
              <View style={styles.heroPill}>
                <Ionicons
                  name="sparkles"
                  size={14}
                  color={AuraColors.goldLight}
                />

                <Text style={styles.heroPillText}>
                  AI STYLE GAP ANALYZER
                </Text>
              </View>

              <Text style={styles.heroTitle}>
                Your wardrobe has a story.
              </Text>

              <Text style={styles.heroSubtitle}>
                Let's find the pieces that can unlock more
                outfits from what you already own.
              </Text>
            </View>
          </View>

          <View style={styles.snapshotCard}>
            <View style={styles.snapshotHeader}>
              <View>
                <Text style={styles.snapshotEyebrow}>
                  YOUR STYLE SNAPSHOT
                </Text>

                <Text style={styles.snapshotTitle}>
                  Modern Minimal
                </Text>
              </View>

              <View style={styles.snapshotScore}>
                <Text style={styles.snapshotScoreValue}>
                  82
                </Text>

                <Text style={styles.snapshotScoreLabel}>
                  STYLE %
                </Text>
              </View>
            </View>

            <View style={styles.snapshotDivider} />

            <View style={styles.snapshotStats}>
              <View style={styles.snapshotStat}>
                <Ionicons
                  name="shirt-outline"
                  size={20}
                  color={AuraColors.purple}
                />

                <Text style={styles.snapshotStatValue}>
                  6
                </Text>

                <Text style={styles.snapshotStatLabel}>
                  Pieces
                </Text>
              </View>

              <View style={styles.snapshotStat}>
                <Ionicons
                  name="color-palette-outline"
                  size={20}
                  color={AuraColors.purple}
                />

                <Text style={styles.snapshotStatValue}>
                  4
                </Text>

                <Text style={styles.snapshotStatLabel}>
                  Core Colors
                </Text>
              </View>

              <View style={styles.snapshotStat}>
                <Ionicons
                  name="layers-outline"
                  size={20}
                  color={AuraColors.purple}
                />

                <Text style={styles.snapshotStatValue}>
                  12
                </Text>

                <Text style={styles.snapshotStatLabel}>
                  Combos
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.explanation}>
            <SectionTitle
              eyebrow="HOW IT WORKS"
              title="We don't just recommend more clothes."
            />

            <Text style={styles.explanationText}>
              AuraMatch looks at what you already have and
              identifies the missing essentials that could
              create the biggest difference.
            </Text>

            <View style={styles.processRow}>
              <View style={styles.processItem}>
                <View style={styles.processIcon}>
                  <Text style={styles.processNumber}>
                    01
                  </Text>
                </View>

                <Text style={styles.processText}>
                  Analyze
                </Text>
              </View>

              <View style={styles.processLine} />

              <View style={styles.processItem}>
                <View style={styles.processIcon}>
                  <Text style={styles.processNumber}>
                    02
                  </Text>
                </View>

                <Text style={styles.processText}>
                  Find Gaps
                </Text>
              </View>

              <View style={styles.processLine} />

              <View style={styles.processItem}>
                <View style={styles.processIcon}>
                  <Text style={styles.processNumber}>
                    03
                  </Text>
                </View>

                <Text style={styles.processText}>
                  Match
                </Text>
              </View>
            </View>
          </View>

          <PrimaryButton
            title="Analyze My Wardrobe"
            icon="sparkles-outline"
            onPress={startAuraMatch}
          />

          <Text style={styles.disclaimer}>
            AuraMatch uses your wardrobe and style preferences
            to create personalized recommendations.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /* =========================================================
     ANALYZING
  ========================================================= */

  if (step === 'analyzing') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Header
            title="AuraMatch AI"
            subtitle="Analyzing your style"
            onBack={() => setStep('home')}
          />

          <View style={styles.analysisHero}>
            <Image
              source={{ uri: HERO_IMAGE }}
              style={styles.analysisHeroImage}
            />

            <View style={styles.analysisHeroOverlay} />

            <View style={styles.analysisOrb}>
              <Ionicons
                name="sparkles"
                size={31}
                color={AuraColors.goldLight}
              />
            </View>

            <Text style={styles.analysisHeroText}>
              Finding the missing pieces
            </Text>
          </View>

          <View style={styles.progressCard}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>
                {analysisStage}
              </Text>

              <Text style={styles.progressValue}>
                {progress}%
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${progress}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.analysisChecklist}>
            {[
              [
                'Wardrobe inventory',
                progress >= 17,
              ],
              [
                'Style preferences',
                progress >= 34,
              ],
              [
                'Combination potential',
                progress >= 51,
              ],
              [
                'Style gaps',
                progress >= 68,
              ],
              [
                'Versatility score',
                progress >= 85,
              ],
              [
                'AuraMatch recommendations',
                progress >= 100,
              ],
            ].map(([label, done]) => (
              <View
                key={label as string}
                style={styles.checkRow}
              >
                <View
                  style={[
                    styles.checkIcon,
                    done && styles.checkIconDone,
                  ]}
                >
                  <Ionicons
                    name={
                      done
                        ? 'checkmark'
                        : 'ellipse-outline'
                    }
                    size={15}
                    color={
                      done
                        ? AuraColors.white
                        : AuraColors.purple
                    }
                  />
                </View>

                <Text
                  style={[
                    styles.checkText,
                    done && styles.checkTextDone,
                  ]}
                >
                  {label as string}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.aiTip}>
            <Ionicons
              name="bulb-outline"
              size={20}
              color={AuraColors.gold}
            />

            <Text style={styles.aiTipText}>
              The goal isn't to buy everything. It's to find
              the few pieces that unlock the most combinations.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /* =========================================================
     STYLE GAPS
  ========================================================= */

  if (step === 'gaps') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Header
            title="Your Style Gaps"
            subtitle="Here's what your wardrobe is missing"
            onBack={() => setStep('home')}
          />

          <View style={styles.gapScoreCard}>
            <View>
              <Text style={styles.gapScoreEyebrow}>
                WARDROBE COVERAGE
              </Text>

              <Text style={styles.gapScoreTitle}>
                You're at 78%
              </Text>

              <Text style={styles.gapScoreDescription}>
                Your wardrobe has a strong base. A few strategic
                additions could unlock much more.
              </Text>
            </View>

            <View style={styles.gapCircle}>
              <Text style={styles.gapCircleValue}>
                78
              </Text>

              <Text style={styles.gapCircleLabel}>
                %
              </Text>
            </View>
          </View>

          <View style={styles.goodAtCard}>
            <View style={styles.goodAtIcon}>
              <Ionicons
                name="checkmark-circle"
                size={22}
                color={AuraColors.success}
              />
            </View>

            <View style={styles.goodAtContent}>
              <Text style={styles.goodAtTitle}>
                Your wardrobe already does well
              </Text>

              <Text style={styles.goodAtText}>
                Neutrals, casual outfits, and modern minimal
                styling are already strong areas.
              </Text>
            </View>
          </View>

          <SectionTitle
            eyebrow="MISSING ESSENTIALS"
            title="The pieces that unlock more"
          />

          <View style={styles.gapList}>
            {gaps.map((gap, index) => (
              <View
                key={gap.title}
                style={styles.gapCard}
              >
                <View style={styles.gapNumber}>
                  <Text style={styles.gapNumberText}>
                    {index + 1}
                  </Text>
                </View>

                <View style={styles.gapIcon}>
                  <Ionicons
                    name={gap.icon}
                    size={21}
                    color={AuraColors.purple}
                  />
                </View>

                <View style={styles.gapContent}>
                  <View style={styles.gapTitleRow}>
                    <Text style={styles.gapTitle}>
                      {gap.title}
                    </Text>

                    <View
                      style={[
                        styles.priorityPill,
                        gap.priority === 'High'
                          ? styles.priorityHigh
                          : styles.priorityMedium,
                      ]}
                    >
                      <Text
                        style={[
                          styles.priorityText,
                          gap.priority === 'High'
                            ? styles.priorityTextHigh
                            : styles.priorityTextMedium,
                        ]}
                      >
                        {gap.priority}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.gapReason}>
                    {gap.reason}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.gapInsight}>
            <Ionicons
              name="sparkles"
              size={21}
              color={AuraColors.gold}
            />

            <View style={styles.gapInsightContent}>
              <Text style={styles.gapInsightTitle}>
                AuraMatch insight
              </Text>

              <Text style={styles.gapInsightText}>
                Adding just the first two high-priority pieces
                could create several new outfit combinations.
              </Text>
            </View>
          </View>

          <PrimaryButton
            title="Show My Matches"
            icon="sparkles-outline"
            onPress={() => setStep('looks')}
          />

          <SecondaryButton
            title="Analyze Again"
            icon="refresh-outline"
            onPress={() => setStep('analyzing')}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  /* =========================================================
     RECOMMENDED LOOKS
  ========================================================= */

  if (step === 'looks') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Header
            title="Your AuraMatches"
            subtitle="Looks built around your style gaps"
            onBack={() => setStep('gaps')}
          />

          <View style={styles.matchesIntro}>
            <View style={styles.matchesPill}>
              <Ionicons
                name="sparkles"
                size={14}
                color={AuraColors.gold}
              />

              <Text style={styles.matchesPillText}>
                PERSONALIZED FOR YOU
              </Text>
            </View>

            <Text style={styles.matchesTitle}>
              More outfits.
              {'\n'}Same wardrobe.
            </Text>

            <Text style={styles.matchesDescription}>
              Each match uses your current style and one or
              more of the missing essentials identified by AI.
            </Text>
          </View>

          <View style={styles.filterRow}>
            {['All', 'College', 'Casual', 'Date Night'].map(
              (filter, index) => (
                <View
                  key={filter}
                  style={[
                    styles.filterChip,
                    index === 0 &&
                      styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterText,
                      index === 0 &&
                        styles.filterTextActive,
                    ]}
                  >
                    {filter}
                  </Text>
                </View>
              )
            )}
          </View>

          <View style={styles.lookList}>
            {recommendedLooks.map((look, index) => (
              <View
                key={look.id}
                style={styles.lookCard}
              >
                <View style={styles.lookImageWrap}>
                  <Image
                    source={{ uri: look.image }}
                    style={styles.lookImage}
                  />

                  <View style={styles.lookOccasion}>
                    <Text style={styles.lookOccasionText}>
                      {look.occasion}
                    </Text>
                  </View>

                  <View style={styles.lookScore}>
                    <Ionicons
                      name="sparkles"
                      size={13}
                      color={AuraColors.gold}
                    />

                    <Text style={styles.lookScoreText}>
                      {look.score}
                    </Text>
                  </View>
                </View>

                <View style={styles.lookContent}>
                  <View style={styles.lookTitleRow}>
                    <View style={styles.lookTitleWrap}>
                      <Text style={styles.lookTitle}>
                        {look.title}
                      </Text>

                      <Text style={styles.lookDescription}>
                        {look.description}
                      </Text>
                    </View>

                    <View style={styles.lookIndex}>
                      <Text style={styles.lookIndexText}>
                        0{index + 1}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.matchReason}>
                    <Ionicons
                      name="add-circle-outline"
                      size={16}
                      color={AuraColors.purple}
                    />

                    <Text style={styles.matchReasonText}>
                      Adds: {look.missingPiece}
                    </Text>
                  </View>

                  <View style={styles.pieceRow}>
                    {look.pieces.map((piece) => (
                      <View
                        key={piece}
                        style={styles.pieceChip}
                      >
                        <Text style={styles.pieceText}>
                          {piece}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <Pressable
                    style={styles.buildButton}
                    onPress={() => openLook(look)}
                  >
                    <Text style={styles.buildButtonText}>
                      Build This Look
                    </Text>

                    <Ionicons
                      name="arrow-forward"
                      size={17}
                      color={AuraColors.white}
                    />
                  </Pressable>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.shopNote}>
            <Ionicons
              name="information-circle-outline"
              size={19}
              color={AuraColors.purple}
            />

            <Text style={styles.shopNoteText}>
              AuraMatch focuses on wardrobe gaps first, so
              recommendations are intentionally versatile rather
              than trend-heavy.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /* =========================================================
     CUSTOMIZE
  ========================================================= */

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header
          title="Customize Match"
          subtitle="Make this AuraMatch yours"
          onBack={() => setStep('looks')}
        />

        <View style={styles.customizeHero}>
          <Image
            source={{
              uri:
                selectedLook?.image ??
                HERO_IMAGE,
            }}
            style={styles.customizeImage}
          />

          <View style={styles.customizeOverlay} />

          <View style={styles.customizeHeroContent}>
            <View style={styles.customizePill}>
              <Ionicons
                name="sparkles"
                size={13}
                color={AuraColors.goldLight}
              />

              <Text style={styles.customizePillText}>
                AURAMATCH
              </Text>
            </View>

            <Text style={styles.customizeTitle}>
              {selectedLook?.title ??
                'Your matched look'}
            </Text>

            <Text style={styles.customizeSubtitle}>
              Keep the styling direction or switch individual
              pieces to suit your preferences.
            </Text>
          </View>
        </View>

        <SectionTitle
          eyebrow="PERSONALIZE"
          title="Choose your pieces"
        />

        {(
          Object.keys(
            customizationOptions
          ) as Array<
            keyof typeof customizationOptions
          >
        ).map((category) => {
          const categoryTitle =
            category === 'top'
              ? 'Top'
              : category === 'bottom'
              ? 'Bottom'
              : category === 'footwear'
              ? 'Footwear'
              : category === 'bag'
              ? 'Bag'
              : 'Accessories';

          return (
            <View
              key={category}
              style={styles.customizationSection}
            >
              <View style={styles.customizationHeader}>
                <Text style={styles.customizationTitle}>
                  {categoryTitle}
                </Text>

                <Ionicons
                  name={
                    category === 'top'
                      ? 'shirt-outline'
                      : category === 'bottom'
                      ? 'layers-outline'
                      : category === 'footwear'
                      ? 'footsteps-outline'
                      : category === 'bag'
                      ? 'bag-handle-outline'
                      : 'sparkles-outline'
                  }
                  size={18}
                  color={AuraColors.purple}
                />
              </View>

              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={
                  styles.optionScroll
                }
              >
                {customizationOptions[
                  category
                ].map((option) => {
                  const active =
                    customization[category] ===
                    option;

                  return (
                    <Pressable
                      key={option}
                      onPress={() =>
                        setCustomization(
                          (previous) => ({
                            ...previous,
                            [category]: option,
                          })
                        )
                      }
                      style={[
                        styles.customOption,
                        active &&
                          styles.customOptionActive,
                      ]}
                    >
                      {active ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={AuraColors.white}
                        />
                      ) : null}

                      <Text
                        style={[
                          styles.customOptionText,
                          active &&
                            styles.customOptionTextActive,
                        ]}
                      >
                        {option}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          );
        })}

        <View style={styles.finalLookCard}>
          <View style={styles.finalLookHeader}>
            <View>
              <Text style={styles.finalLookEyebrow}>
                YOUR FINAL MATCH
              </Text>

              <Text style={styles.finalLookTitle}>
                {selectedLook?.title ??
                  'AuraMatch Look'}
              </Text>
            </View>

            <View style={styles.finalScore}>
              <Ionicons
                name="sparkles"
                size={14}
                color={AuraColors.gold}
              />

              <Text style={styles.finalScoreText}>
                {selectedLook?.score ?? 9.4}
              </Text>
            </View>
          </View>

          <View style={styles.finalDivider} />

          {[
            ['Top', customization.top],
            ['Bottom', customization.bottom],
            ['Footwear', customization.footwear],
            ['Bag', customization.bag],
            ['Accessories', customization.accessories],
          ].map(([label, value]) => (
            <View
              key={label}
              style={styles.finalRow}
            >
              <Text style={styles.finalLabel}>
                {label}
              </Text>

              <Text style={styles.finalValue}>
                {value}
              </Text>
            </View>
          ))}
        </View>

        <PrimaryButton
          title="Save AuraMatch Look"
          icon={
            saved
              ? 'checkmark-circle'
              : 'heart-outline'
          }
          onPress={saveLook}
        />

        <SecondaryButton
          title="Choose Another Match"
          icon="sparkles-outline"
          onPress={() => setStep('looks')}
        />

        <SecondaryButton
          title="Start AuraMatch Again"
          icon="refresh-outline"
          onPress={restart}
        />

        <Text style={styles.disclaimer}>
          Your saved AuraMatch look will appear in Saved Looks
          alongside your other OutfitAura creations.
        </Text>
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
    paddingBottom: 45,
  },

  /* HEADER */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: AuraSpacing.xl,
  },

  backButton: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: AuraColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...AuraShadow.soft,
  },

  headerText: {
    flex: 1,
    marginLeft: AuraSpacing.md,
  },

  headerTitle: {
    ...AuraTypography.heading,
    color: AuraColors.navy,
  },

  headerSubtitle: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    marginTop: 2,
  },

  headerSparkle: {
    width: 42,
    height: 42,
    borderRadius: 15,
    backgroundColor: AuraColors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* HERO */

  heroCard: {
    height: 430,
    borderRadius: AuraRadius.card,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: AuraColors.navy,
    ...AuraShadow.card,
  },

  heroImage: {
    width: '100%',
    height: '100%',
  },

  heroOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(18,22,74,0.45)',
  },

  heroContent: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 22,
  },

  heroPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18,22,74,0.86)',
    borderRadius: AuraRadius.pill,
    paddingHorizontal: 11,
    paddingVertical: 7,
    marginBottom: 11,
  },

  heroPillText: {
    ...AuraTypography.label,
    color: AuraColors.goldLight,
    marginLeft: 5,
  },

  heroTitle: {
    ...AuraTypography.title,
    color: AuraColors.white,
  },

  heroSubtitle: {
    ...AuraTypography.body,
    color: '#E9E7F1',
    marginTop: 6,
    maxWidth: 330,
  },

  /* SNAPSHOT */

  snapshotCard: {
    backgroundColor: AuraColors.navy,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    marginTop: AuraSpacing.lg,
  },

  snapshotHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  snapshotEyebrow: {
    ...AuraTypography.label,
    color: AuraColors.goldLight,
  },

  snapshotTitle: {
    ...AuraTypography.subheading,
    color: AuraColors.white,
    marginTop: 3,
  },

  snapshotScore: {
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  snapshotScoreValue: {
    fontSize: 22,
    fontWeight: '700',
    color: AuraColors.white,
  },

  snapshotScoreLabel: {
    ...AuraTypography.label,
    fontSize: 9,
    color: AuraColors.goldLight,
    marginTop: 1,
  },

  snapshotDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginVertical: AuraSpacing.lg,
  },

  snapshotStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  snapshotStat: {
    alignItems: 'center',
    flex: 1,
  },

  snapshotStatValue: {
    fontSize: 18,
    fontWeight: '700',
    color: AuraColors.white,
    marginTop: 6,
  },

  snapshotStatLabel: {
    ...AuraTypography.small,
    color: '#C8C5D7',
    marginTop: 1,
    textAlign: 'center',
  },

  /* EXPLANATION */

  explanation: {
    marginTop: AuraSpacing.xxxl,
  },

  explanationText: {
    ...AuraTypography.bodyLarge,
    color: AuraColors.textSecondary,
    marginBottom: AuraSpacing.lg,
  },

  processRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  processItem: {
    alignItems: 'center',
  },

  processIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  processNumber: {
    fontSize: 12,
    fontWeight: '700',
    color: AuraColors.purple,
  },

  processText: {
    ...AuraTypography.small,
    color: AuraColors.navy,
    marginTop: 6,
    fontWeight: '600',
  },

  processLine: {
    height: 1,
    flex: 1,
    backgroundColor: AuraColors.border,
    marginHorizontal: 7,
    marginBottom: 24,
  },

  /* SECTION */

  sectionTitleWrap: {
    marginBottom: AuraSpacing.md,
  },

  sectionEyebrow: {
    ...AuraTypography.label,
    color: AuraColors.purple,
    marginBottom: 5,
  },

  sectionTitle: {
    ...AuraTypography.heading,
    color: AuraColors.navy,
  },

  /* BUTTONS */

  primaryButton: {
    minHeight: 58,
    backgroundColor: AuraColors.purple,
    borderRadius: AuraRadius.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: AuraSpacing.lg,
    gap: 9,
    marginTop: AuraSpacing.xl,
    ...AuraShadow.floating,
  },

  primaryButtonText: {
    ...AuraTypography.button,
    color: AuraColors.white,
    flex: 1,
    textAlign: 'center',
  },

  secondaryButton: {
    minHeight: 52,
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.medium,
    borderWidth: 1,
    borderColor: AuraColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: AuraSpacing.lg,
    gap: 8,
    marginTop: AuraSpacing.sm,
  },

  secondaryButtonText: {
    ...AuraTypography.button,
    color: AuraColors.purple,
  },

  disclaimer: {
    ...AuraTypography.small,
    color: AuraColors.textMuted,
    textAlign: 'center',
    marginTop: AuraSpacing.lg,
    paddingHorizontal: AuraSpacing.md,
  },

  /* ANALYSIS */

  analysisHero: {
    height: 400,
    borderRadius: AuraRadius.card,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: AuraColors.navy,
    ...AuraShadow.card,
  },

  analysisHeroImage: {
    width: '100%',
    height: '100%',
  },

  analysisHeroOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(18,22,74,0.58)',
  },

  analysisOrb: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: AuraColors.goldLight,
    backgroundColor: 'rgba(18,22,74,0.80)',
    alignSelf: 'center',
    top: 145,
    alignItems: 'center',
    justifyContent: 'center',
  },

  analysisHeroText: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    textAlign: 'center',
    ...AuraTypography.subheading,
    color: AuraColors.white,
  },

  progressCard: {
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    borderWidth: 1,
    borderColor: AuraColors.border,
    marginTop: AuraSpacing.xl,
  },

  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },

  progressTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.navy,
    flex: 1,
  },

  progressValue: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.purple,
  },

  progressTrack: {
    height: 8,
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.surfacePurple,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.purple,
  },

  analysisChecklist: {
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    borderWidth: 1,
    borderColor: AuraColors.border,
    marginTop: AuraSpacing.lg,
  },

  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: AuraColors.borderLight,
  },

  checkIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  checkIconDone: {
    backgroundColor: AuraColors.purple,
  },

  checkText: {
    ...AuraTypography.body,
    color: AuraColors.textSecondary,
  },

  checkTextDone: {
    color: AuraColors.navy,
    fontWeight: '500',
  },

  aiTip: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: AuraColors.goldSoft,
    borderRadius: AuraRadius.medium,
    padding: AuraSpacing.md,
    marginTop: AuraSpacing.lg,
  },

  aiTipText: {
    ...AuraTypography.small,
    color: AuraColors.navy,
    flex: 1,
    marginLeft: 9,
  },

  /* GAPS */

  gapScoreCard: {
    backgroundColor: AuraColors.navy,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },

  gapScoreEyebrow: {
    ...AuraTypography.label,
    color: AuraColors.goldLight,
  },

  gapScoreTitle: {
    ...AuraTypography.title,
    color: AuraColors.white,
    marginTop: 4,
  },

  gapScoreDescription: {
    ...AuraTypography.small,
    color: '#D8D5E5',
    marginTop: 4,
    maxWidth: 245,
  },

  gapCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    borderWidth: 6,
    borderColor: AuraColors.goldLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },

  gapCircleValue: {
    fontSize: 23,
    fontWeight: '700',
    color: AuraColors.white,
  },

  gapCircleLabel: {
    ...AuraTypography.small,
    color: AuraColors.goldLight,
  },

  goodAtCard: {
    flexDirection: 'row',
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    marginTop: AuraSpacing.lg,
    marginBottom: AuraSpacing.xxxl,
  },

  goodAtIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: '#EDF6F0',
    alignItems: 'center',
    justifyContent: 'center',
  },

  goodAtContent: {
    flex: 1,
    marginLeft: 11,
  },

  goodAtTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.navy,
  },

  goodAtText: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    marginTop: 3,
  },

  gapList: {
    gap: 10,
  },

  gapCard: {
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    borderRadius: AuraRadius.medium,
    padding: AuraSpacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },

  gapNumber: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: AuraColors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },

  gapNumberText: {
    ...AuraTypography.small,
    color: AuraColors.white,
    fontWeight: '700',
  },

  gapIcon: {
    width: 43,
    height: 43,
    borderRadius: 13,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 9,
    marginRight: 10,
  },

  gapContent: {
    flex: 1,
  },

  gapTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  gapTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.navy,
    flex: 1,
  },

  priorityPill: {
    paddingHorizontal: 7,
    paddingVertical: 4,
    borderRadius: AuraRadius.pill,
    marginLeft: 5,
  },

  priorityHigh: {
    backgroundColor: '#F9E9E9',
  },

  priorityMedium: {
    backgroundColor: AuraColors.goldSoft,
  },

  priorityText: {
    ...AuraTypography.label,
    fontSize: 9,
  },

  priorityTextHigh: {
    color: AuraColors.error,
  },

  priorityTextMedium: {
    color: AuraColors.warning,
  },

  gapReason: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    marginTop: 4,
  },

  gapInsight: {
    flexDirection: 'row',
    backgroundColor: AuraColors.surfacePurple,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    marginTop: AuraSpacing.xl,
  },

  gapInsightContent: {
    flex: 1,
    marginLeft: 10,
  },

  gapInsightTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.navy,
  },

  gapInsightText: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    marginTop: 3,
  },

  /* MATCHES */

  matchesIntro: {
    marginBottom: AuraSpacing.lg,
  },

  matchesPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuraColors.goldSoft,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: AuraRadius.pill,
    marginBottom: 10,
  },

  matchesPillText: {
    ...AuraTypography.label,
    color: AuraColors.navy,
    marginLeft: 5,
  },

  matchesTitle: {
    ...AuraTypography.title,
    color: AuraColors.navy,
  },

  matchesDescription: {
    ...AuraTypography.body,
    color: AuraColors.textSecondary,
    marginTop: 6,
  },

  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: AuraSpacing.lg,
  },

  filterChip: {
    borderWidth: 1,
    borderColor: AuraColors.border,
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },

  filterChipActive: {
    backgroundColor: AuraColors.purple,
    borderColor: AuraColors.purple,
  },

  filterText: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
  },

  filterTextActive: {
    color: AuraColors.white,
    fontWeight: '600',
  },

  lookList: {
    gap: 16,
  },

  lookCard: {
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AuraColors.border,
    ...AuraShadow.card,
  },

  lookImageWrap: {
    height: 320,
    position: 'relative',
  },

  lookImage: {
    width: '100%',
    height: '100%',
  },

  lookOccasion: {
    position: 'absolute',
    top: 13,
    left: 13,
    backgroundColor: 'rgba(18,22,74,0.84)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: AuraRadius.pill,
  },

  lookOccasionText: {
    ...AuraTypography.label,
    color: AuraColors.white,
    fontSize: 10,
  },

  lookScore: {
    position: 'absolute',
    top: 13,
    right: 13,
    backgroundColor: AuraColors.white,
    borderRadius: AuraRadius.pill,
    paddingHorizontal: 9,
    paddingVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
  },

  lookScoreText: {
    ...AuraTypography.small,
    color: AuraColors.navy,
    fontWeight: '700',
    marginLeft: 4,
  },

  lookContent: {
    padding: AuraSpacing.lg,
  },

  lookTitleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  lookTitleWrap: {
    flex: 1,
  },

  lookTitle: {
    ...AuraTypography.heading,
    color: AuraColors.navy,
  },

  lookDescription: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    marginTop: 3,
  },

  lookIndex: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  lookIndexText: {
    ...AuraTypography.small,
    color: AuraColors.purple,
    fontWeight: '700',
  },

  matchReason: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: AuraSpacing.md,
  },

  matchReasonText: {
    ...AuraTypography.small,
    color: AuraColors.purple,
    fontWeight: '600',
    marginLeft: 5,
  },

  pieceRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 11,
  },

  pieceChip: {
    backgroundColor: AuraColors.surfaceSoft,
    borderRadius: AuraRadius.pill,
    paddingHorizontal: 9,
    paddingVertical: 6,
  },

  pieceText: {
    ...AuraTypography.small,
    fontSize: 11,
    color: AuraColors.textSecondary,
  },

  buildButton: {
    minHeight: 48,
    backgroundColor: AuraColors.purple,
    borderRadius: AuraRadius.medium,
    marginTop: AuraSpacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
    gap: 7,
  },

  buildButtonText: {
    ...AuraTypography.button,
    color: AuraColors.white,
    flex: 1,
    textAlign: 'center',
  },

  shopNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: AuraColors.surfacePurple,
    borderRadius: AuraRadius.medium,
    padding: AuraSpacing.md,
    marginTop: AuraSpacing.xl,
  },

  shopNoteText: {
    ...AuraTypography.small,
    color: AuraColors.navy,
    flex: 1,
    marginLeft: 8,
  },

  /* CUSTOMIZE */

  customizeHero: {
    height: 400,
    borderRadius: AuraRadius.card,
    overflow: 'hidden',
    position: 'relative',
    marginBottom: AuraSpacing.xl,
  },

  customizeImage: {
    width: '100%',
    height: '100%',
  },

  customizeOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(18,22,74,0.40)',
  },

  customizeHeroContent: {
    position: 'absolute',
    left: 19,
    right: 19,
    bottom: 20,
  },

  customizePill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18,22,74,0.84)',
    borderRadius: AuraRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 8,
  },

  customizePillText: {
    ...AuraTypography.label,
    color: AuraColors.goldLight,
    marginLeft: 5,
  },

  customizeTitle: {
    ...AuraTypography.title,
    color: AuraColors.white,
  },

  customizeSubtitle: {
    ...AuraTypography.body,
    color: '#E9E7F1',
    marginTop: 5,
  },

  customizationSection: {
    marginBottom: AuraSpacing.lg,
  },

  customizationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  customizationTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.navy,
  },

  optionScroll: {
    gap: 8,
  },

  customOption: {
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    borderRadius: AuraRadius.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  customOptionActive: {
    backgroundColor: AuraColors.purple,
    borderColor: AuraColors.purple,
  },

  customOptionText: {
    ...AuraTypography.small,
    color: AuraColors.navy,
  },

  customOptionTextActive: {
    color: AuraColors.white,
    fontWeight: '600',
  },

  finalLookCard: {
    backgroundColor: AuraColors.navy,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    marginTop: AuraSpacing.md,
  },

  finalLookHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  finalLookEyebrow: {
    ...AuraTypography.label,
    color: AuraColors.goldLight,
  },

  finalLookTitle: {
    ...AuraTypography.subheading,
    color: AuraColors.white,
    marginTop: 3,
  },

  finalScore: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.10)',
    borderRadius: AuraRadius.pill,
    paddingHorizontal: 9,
    paddingVertical: 7,
  },

  finalScoreText: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.white,
    marginLeft: 4,
  },

  finalDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginVertical: AuraSpacing.md,
  },

  finalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  finalLabel: {
    ...AuraTypography.small,
    color: '#BDB9CE',
    width: 85,
  },

  finalValue: {
    ...AuraTypography.small,
    color: AuraColors.white,
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
});