import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    Image,
    ImageSourcePropType,
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

const DEMO_IMAGE =
  'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=900&q=85';

const IMPROVED_IMAGE =
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85';

type Step =
  | 'upload'
  | 'analyzing'
  | 'results'
  | 'improved'
  | 'customize';

type AnalysisItem = {
  title: string;
  score: number;
  icon: keyof typeof Ionicons.glyphMap;
  comment: string;
};

type Recommendation = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
};

const analysisItems: AnalysisItem[] = [
  {
    title: 'Color Coordination',
    score: 82,
    icon: 'color-palette-outline',
    comment:
      'The overall palette works, but a more complementary accent would create better harmony.',
  },
  {
    title: 'Clothing Combination',
    score: 76,
    icon: 'shirt-outline',
    comment:
      'The core pieces work together, although the proportions can be balanced more effectively.',
  },
  {
    title: 'Style Compatibility',
    score: 88,
    icon: 'sparkles-outline',
    comment:
      'The outfit has a cohesive modern-casual direction with room for a stronger finishing touch.',
  },
  {
    title: 'Overall Appearance',
    score: 84,
    icon: 'eye-outline',
    comment:
      'The look is clean and wearable, but a few styling changes can make it feel more intentional.',
  },
  {
    title: 'Outfit Balance',
    score: 79,
    icon: 'scale-outline',
    comment:
      'The visual weight can be balanced by refining the top-to-bottom combination.',
  },
  {
    title: 'Proportions',
    score: 74,
    icon: 'resize-outline',
    comment:
      'A slightly more structured silhouette would improve the overall proportions.',
  },
  {
    title: 'Occasion Suitability',
    score: 86,
    icon: 'calendar-outline',
    comment:
      'The outfit is versatile and can work well for casual college and social settings.',
  },
];

const recommendations: Recommendation[] = [
  {
    icon: 'shirt-outline',
    title: 'Refine the top',
    description:
      'Try a more structured or slightly fitted top to create a cleaner silhouette.',
  },
  {
    icon: 'color-palette-outline',
    title: 'Improve color harmony',
    description:
      'Introduce one complementary neutral or subtle accent instead of adding another strong color.',
  },
  {
    icon: 'footsteps-outline',
    title: 'Switch the footwear',
    description:
      'Clean white sneakers or a minimal neutral pair would make the outfit feel more polished.',
  },
  {
    icon: 'bag-handle-outline',
    title: 'Add one finishing accessory',
    description:
      'A structured bag or minimal accessory can complete the look without making it busy.',
  },
];

const improvementChanges = [
  'More balanced top and bottom proportions',
  'Cleaner complementary color palette',
  'More suitable footwear',
  'Minimal finishing accessory',
  'More polished overall appearance',
];

const customizationOptions = {
  top: ['Structured White Shirt', 'Relaxed Beige Top', 'Black Fitted Top'],
  bottom: ['Straight Black Trousers', 'Dark Denim', 'Beige Wide-Leg Pants'],
  footwear: ['White Sneakers', 'Black Loafers', 'Minimal Flats'],
  bag: ['Structured Black Bag', 'Neutral Shoulder Bag', 'No Bag'],
  accessories: ['Gold Minimal Jewelry', 'Silver Minimal Jewelry', 'No Accessories'],
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
  disabled = false,
}: {
  title: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  disabled?: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.primaryButton,
        disabled && styles.primaryButtonDisabled,
      ]}
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
    <Pressable onPress={onPress} style={styles.secondaryButton}>
      {icon ? (
        <Ionicons
          name={icon}
          size={18}
          color={AuraColors.purple}
        />
      ) : null}

      <Text style={styles.secondaryButtonText}>{title}</Text>
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
        <Text style={styles.sectionEyebrow}>{eyebrow}</Text>
      ) : null}

      <Text style={styles.sectionTitle}>{title}</Text>
    </View>
  );
}

export default function CorrectMyOutfit() {
  const [step, setStep] = useState<Step>('upload');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState(
    'Preparing your outfit analysis...'
  );

  const [customization, setCustomization] = useState({
    top: customizationOptions.top[0],
    bottom: customizationOptions.bottom[0],
    footwear: customizationOptions.footwear[0],
    bag: customizationOptions.bag[0],
    accessories: customizationOptions.accessories[0],
  });

  const [rating, setRating] = useState(0);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (step !== 'analyzing') return;

    setAnalysisProgress(0);

    const stages = [
      'Detecting clothing pieces...',
      'Checking color coordination...',
      'Analyzing clothing combination...',
      'Evaluating style compatibility...',
      'Checking outfit balance and proportions...',
      'Evaluating occasion suitability...',
      'Preparing personalized recommendations...',
    ];

    let progress = 0;

    const interval = setInterval(() => {
      progress += 14;

      setAnalysisProgress(Math.min(progress, 100));

      const stageIndex = Math.min(
        Math.floor(progress / 15),
        stages.length - 1
      );

      setAnalysisStage(stages[stageIndex]);

      if (progress >= 100) {
        clearInterval(interval);

        setTimeout(() => {
          setStep('results');
        }, 500);
      }
    }, 550);

    return () => clearInterval(interval);
  }, [step]);

  const pickImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Gallery Permission',
        'Please allow gallery access to choose your outfit photo.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.9,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const takePhoto = async () => {
    const permission =
      await ImagePicker.requestCameraPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Camera Permission',
        'Please allow camera access to photograph your outfit.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [3, 4],
      quality: 0.9,
    });

    if (!result.canceled && result.assets.length > 0) {
      setImageUri(result.assets[0].uri);
    }
  };

  const useDemoOutfit = () => {
    setImageUri(DEMO_IMAGE);
  };

  const startAnalysis = () => {
    if (!imageUri) {
      Alert.alert(
        'Add Your Outfit',
        'Upload or photograph an outfit first.'
      );
      return;
    }

    setStep('analyzing');
  };

  const saveLook = async () => {
    try {
      const existing = await AsyncStorage.getItem(SAVED_KEY);

      const savedLooks = existing ? JSON.parse(existing) : [];

      const newLook = {
        id: `corrected-${Date.now()}`,
        title: 'Aura Corrected Look',
        occasion: 'Casual',
        score: 9.5,
        image: IMPROVED_IMAGE,
        source: 'correct-my-outfit',
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
        JSON.stringify([newLook, ...savedLooks])
      );

      setSaved(true);

      Alert.alert(
        'Look Saved ✨',
        'Your corrected outfit has been added to Saved Looks.',
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
    } catch (error) {
      Alert.alert(
        'Could not save',
        'Something went wrong while saving this look.'
      );
    }
  };

  const resetFlow = () => {
    setStep('upload');
    setImageUri(null);
    setAnalysisProgress(0);
    setAnalysisStage('Preparing your outfit analysis...');
    setRating(0);
    setSaved(false);
  };

  const imageSource: ImageSourcePropType | undefined = imageUri
    ? { uri: imageUri }
    : undefined;

  /* ---------------------------------------------------------
     UPLOAD SCREEN
  --------------------------------------------------------- */

  if (step === 'upload') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Header
            title="Correct My Outfit"
            subtitle="Let AI improve your current look"
          />

          <View style={styles.intro}>
            <View style={styles.aiPill}>
              <Ionicons
                name="sparkles"
                size={14}
                color={AuraColors.gold}
              />
              <Text style={styles.aiPillText}>
                AI OUTFIT ANALYZER
              </Text>
            </View>

            <Text style={styles.pageTitle}>
              Already have an outfit?
            </Text>

            <Text style={styles.pageSubtitle}>
              Upload your look and let OutfitAura identify what works,
              what doesn't, and how to make it better.
            </Text>
          </View>

          <View style={styles.uploadCard}>
            {imageUri ? (
              <View style={styles.previewContainer}>
                <Image
                  source={imageSource}
                  style={styles.uploadPreview}
                />

                <View style={styles.previewOverlay} />

                <Pressable
                  style={styles.changePhotoButton}
                  onPress={() => setImageUri(null)}
                >
                  <Ionicons
                    name="refresh"
                    size={16}
                    color={AuraColors.white}
                  />
                  <Text style={styles.changePhotoText}>
                    Change
                  </Text>
                </Pressable>

                <View style={styles.photoReadyBadge}>
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={AuraColors.white}
                  />
                  <Text style={styles.photoReadyText}>
                    Outfit ready
                  </Text>
                </View>
              </View>
            ) : (
              <>
                <View style={styles.uploadIcon}>
                  <Ionicons
                    name="sparkles-outline"
                    size={32}
                    color={AuraColors.purple}
                  />
                </View>

                <Text style={styles.uploadTitle}>
                  Add your outfit
                </Text>

                <Text style={styles.uploadDescription}>
                  Use a clear full-outfit photo for the best analysis.
                </Text>

                <View style={styles.uploadActions}>
                  <Pressable
                    style={styles.uploadAction}
                    onPress={takePhoto}
                  >
                    <View style={styles.uploadActionIcon}>
                      <Ionicons
                        name="camera-outline"
                        size={22}
                        color={AuraColors.purple}
                      />
                    </View>

                    <Text style={styles.uploadActionTitle}>
                      Take Photo
                    </Text>

                    <Text style={styles.uploadActionSubtitle}>
                      Camera
                    </Text>
                  </Pressable>

                  <Pressable
                    style={styles.uploadAction}
                    onPress={pickImage}
                  >
                    <View style={styles.uploadActionIcon}>
                      <Ionicons
                        name="images-outline"
                        size={22}
                        color={AuraColors.purple}
                      />
                    </View>

                    <Text style={styles.uploadActionTitle}>
                      Gallery
                    </Text>

                    <Text style={styles.uploadActionSubtitle}>
                      Choose photo
                    </Text>
                  </Pressable>
                </View>
              </>
            )}
          </View>

          {!imageUri ? (
            <Pressable
              style={styles.demoButton}
              onPress={useDemoOutfit}
            >
              <Ionicons
                name="flask-outline"
                size={18}
                color={AuraColors.purple}
              />

              <View style={styles.demoTextWrap}>
                <Text style={styles.demoTitle}>
                  Try a demo outfit
                </Text>

                <Text style={styles.demoSubtitle}>
                  Perfect for your project review
                </Text>
              </View>

              <Ionicons
                name="arrow-forward"
                size={18}
                color={AuraColors.purple}
              />
            </Pressable>
          ) : null}

          <View style={styles.whatWeAnalyze}>
            <SectionTitle
              eyebrow="WHAT OUTFITAURA CHECKS"
              title="Your outfit, from every angle."
            />

            <View style={styles.analysisPreviewGrid}>
              {[
                ['color-palette-outline', 'Colors'],
                ['shirt-outline', 'Combination'],
                ['sparkles-outline', 'Style'],
                ['scale-outline', 'Balance'],
                ['resize-outline', 'Proportions'],
                ['calendar-outline', 'Occasion'],
              ].map(([icon, label]) => (
                <View
                  key={label}
                  style={styles.analysisPreviewItem}
                >
                  <Ionicons
                    name={
                      icon as keyof typeof Ionicons.glyphMap
                    }
                    size={19}
                    color={AuraColors.purple}
                  />
                  <Text style={styles.analysisPreviewText}>
                    {label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <PrimaryButton
            title="Analyze My Outfit"
            icon="scan-outline"
            onPress={startAnalysis}
            disabled={!imageUri}
          />

          <Text style={styles.disclaimer}>
            AI analysis is designed to provide styling guidance and
            personalized suggestions.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /* ---------------------------------------------------------
     ANALYZING SCREEN
  --------------------------------------------------------- */

  if (step === 'analyzing') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Header
            title="Analyzing Outfit"
            subtitle="OutfitAura AI is reviewing your look"
            onBack={() => setStep('upload')}
          />

          <View style={styles.analysisHero}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.analysisImage}
              />
            ) : null}

            <View style={styles.analysisImageOverlay} />

            <View style={styles.scanRing}>
              <View style={styles.scanInner}>
                <Ionicons
                  name="sparkles"
                  size={30}
                  color={AuraColors.goldLight}
                />
              </View>
            </View>

            <View style={styles.analyzingLabel}>
              <Text style={styles.analyzingLabelText}>
                AI ANALYSIS IN PROGRESS
              </Text>
            </View>
          </View>

          <View style={styles.progressSection}>
            <View style={styles.progressHeader}>
              <Text style={styles.progressTitle}>
                {analysisStage}
              </Text>

              <Text style={styles.progressValue}>
                {analysisProgress}%
              </Text>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${analysisProgress}%`,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.analysisStages}>
            {[
              {
                title: 'Color coordination',
                icon: 'color-palette-outline',
                done: analysisProgress >= 28,
              },
              {
                title: 'Clothing combination',
                icon: 'shirt-outline',
                done: analysisProgress >= 42,
              },
              {
                title: 'Style compatibility',
                icon: 'sparkles-outline',
                done: analysisProgress >= 56,
              },
              {
                title: 'Balance & proportions',
                icon: 'scale-outline',
                done: analysisProgress >= 70,
              },
              {
                title: 'Occasion suitability',
                icon: 'calendar-outline',
                done: analysisProgress >= 84,
              },
              {
                title: 'Personalized suggestions',
                icon: 'bulb-outline',
                done: analysisProgress >= 100,
              },
            ].map((item) => (
              <View
                key={item.title}
                style={styles.analysisStageRow}
              >
                <View
                  style={[
                    styles.stageIcon,
                    item.done && styles.stageIconDone,
                  ]}
                >
                  <Ionicons
                    name={
                      item.done
                        ? 'checkmark'
                        : (item.icon as keyof typeof Ionicons.glyphMap)
                    }
                    size={17}
                    color={
                      item.done
                        ? AuraColors.white
                        : AuraColors.purple
                    }
                  />
                </View>

                <Text
                  style={[
                    styles.stageText,
                    item.done && styles.stageTextDone,
                  ]}
                >
                  {item.title}
                </Text>

                {!item.done && analysisProgress < 100 ? (
                  <ActivityIndicator
                    size="small"
                    color={AuraColors.purple}
                  />
                ) : null}
              </View>
            ))}
          </View>

          <View style={styles.aiTip}>
            <Ionicons
              name="sparkles"
              size={19}
              color={AuraColors.gold}
            />

            <Text style={styles.aiTipText}>
              We're looking at the complete outfit rather than judging
              individual pieces in isolation.
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /* ---------------------------------------------------------
     RESULTS SCREEN
  --------------------------------------------------------- */

  if (step === 'results') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Header
            title="Your Outfit Analysis"
            subtitle="Here's what OutfitAura found"
            onBack={() => setStep('upload')}
          />

          <View style={styles.resultHero}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={styles.resultImage}
              />
            ) : null}

            <View style={styles.resultOverlay} />

            <View style={styles.resultScore}>
              <Text style={styles.resultScoreLabel}>
                AURA SCORE
              </Text>

              <Text style={styles.resultScoreValue}>
                8.2
              </Text>

              <View style={styles.scoreDivider} />

              <Text style={styles.resultScoreSmall}>
                Strong foundation
              </Text>
            </View>
          </View>

          <View style={styles.resultIntro}>
            <Text style={styles.resultHeading}>
              You've got a good base. ✨
            </Text>

            <Text style={styles.resultDescription}>
              Your outfit already has a cohesive direction. A few
              targeted changes can make it more balanced, polished,
              and occasion-ready.
            </Text>
          </View>

          <SectionTitle
            eyebrow="AI STYLE ANALYSIS"
            title="What we found"
          />

          <View style={styles.analysisList}>
            {analysisItems.map((item) => (
              <View
                key={item.title}
                style={styles.analysisCard}
              >
                <View style={styles.analysisCardTop}>
                  <View style={styles.analysisCardIcon}>
                    <Ionicons
                      name={item.icon}
                      size={20}
                      color={AuraColors.purple}
                    />
                  </View>

                  <View style={styles.analysisCardTitleWrap}>
                    <Text style={styles.analysisCardTitle}>
                      {item.title}
                    </Text>

                    <Text style={styles.analysisCardComment}>
                      {item.comment}
                    </Text>
                  </View>

                  <Text style={styles.analysisScore}>
                    {item.score}
                  </Text>
                </View>

                <View style={styles.analysisBar}>
                  <View
                    style={[
                      styles.analysisBarFill,
                      {
                        width: `${item.score}%`,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>

          <View style={styles.issueCard}>
            <View style={styles.issueHeader}>
              <View style={styles.issueIcon}>
                <Ionicons
                  name="alert-circle-outline"
                  size={21}
                  color={AuraColors.warning}
                />
              </View>

              <View>
                <Text style={styles.issueTitle}>
                  Styling opportunities
                </Text>

                <Text style={styles.issueSubtitle}>
                  Small changes, noticeable difference
                </Text>
              </View>
            </View>

            <View style={styles.issueItem}>
              <View style={styles.issueDot} />
              <Text style={styles.issueText}>
                The proportions can be balanced more effectively.
              </Text>
            </View>

            <View style={styles.issueItem}>
              <View style={styles.issueDot} />
              <Text style={styles.issueText}>
                Footwear can be upgraded to complement the outfit.
              </Text>
            </View>

            <View style={styles.issueItem}>
              <View style={styles.issueDot} />
              <Text style={styles.issueText}>
                One subtle accessory would improve the finish.
              </Text>
            </View>
          </View>

          <SectionTitle
            eyebrow="PERSONALIZED RECOMMENDATIONS"
            title="Here's what I'd change"
          />

          <View style={styles.recommendationList}>
            {recommendations.map((item, index) => (
              <View
                key={item.title}
                style={styles.recommendationCard}
              >
                <View style={styles.recommendationNumber}>
                  <Text style={styles.recommendationNumberText}>
                    {index + 1}
                  </Text>
                </View>

                <View style={styles.recommendationIcon}>
                  <Ionicons
                    name={item.icon}
                    size={20}
                    color={AuraColors.purple}
                  />
                </View>

                <View style={styles.recommendationContent}>
                  <Text style={styles.recommendationTitle}>
                    {item.title}
                  </Text>

                  <Text style={styles.recommendationDescription}>
                    {item.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          <View style={styles.actionCard}>
            <View style={styles.actionCardIcon}>
              <Ionicons
                name="sparkles"
                size={23}
                color={AuraColors.gold}
              />
            </View>

            <View style={styles.actionCardContent}>
              <Text style={styles.actionCardTitle}>
                Ready for the corrected look?
              </Text>

              <Text style={styles.actionCardDescription}>
                OutfitAura has combined these recommendations into an
                improved outfit concept.
              </Text>
            </View>
          </View>

          <PrimaryButton
            title="Generate Improved Look"
            icon="color-wand-outline"
            onPress={() => setStep('improved')}
          />

          <SecondaryButton
            title="Analyze Another Outfit"
            icon="refresh-outline"
            onPress={resetFlow}
          />

          <Text style={styles.disclaimer}>
            Recommendations are generated for styling assistance and
            can be customized to your preferences.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /* ---------------------------------------------------------
     IMPROVED LOOK SCREEN
  --------------------------------------------------------- */

  if (step === 'improved') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <Header
            title="Improved Look"
            subtitle="Your outfit, elevated"
            onBack={() => setStep('results')}
          />

          <View style={styles.beforeAfterRow}>
            <View style={styles.beforeAfterCard}>
              <View style={styles.imageLabel}>
                <Text style={styles.imageLabelText}>BEFORE</Text>
              </View>

              {imageUri ? (
                <Image
                  source={{ uri: imageUri }}
                  style={styles.beforeAfterImage}
                />
              ) : null}
            </View>

            <View style={styles.arrowConnector}>
              <Ionicons
                name="arrow-forward"
                size={20}
                color={AuraColors.white}
              />
            </View>

            <View style={styles.beforeAfterCard}>
              <View
                style={[
                  styles.imageLabel,
                  styles.imageLabelImproved,
                ]}
              >
                <Text style={styles.imageLabelText}>AURA FIX</Text>
              </View>

              <Image
                source={{ uri: IMPROVED_IMAGE }}
                style={styles.beforeAfterImage}
              />
            </View>
          </View>

          <View style={styles.improvedHeroText}>
            <View style={styles.successPill}>
              <Ionicons
                name="sparkles"
                size={14}
                color={AuraColors.gold}
              />

              <Text style={styles.successPillText}>
                IMPROVED WITH AI
              </Text>
            </View>

            <Text style={styles.improvedTitle}>
              A more balanced,
              {'\n'}polished version of you.
            </Text>

            <Text style={styles.improvedSubtitle}>
              We kept the essence of your original outfit while
              improving the areas identified during analysis.
            </Text>
          </View>

          <View style={styles.scoreImprovedCard}>
            <View>
              <Text style={styles.scoreImprovedLabel}>
                UPDATED AURA SCORE
              </Text>

              <Text style={styles.scoreImprovedValue}>
                9.5
              </Text>
            </View>

            <View style={styles.scoreIncrease}>
              <Ionicons
                name="trending-up"
                size={18}
                color={AuraColors.success}
              />

              <Text style={styles.scoreIncreaseText}>
                +1.3
              </Text>
            </View>
          </View>

          <SectionTitle
            eyebrow="WHAT CHANGED"
            title="Your Aura Fix"
          />

          <View style={styles.changeList}>
            {improvementChanges.map((change, index) => (
              <View
                key={change}
                style={styles.changeRow}
              >
                <View style={styles.changeCheck}>
                  <Ionicons
                    name="checkmark"
                    size={15}
                    color={AuraColors.white}
                  />
                </View>

                <Text style={styles.changeText}>
                  {change}
                </Text>
              </View>
            ))}
          </View>

          <View style={styles.outfitBreakdown}>
            <Text style={styles.breakdownTitle}>
              Improved outfit breakdown
            </Text>

            {[
              ['Top', 'Structured White Shirt', 'shirt-outline'],
              ['Bottom', 'Straight Black Trousers', 'layers-outline'],
              ['Footwear', 'White Minimal Sneakers', 'footsteps-outline'],
              ['Bag', 'Structured Black Bag', 'bag-handle-outline'],
              ['Accessories', 'Gold Minimal Jewelry', 'sparkles-outline'],
            ].map(([label, value, icon]) => (
              <View
                key={label}
                style={styles.breakdownRow}
              >
                <View style={styles.breakdownIcon}>
                  <Ionicons
                    name={
                      icon as keyof typeof Ionicons.glyphMap
                    }
                    size={17}
                    color={AuraColors.purple}
                  />
                </View>

                <Text style={styles.breakdownLabel}>
                  {label}
                </Text>

                <Text style={styles.breakdownValue}>
                  {value}
                </Text>
              </View>
            ))}
          </View>

          <PrimaryButton
            title="Customize This Look"
            icon="options-outline"
            onPress={() => setStep('customize')}
          />

          <SecondaryButton
            title={saved ? 'Saved to Your Looks' : 'Save Improved Look'}
            icon={saved ? 'checkmark-circle' : 'heart-outline'}
            onPress={saveLook}
          />

          <Text style={styles.disclaimer}>
            The improved look represents the AI's styling recommendation
            based on the detected outfit characteristics.
          </Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  /* ---------------------------------------------------------
     CUSTOMIZE SCREEN
  --------------------------------------------------------- */

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Header
          title="Customize Look"
          subtitle="Make the Aura Fix yours"
          onBack={() => setStep('improved')}
        />

        <View style={styles.customizeHero}>
          <Image
            source={{ uri: IMPROVED_IMAGE }}
            style={styles.customizeImage}
          />

          <View style={styles.customizeOverlay} />

          <View style={styles.customizeHeroContent}>
            <Text style={styles.customizeHeroTitle}>
              Your look.
              {'\n'}Your choices.
            </Text>

            <Text style={styles.customizeHeroSubtitle}>
              Change individual pieces while keeping the overall
              styling direction.
            </Text>
          </View>
        </View>

        <SectionTitle
          eyebrow="PERSONALIZE"
          title="Choose what feels right"
        />

        {(
          Object.keys(customizationOptions) as Array<
            keyof typeof customizationOptions
          >
        ).map((category) => (
          <View
            key={category}
            style={styles.customizationSection}
          >
            <Text style={styles.customizationTitle}>
              {category === 'top'
                ? 'Top'
                : category === 'bottom'
                ? 'Bottom'
                : category === 'footwear'
                ? 'Footwear'
                : category === 'bag'
                ? 'Bag'
                : 'Accessories'}
            </Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.optionScroll}
            >
              {customizationOptions[category].map(
                (option) => {
                  const active =
                    customization[category] === option;

                  return (
                    <Pressable
                      key={option}
                      onPress={() =>
                        setCustomization((previous) => ({
                          ...previous,
                          [category]: option,
                        }))
                      }
                      style={[
                        styles.customOption,
                        active && styles.customOptionActive,
                      ]}
                    >
                      {active ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={17}
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
                }
              )}
            </ScrollView>
          </View>
        ))}

        <View style={styles.feedbackCard}>
          <View style={styles.feedbackIcon}>
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={21}
              color={AuraColors.purple}
            />
          </View>

          <View style={styles.feedbackContent}>
            <Text style={styles.feedbackTitle}>
              How do you feel about this look?
            </Text>

            <Text style={styles.feedbackSubtitle}>
              Your feedback can help improve future styling
              recommendations.
            </Text>

            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable
                  key={star}
                  onPress={() => setRating(star)}
                >
                  <Ionicons
                    name={
                      star <= rating
                        ? 'star'
                        : 'star-outline'
                    }
                    size={26}
                    color={AuraColors.gold}
                  />
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        <PrimaryButton
          title="Apply My Changes"
          icon="checkmark"
          onPress={() => {
            Alert.alert(
              'Look Updated ✨',
              'Your customized corrected look is ready.',
              [
                {
                  text: 'Save Look',
                  onPress: saveLook,
                },
                {
                  text: 'View Look',
                  style: 'cancel',
                },
              ]
            );
          }}
        />

        <SecondaryButton
          title="Save Current Look"
          icon="heart-outline"
          onPress={saveLook}
        />

        <SecondaryButton
          title="Start Over"
          icon="refresh-outline"
          onPress={resetFlow}
        />

        <Text style={styles.disclaimer}>
          Customize clothing items, colors, footwear, bags, and
          accessories to match your preferences.
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

  /* INTRO */

  intro: {
    marginBottom: AuraSpacing.xl,
  },

  aiPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuraColors.navy,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: AuraRadius.pill,
    marginBottom: AuraSpacing.md,
  },

  aiPillText: {
    ...AuraTypography.label,
    color: AuraColors.goldLight,
    marginLeft: 6,
  },

  pageTitle: {
    ...AuraTypography.display,
    color: AuraColors.navy,
    marginBottom: AuraSpacing.sm,
  },

  pageSubtitle: {
    ...AuraTypography.bodyLarge,
    color: AuraColors.textSecondary,
    maxWidth: 370,
  },

  /* UPLOAD */

  uploadCard: {
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    minHeight: 300,
    borderWidth: 1,
    borderColor: AuraColors.border,
    ...AuraShadow.card,
    overflow: 'hidden',
  },

  uploadIcon: {
    width: 68,
    height: 68,
    borderRadius: 23,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 16,
  },

  uploadTitle: {
    ...AuraTypography.heading,
    color: AuraColors.navy,
    textAlign: 'center',
    marginTop: AuraSpacing.lg,
  },

  uploadDescription: {
    ...AuraTypography.body,
    color: AuraColors.textSecondary,
    textAlign: 'center',
    marginTop: 5,
    maxWidth: 290,
    alignSelf: 'center',
  },

  uploadActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: AuraSpacing.xl,
  },

  uploadAction: {
    flex: 1,
    backgroundColor: AuraColors.surfaceSoft,
    borderRadius: AuraRadius.medium,
    padding: AuraSpacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AuraColors.borderLight,
  },

  uploadActionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: AuraColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },

  uploadActionTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.navy,
  },

  uploadActionSubtitle: {
    ...AuraTypography.small,
    color: AuraColors.textMuted,
    marginTop: 2,
  },

  previewContainer: {
    height: 380,
    borderRadius: 19,
    overflow: 'hidden',
    position: 'relative',
  },

  uploadPreview: {
    width: '100%',
    height: '100%',
  },

  previewOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(18,22,74,0.14)',
  },

  changePhotoButton: {
    position: 'absolute',
    top: 14,
    right: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18,22,74,0.82)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: AuraRadius.pill,
  },

  changePhotoText: {
    ...AuraTypography.small,
    color: AuraColors.white,
    marginLeft: 5,
    fontWeight: '600',
  },

  photoReadyBadge: {
    position: 'absolute',
    left: 14,
    bottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18,22,74,0.86)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: AuraRadius.pill,
  },

  photoReadyText: {
    ...AuraTypography.small,
    color: AuraColors.white,
    marginLeft: 5,
    fontWeight: '600',
  },

  demoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuraColors.surfacePurple,
    borderRadius: AuraRadius.medium,
    padding: AuraSpacing.md,
    marginTop: AuraSpacing.md,
  },

  demoTextWrap: {
    flex: 1,
    marginLeft: 10,
  },

  demoTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.navy,
  },

  demoSubtitle: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    marginTop: 2,
  },

  /* ANALYSIS PREVIEW */

  whatWeAnalyze: {
    marginTop: AuraSpacing.xxxl,
    marginBottom: AuraSpacing.xl,
  },

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

  analysisPreviewGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },

  analysisPreviewItem: {
    width: '31%',
    minHeight: 76,
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  analysisPreviewText: {
    ...AuraTypography.small,
    color: AuraColors.navy,
    marginTop: 7,
    fontWeight: '500',
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
    marginTop: AuraSpacing.md,
    ...AuraShadow.floating,
  },

  primaryButtonDisabled: {
    opacity: 0.45,
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

  /* ANALYZING */

  analysisHero: {
    height: 450,
    borderRadius: AuraRadius.card,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: AuraColors.navy,
    ...AuraShadow.card,
  },

  analysisImage: {
    width: '100%',
    height: '100%',
  },

  analysisImageOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(18,22,74,0.52)',
  },

  scanRing: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: AuraColors.goldLight,
    alignSelf: 'center',
    top: '39%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanInner: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'rgba(18,22,74,0.82)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  analyzingLabel: {
    position: 'absolute',
    bottom: 18,
    left: 18,
    right: 18,
    backgroundColor: 'rgba(18,22,74,0.84)',
    borderRadius: AuraRadius.pill,
    paddingVertical: 11,
    alignItems: 'center',
  },

  analyzingLabelText: {
    ...AuraTypography.label,
    color: AuraColors.goldLight,
  },

  progressSection: {
    marginTop: AuraSpacing.xl,
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.medium,
    padding: AuraSpacing.lg,
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
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
    backgroundColor: AuraColors.surfacePurple,
    borderRadius: AuraRadius.pill,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    backgroundColor: AuraColors.purple,
    borderRadius: AuraRadius.pill,
  },

  analysisStages: {
    marginTop: AuraSpacing.xl,
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  analysisStageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: AuraColors.borderLight,
  },

  stageIcon: {
    width: 34,
    height: 34,
    borderRadius: 12,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  stageIconDone: {
    backgroundColor: AuraColors.purple,
  },

  stageText: {
    ...AuraTypography.body,
    color: AuraColors.textSecondary,
    flex: 1,
  },

  stageTextDone: {
    color: AuraColors.navy,
    fontWeight: '500',
  },

  aiTip: {
    flexDirection: 'row',
    backgroundColor: AuraColors.goldSoft,
    borderRadius: AuraRadius.medium,
    padding: AuraSpacing.md,
    marginTop: AuraSpacing.lg,
    alignItems: 'flex-start',
  },

  aiTipText: {
    ...AuraTypography.small,
    color: AuraColors.navy,
    flex: 1,
    marginLeft: 9,
  },

  /* RESULTS */

  resultHero: {
    height: 390,
    borderRadius: AuraRadius.card,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: AuraColors.navy,
  },

  resultImage: {
    width: '100%',
    height: '100%',
  },

  resultOverlay: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'rgba(18,22,74,0.25)',
  },

  resultScore: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: 19,
    padding: 15,
    minWidth: 112,
    alignItems: 'center',
  },

  resultScoreLabel: {
    ...AuraTypography.label,
    color: AuraColors.purple,
  },

  resultScoreValue: {
    fontSize: 35,
    lineHeight: 39,
    fontWeight: '700',
    color: AuraColors.navy,
    marginTop: 2,
  },

  scoreDivider: {
    width: 40,
    height: 1,
    backgroundColor: AuraColors.border,
    marginVertical: 6,
  },

  resultScoreSmall: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
  },

  resultIntro: {
    marginVertical: AuraSpacing.xl,
  },

  resultHeading: {
    ...AuraTypography.title,
    color: AuraColors.navy,
  },

  resultDescription: {
    ...AuraTypography.bodyLarge,
    color: AuraColors.textSecondary,
    marginTop: 7,
  },

  analysisList: {
    gap: 10,
  },

  analysisCard: {
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.medium,
    padding: AuraSpacing.md,
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  analysisCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  analysisCardIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  analysisCardTitleWrap: {
    flex: 1,
  },

  analysisCardTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.navy,
  },

  analysisCardComment: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    marginTop: 3,
    lineHeight: 18,
  },

  analysisScore: {
    fontSize: 17,
    fontWeight: '700',
    color: AuraColors.purple,
    marginLeft: 6,
  },

  analysisBar: {
    height: 5,
    backgroundColor: AuraColors.surfacePurple,
    borderRadius: AuraRadius.pill,
    overflow: 'hidden',
    marginTop: 11,
  },

  analysisBarFill: {
    height: '100%',
    backgroundColor: AuraColors.purple,
    borderRadius: AuraRadius.pill,
  },

  issueCard: {
    backgroundColor: AuraColors.goldSoft,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    marginTop: AuraSpacing.xl,
    marginBottom: AuraSpacing.xxxl,
  },

  issueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 11,
  },

  issueIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: AuraColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  issueTitle: {
    ...AuraTypography.subheading,
    color: AuraColors.navy,
  },

  issueSubtitle: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    marginTop: 2,
  },

  issueItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: 10,
  },

  issueDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: AuraColors.warning,
    marginTop: 7,
    marginRight: 10,
  },

  issueText: {
    ...AuraTypography.body,
    color: AuraColors.navy,
    flex: 1,
  },

  recommendationList: {
    gap: 10,
  },

  recommendationCard: {
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.medium,
    padding: AuraSpacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  recommendationNumber: {
    width: 28,
    height: 28,
    borderRadius: 10,
    backgroundColor: AuraColors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },

  recommendationNumberText: {
    ...AuraTypography.small,
    color: AuraColors.white,
    fontWeight: '700',
  },

  recommendationIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 9,
    marginRight: 10,
  },

  recommendationContent: {
    flex: 1,
  },

  recommendationTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.navy,
  },

  recommendationDescription: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    marginTop: 3,
  },

  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuraColors.navy,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    marginTop: AuraSpacing.xl,
  },

  actionCardIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: 'rgba(255,255,255,0.10)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionCardContent: {
    flex: 1,
    marginLeft: 12,
  },

  actionCardTitle: {
    ...AuraTypography.subheading,
    color: AuraColors.white,
  },

  actionCardDescription: {
    ...AuraTypography.small,
    color: '#D9D7E8',
    marginTop: 3,
  },

  /* IMPROVED */

  beforeAfterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  beforeAfterCard: {
    flex: 1,
    height: 285,
    borderRadius: AuraRadius.large,
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: AuraColors.surfacePurple,
  },

  beforeAfterImage: {
    width: '100%',
    height: '100%',
  },

  imageLabel: {
    position: 'absolute',
    zIndex: 2,
    top: 10,
    left: 10,
    backgroundColor: 'rgba(18,22,74,0.82)',
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: AuraRadius.pill,
  },

  imageLabelImproved: {
    backgroundColor: AuraColors.purple,
  },

  imageLabelText: {
    ...AuraTypography.label,
    color: AuraColors.white,
    fontSize: 10,
  },

  arrowConnector: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: AuraColors.navy,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: -3,
    zIndex: 3,
  },

  improvedHeroText: {
    marginVertical: AuraSpacing.xl,
  },

  successPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuraColors.goldSoft,
    borderRadius: AuraRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginBottom: 10,
  },

  successPillText: {
    ...AuraTypography.label,
    color: AuraColors.navy,
    marginLeft: 5,
  },

  improvedTitle: {
    ...AuraTypography.title,
    color: AuraColors.navy,
  },

  improvedSubtitle: {
    ...AuraTypography.body,
    color: AuraColors.textSecondary,
    marginTop: 7,
  },

  scoreImprovedCard: {
    backgroundColor: AuraColors.navy,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: AuraSpacing.xxxl,
  },

  scoreImprovedLabel: {
    ...AuraTypography.label,
    color: AuraColors.goldLight,
  },

  scoreImprovedValue: {
    fontSize: 40,
    lineHeight: 44,
    fontWeight: '700',
    color: AuraColors.white,
    marginTop: 2,
  },

  scoreIncrease: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(77,138,104,0.18)',
    borderRadius: AuraRadius.pill,
    paddingHorizontal: 11,
    paddingVertical: 8,
  },

  scoreIncreaseText: {
    ...AuraTypography.bodyMedium,
    color: '#8FD1A8',
    marginLeft: 5,
  },

  changeList: {
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    borderWidth: 1,
    borderColor: AuraColors.border,
    marginBottom: AuraSpacing.xl,
  },

  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },

  changeCheck: {
    width: 27,
    height: 27,
    borderRadius: 9,
    backgroundColor: AuraColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  changeText: {
    ...AuraTypography.body,
    color: AuraColors.navy,
    flex: 1,
  },

  outfitBreakdown: {
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    borderWidth: 1,
    borderColor: AuraColors.border,
    marginBottom: AuraSpacing.lg,
  },

  breakdownTitle: {
    ...AuraTypography.subheading,
    color: AuraColors.navy,
    marginBottom: 5,
  },

  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: AuraColors.borderLight,
  },

  breakdownIcon: {
    width: 35,
    height: 35,
    borderRadius: 11,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 9,
  },

  breakdownLabel: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    width: 72,
  },

  breakdownValue: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.navy,
    flex: 1,
    textAlign: 'right',
  },

  /* CUSTOMIZE */

  customizeHero: {
    height: 360,
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
  backgroundColor: 'rgba(18,22,74,0.38)',
},

  customizeHeroContent: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 20,
  },

  customizeHeroTitle: {
    ...AuraTypography.title,
    color: AuraColors.white,
  },

  customizeHeroSubtitle: {
    ...AuraTypography.body,
    color: '#ECEAF4',
    marginTop: 5,
  },

  customizationSection: {
    marginBottom: AuraSpacing.lg,
  },

  customizationTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.navy,
    marginBottom: 9,
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

  feedbackCard: {
    backgroundColor: AuraColors.surfacePurple,
    borderRadius: AuraRadius.card,
    padding: AuraSpacing.lg,
    flexDirection: 'row',
    marginTop: AuraSpacing.md,
    marginBottom: AuraSpacing.md,
  },

  feedbackIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: AuraColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  feedbackContent: {
    flex: 1,
    marginLeft: 11,
  },

  feedbackTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.navy,
  },

  feedbackSubtitle: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    marginTop: 3,
  },

  stars: {
    flexDirection: 'row',
    gap: 5,
    marginTop: 10,
  },
});