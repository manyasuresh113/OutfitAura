import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import {
    AuraColors,
    AuraRadius,
    AuraShadow,
    AuraTypography,
} from '../constants/auraTheme';

type Outfit = {
  top: string;
  bottom: string;
  footwear: string;
  bag: string;
  accessories: string;
};

type SavedLook = {
  id: string;
  title: string;
  subtitle: string;
  score: number;
  occasion: string;
  image: string;
  outfit: Outfit;
  createdAt: string;
};

const SAVED_LOOKS_KEY = '@outfitaura_saved_looks';

const occasions = [
  {
    id: 'college',
    label: 'College',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800',
  },
  {
    id: 'party',
    label: 'Party',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
  },
  {
    id: 'event',
    label: 'Event',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
  },
  {
    id: 'date',
    label: 'Date',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
  },
  {
    id: 'interview',
    label: 'Interview',
    image:
      'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=800',
  },
  {
    id: 'vacation',
    label: 'Vacation',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  },
  {
    id: 'festival',
    label: 'Festival',
    image:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800',
  },
  {
    id: 'social',
    label: 'Social Gathering',
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800',
  },
  {
    id: 'wedding',
    label: 'Wedding',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
  },
  {
    id: 'other',
    label: 'Other',
    image:
      'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
  },
];

const styleOptions = [
  'Minimal',
  'Modern',
  'Elegant',
  'Streetwear',
  'Boho',
  'Classic',
];

const colorOptions = [
  'Black',
  'White',
  'Beige',
  'Brown',
  'Navy',
  'Purple',
  'Pink',
  'Green',
];

const moodOptions = [
  'Confident',
  'Effortless',
  'Elegant',
  'Playful',
];

const inspirationTypes = [
  {
    id: 'reference',
    title: 'Reference Outfit',
    icon: 'shirt-outline',
  },
  {
    id: 'fashion',
    title: 'Fashion Inspiration',
    icon: 'sparkles-outline',
  },
  {
    id: 'fabric',
    title: 'Fabric / Material',
    icon: 'layers-outline',
  },
  {
    id: 'design',
    title: 'Design Reference',
    icon: 'color-palette-outline',
  },
];

const modelImage =
  'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=1200';

export default function Create() {
  const router = useRouter();

  const [step, setStep] = useState(1);

  const [selectedOccasion, setSelectedOccasion] =
    useState<string | null>(null);

  const [selectedStyle, setSelectedStyle] =
    useState<string | null>(null);

  const [selectedColors, setSelectedColors] =
    useState<string[]>([]);

  const [selectedMood, setSelectedMood] =
    useState<string | null>(null);

  const [selectedInspirationType, setSelectedInspirationType] =
    useState<string | null>(null);

  const [inspirationImages, setInspirationImages] =
    useState<string[]>([]);

  const [generationStage, setGenerationStage] = useState(0);

  const [saved, setSaved] = useState(false);

  const [customizing, setCustomizing] = useState(false);

  const [outfit, setOutfit] = useState<Outfit>({
    top: 'Structured blouse',
    bottom: 'Wide-leg trousers',
    footwear: 'Minimal sneakers',
    bag: 'Structured shoulder bag',
    accessories: 'Gold accents',
  });

  const [draftOutfit, setDraftOutfit] =
    useState<Outfit>(outfit);

  const occasionLabel =
    occasions.find(
      (item) => item.id === selectedOccasion
    )?.label || 'Personalized';

  const toggleColor = (color: string) => {
    setSelectedColors((current) =>
      current.includes(color)
        ? current.filter((item) => item !== color)
        : [...current, color]
    );
  };

  const pickInspirationImage = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert(
        'Permission needed',
        'Please allow photo library access to add inspiration.'
      );
      return;
    }

    const result =
      await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 5],
        quality: 0.85,
      });

    if (!result.canceled && result.assets?.length) {
      setInspirationImages((current) => [
        ...current,
        result.assets[0].uri,
      ]);
    }
  };

  const removeInspiration = (uri: string) => {
    setInspirationImages((current) =>
      current.filter((image) => image !== uri)
    );
  };

  const startGeneration = () => {
    setStep(4);
    setGenerationStage(0);
  };

  useEffect(() => {
    if (step !== 4) return;

    const timers = [
      setTimeout(() => setGenerationStage(1), 900),
      setTimeout(() => setGenerationStage(2), 1800),
      setTimeout(() => setGenerationStage(3), 2800),
      setTimeout(() => setGenerationStage(4), 3900),
      setTimeout(() => setStep(5), 5000),
    ];

    return () => timers.forEach(clearTimeout);
  }, [step]);

  const saveLook = async () => {
    try {
      const existing =
        await AsyncStorage.getItem(SAVED_LOOKS_KEY);

      const currentLooks: SavedLook[] = existing
        ? JSON.parse(existing)
        : [];

      const newLook: SavedLook = {
        id: Date.now().toString(),
        title: 'Your Aura Look',
        subtitle: `${selectedStyle || 'Modern'} • ${
          selectedMood || 'Confident'
        }`,
        score: 9.6,
        occasion: occasionLabel,
        image: modelImage,
        outfit,
        createdAt: new Date().toISOString(),
      };

      const updatedLooks = [
        newLook,
        ...currentLooks,
      ];

      await AsyncStorage.setItem(
        SAVED_LOOKS_KEY,
        JSON.stringify(updatedLooks)
      );

      setSaved(true);

      Alert.alert(
        'Look Saved ✨',
        'Your outfit has been added to Saved Looks.',
        [
          {
            text: 'View Saved Looks',
            onPress: () =>
              router.push('/(tabs)/saved'),
          },
          {
            text: 'Stay Here',
            style: 'cancel',
          },
        ]
      );
    } catch (error) {
      console.log(error);

      Alert.alert(
        'Could not save',
        'Something went wrong while saving your look.'
      );
    }
  };

  const openCustomize = () => {
    setDraftOutfit(outfit);
    setCustomizing(true);
  };

  const updateDraft = (
    key: keyof Outfit,
    value: string
  ) => {
    setDraftOutfit((current) => ({
      ...current,
      [key]: value,
    }));
  };

  const applyCustomization = () => {
    setOutfit(draftOutfit);
    setCustomizing(false);

    Alert.alert(
      'Look Updated ✨',
      'Your personalized changes have been applied.'
    );
  };

  const createAnother = () => {
    setStep(1);

    setSelectedOccasion(null);
    setSelectedStyle(null);
    setSelectedColors([]);
    setSelectedMood(null);
    setSelectedInspirationType(null);
    setInspirationImages([]);

    setGenerationStage(0);
    setSaved(false);
    setCustomizing(false);

    setOutfit({
      top: 'Structured blouse',
      bottom: 'Wide-leg trousers',
      footwear: 'Minimal sneakers',
      bag: 'Structured shoulder bag',
      accessories: 'Gold accents',
    });
  };

  const progress = step * 20;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.brand}>
              OUTFITAURA AI
            </Text>

            <Text style={styles.headerTitle}>
              Create My Outfit
            </Text>
          </View>

          <View style={styles.stepBadge}>
            <Text style={styles.stepText}>
              {String(step).padStart(2, '0')} / 05
            </Text>
          </View>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              { width: `${progress}%` },
            ]}
          />
        </View>

        {step === 1 && (
          <StepOne
            selectedOccasion={selectedOccasion}
            setSelectedOccasion={setSelectedOccasion}
            onContinue={() => setStep(2)}
          />
        )}

        {step === 2 && (
          <StepTwo
            selectedStyle={selectedStyle}
            setSelectedStyle={setSelectedStyle}
            selectedColors={selectedColors}
            toggleColor={toggleColor}
            selectedMood={selectedMood}
            setSelectedMood={setSelectedMood}
            onBack={() => setStep(1)}
            onContinue={() => setStep(3)}
          />
        )}

        {step === 3 && (
          <StepThree
            selectedInspirationType={
              selectedInspirationType
            }
            setSelectedInspirationType={
              setSelectedInspirationType
            }
            inspirationImages={inspirationImages}
            onPick={pickInspirationImage}
            onRemove={removeInspiration}
            onBack={() => setStep(2)}
            onContinue={startGeneration}
          />
        )}

        {step === 4 && (
          <GenerationScreen
            generationStage={generationStage}
          />
        )}

        {step === 5 && !customizing && (
          <FinalLook
            outfit={outfit}
            saved={saved}
            occasion={occasionLabel}
            style={selectedStyle}
            mood={selectedMood}
            onCustomize={openCustomize}
            onSave={saveLook}
            onCreateAnother={createAnother}
          />
        )}

        {step === 5 && customizing && (
          <CustomizeScreen
            outfit={draftOutfit}
            updateDraft={updateDraft}
            onBack={() => setCustomizing(false)}
            onApply={applyCustomization}
          />
        )}
      </ScrollView>
    </View>
  );
}

/* =========================================================
   STEP 1
========================================================= */

function StepOne({
  selectedOccasion,
  setSelectedOccasion,
  onContinue,
}: {
  selectedOccasion: string | null;
  setSelectedOccasion: (
    value: string | null
  ) => void;
  onContinue: () => void;
}) {
  return (
    <View>
      <Text style={styles.eyebrow}>
        01 — OUTFIT PREFERENCES
      </Text>

      <Text style={styles.heading}>
        What are you dressing for?
      </Text>

      <Text style={styles.description}>
        Choose the occasion and Aura will build a look
        around it.
      </Text>

      <View style={styles.grid}>
        {occasions.map((occasion) => {
          const selected =
            selectedOccasion === occasion.id;

          return (
            <Pressable
              key={occasion.id}
              style={[
                styles.occasionCard,
                selected && styles.selectedCard,
              ]}
              onPress={() =>
                setSelectedOccasion(
                  selected
                    ? null
                    : occasion.id
                )
              }
            >
              <Image
                source={{ uri: occasion.image }}
                style={styles.cardImage}
              />

              <View style={styles.imageOverlay} />

              <View style={styles.cardLabelWrap}>
                <Text style={styles.cardLabel}>
                  {occasion.label}
                </Text>
              </View>

              {selected && (
                <View style={styles.checkCircle}>
                  <Ionicons
                    name="checkmark"
                    size={15}
                    color={AuraColors.white}
                  />
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      <ContinueButton
        disabled={!selectedOccasion}
        label="Continue"
        onPress={onContinue}
      />

      <Text style={styles.hint}>
        Step 1 of 5 · Your profile characteristics are
        already saved
      </Text>
    </View>
  );
}

/* =========================================================
   STEP 2
========================================================= */

function StepTwo({
  selectedStyle,
  setSelectedStyle,
  selectedColors,
  toggleColor,
  selectedMood,
  setSelectedMood,
  onBack,
  onContinue,
}: {
  selectedStyle: string | null;
  setSelectedStyle: (
    value: string | null
  ) => void;
  selectedColors: string[];
  toggleColor: (value: string) => void;
  selectedMood: string | null;
  setSelectedMood: (
    value: string | null
  ) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  const ready =
    !!selectedStyle &&
    selectedColors.length > 0 &&
    !!selectedMood;

  return (
    <View>
      <Text style={styles.eyebrow}>
        02 — YOUR VIBE
      </Text>

      <Text style={styles.heading}>
        Tell Aura your vibe.
      </Text>

      <Text style={styles.description}>
        Your choices help Aura understand the look you
        want.
      </Text>

      <Text style={styles.sectionTitle}>
        Preferred Style
      </Text>

      <View style={styles.optionGrid}>
        {styleOptions.map((item) => {
          const selected =
            selectedStyle === item;

          return (
            <Pressable
              key={item}
              style={[
                styles.option,
                selected &&
                  styles.optionSelected,
              ]}
              onPress={() =>
                setSelectedStyle(
                  selected ? null : item
                )
              }
            >
              <Text
                style={[
                  styles.optionText,
                  selected &&
                    styles.optionTextSelected,
                ]}
              >
                {item}
              </Text>

              {selected && (
                <Ionicons
                  name="checkmark-circle"
                  size={19}
                  color={AuraColors.purple}
                />
              )}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>
        Preferred Colors
      </Text>

      <View style={styles.optionGrid}>
        {colorOptions.map((color) => {
          const selected =
            selectedColors.includes(color);

          return (
            <Pressable
              key={color}
              style={[
                styles.option,
                selected &&
                  styles.optionSelected,
              ]}
              onPress={() =>
                toggleColor(color)
              }
            >
              <View style={styles.colorNameRow}>
                <View
                  style={[
                    styles.colorDot,
                    {
                      backgroundColor:
                        color.toLowerCase() ===
                        'white'
                          ? '#FFFFFF'
                          : color.toLowerCase(),
                    },
                  ]}
                />

                <Text
                  style={[
                    styles.optionText,
                    selected &&
                      styles.optionTextSelected,
                  ]}
                >
                  {color}
                </Text>
              </View>

              {selected && (
                <Ionicons
                  name="checkmark-circle"
                  size={19}
                  color={AuraColors.purple}
                />
              )}
            </Pressable>
          );
        })}
      </View>

      <Text style={styles.sectionTitle}>
        Mood
      </Text>

      <View style={styles.optionGrid}>
        {moodOptions.map((mood) => {
          const selected =
            selectedMood === mood;

          return (
            <Pressable
              key={mood}
              style={[
                styles.option,
                selected &&
                  styles.optionSelected,
              ]}
              onPress={() =>
                setSelectedMood(
                  selected ? null : mood
                )
              }
            >
              <Text
                style={[
                  styles.optionText,
                  selected &&
                    styles.optionTextSelected,
                ]}
              >
                {mood}
              </Text>

              {selected && (
                <Ionicons
                  name="checkmark-circle"
                  size={19}
                  color={AuraColors.purple}
                />
              )}
            </Pressable>
          );
        })}
      </View>

      <View style={styles.buttonRow}>
        <BackButton onPress={onBack} />

        <View style={styles.flexButton}>
          <ContinueButton
            disabled={!ready}
            label="Continue"
            onPress={onContinue}
          />
        </View>
      </View>
    </View>
  );
}

/* =========================================================
   STEP 3
========================================================= */

function StepThree({
  selectedInspirationType,
  setSelectedInspirationType,
  inspirationImages,
  onPick,
  onRemove,
  onBack,
  onContinue,
}: {
  selectedInspirationType: string | null;
  setSelectedInspirationType: (
    value: string | null
  ) => void;
  inspirationImages: string[];
  onPick: () => void;
  onRemove: (uri: string) => void;
  onBack: () => void;
  onContinue: () => void;
}) {
  return (
    <View>
      <Text style={styles.eyebrow}>
        03 — INSPIRATION
      </Text>

      <Text style={styles.heading}>
        Give Aura some inspiration.
      </Text>

      <Text style={styles.description}>
        Optional — add reference images if you have a
        particular direction in mind.
      </Text>

      <View style={styles.optionGrid}>
        {inspirationTypes.map((item) => {
          const selected =
            selectedInspirationType === item.id;

          return (
            <Pressable
              key={item.id}
              style={[
                styles.inspirationCard,
                selected &&
                  styles.optionSelected,
              ]}
              onPress={() =>
                setSelectedInspirationType(
                  selected ? null : item.id
                )
              }
            >
              <View
                style={[
                  styles.inspirationIcon,
                  selected && {
                    backgroundColor:
                      AuraColors.purple,
                  },
                ]}
              >
                <Ionicons
                  name={item.icon as any}
                  size={23}
                  color={
                    selected
                      ? AuraColors.white
                      : AuraColors.purple
                  }
                />
              </View>

              <Text style={styles.inspirationTitle}>
                {item.title}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        style={styles.uploadBox}
        onPress={onPick}
      >
        <View style={styles.uploadIcon}>
          <Ionicons
            name="add"
            size={25}
            color={AuraColors.purple}
          />
        </View>

        <Text style={styles.uploadTitle}>
          Add Inspiration Image
        </Text>

        <Text style={styles.uploadSubtitle}>
          Choose from your gallery
        </Text>
      </Pressable>

      {inspirationImages.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>
            Your Inspiration
          </Text>

          <View style={styles.inspirationImageGrid}>
            {inspirationImages.map((uri) => (
              <View
                key={uri}
                style={styles.previewCard}
              >
                <Image
                  source={{ uri }}
                  style={styles.previewImage}
                />

                <Pressable
                  style={styles.removeButton}
                  onPress={() =>
                    onRemove(uri)
                  }
                >
                  <Ionicons
                    name="close"
                    size={16}
                    color={AuraColors.white}
                  />
                </Pressable>
              </View>
            ))}
          </View>
        </>
      )}

      <View style={styles.buttonRow}>
        <BackButton onPress={onBack} />

        <View style={styles.flexButton}>
          <ContinueButton
            disabled={false}
            label={
              inspirationImages.length
                ? 'Continue'
                : 'Skip for Now'
            }
            onPress={onContinue}
          />
        </View>
      </View>

      <Text style={styles.hint}>
        Inspiration is optional. Aura can create a look
        using your profile and preferences alone.
      </Text>
    </View>
  );
}

/* =========================================================
   STEP 4 — AI GENERATION
========================================================= */

function GenerationScreen({
  generationStage,
}: {
  generationStage: number;
}) {
  const stages = [
    {
      title: 'Reading your style profile',
      subtitle:
        'Using your saved characteristics',
    },
    {
      title: 'Understanding your preferences',
      subtitle:
        'Matching occasion, style and mood',
    },
    {
      title: 'Blending your inspiration',
      subtitle:
        'Finding the right visual direction',
    },
    {
      title: 'Creating your outfit',
      subtitle:
        'Building your personalized look',
    },
  ];

  return (
    <View>
      <Text style={styles.eyebrow}>
        04 — AI CREATION
      </Text>

      <Text style={styles.heading}>
        Aura is creating your look.
      </Text>

      <Text style={styles.description}>
        Your profile, preferences and inspiration are
        being combined into one personalized outfit.
      </Text>

      <View style={styles.auraOrb}>
        <View style={styles.orbOuter}>
          <View style={styles.orbMiddle}>
            <View style={styles.orbInner}>
              <Ionicons
                name="sparkles"
                size={34}
                color={AuraColors.goldLight}
              />
            </View>
          </View>
        </View>
      </View>

      <View style={styles.generationCard}>
        {stages.map((stage, index) => {
          const completed =
            generationStage > index;

          const active =
            generationStage === index;

          return (
            <View
              key={stage.title}
              style={styles.generationRow}
            >
              <View
                style={[
                  styles.generationCheck,
                  completed &&
                    styles.generationCompleted,
                  active &&
                    styles.generationActive,
                ]}
              >
                {completed ? (
                  <Ionicons
                    name="checkmark"
                    size={15}
                    color={AuraColors.white}
                  />
                ) : active ? (
                  <View
                    style={styles.loadingDot}
                  />
                ) : null}
              </View>

              <View style={styles.generationText}>
                <Text
                  style={[
                    styles.generationTitle,
                    active && {
                      color:
                        AuraColors.purple,
                    },
                  ]}
                >
                  {stage.title}
                </Text>

                <Text
                  style={
                    styles.generationSubtitle
                  }
                >
                  {stage.subtitle}
                </Text>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.aiNotice}>
        <Ionicons
          name="sparkles"
          size={18}
          color={AuraColors.gold}
        />

        <Text style={styles.aiNoticeText}>
          AI outfit generation · Frontend simulation
        </Text>
      </View>
    </View>
  );
}

/* =========================================================
   STEP 5 — FINAL LOOK
========================================================= */

function FinalLook({
  outfit,
  saved,
  occasion,
  style,
  mood,
  onCustomize,
  onSave,
  onCreateAnother,
}: {
  outfit: Outfit;
  saved: boolean;
  occasion: string;
  style: string | null;
  mood: string | null;
  onCustomize: () => void;
  onSave: () => void;
  onCreateAnother: () => void;
}) {
  const breakdown = [
    [
      'Top',
      outfit.top,
      'shirt-outline',
    ],
    [
      'Bottom',
      outfit.bottom,
      'resize-outline',
    ],
    [
      'Footwear',
      outfit.footwear,
      'footsteps-outline',
    ],
    [
      'Bag',
      outfit.bag,
      'bag-handle-outline',
    ],
    [
      'Accessories',
      outfit.accessories,
      'sparkles-outline',
    ],
  ];

  return (
    <View>
      <View style={styles.readyPill}>
        <Ionicons
          name="sparkles"
          size={14}
          color={AuraColors.gold}
        />

        <Text style={styles.readyPillText}>
          AURA CREATED THIS FOR YOU
        </Text>
      </View>

      <Text style={styles.heading}>
        Meet your new look.
      </Text>

      <Text style={styles.description}>
        Personalized for your profile and chosen
        preferences.
      </Text>

      <View style={styles.modelCard}>
        <Image
          source={{ uri: modelImage }}
          style={styles.modelImage}
        />

        <View style={styles.modelOverlay} />

        <View style={styles.modelTopBadge}>
          <Text style={styles.modelBadgeText}>
            AI GENERATED LOOK
          </Text>
        </View>

        <View style={styles.scoreBadge}>
          <Ionicons
            name="sparkles"
            size={14}
            color={AuraColors.gold}
          />

          <Text style={styles.scoreText}>
            9.6
          </Text>
        </View>

        <View style={styles.modelBottom}>
          <Text style={styles.lookTitle}>
            Your Aura Look
          </Text>

          <Text style={styles.lookSubtitle}>
            {occasion} · {style || 'Modern'} ·{' '}
            {mood || 'Confident'}
          </Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>
        Outfit Breakdown
      </Text>

      <View style={styles.breakdownCard}>
        {breakdown.map(
          ([label, value, icon], index) => (
            <View
              key={label}
              style={[
                styles.breakdownRow,
                index ===
                  breakdown.length - 1 &&
                  styles.breakdownLast,
              ]}
            >
              <View
                style={styles.breakdownIcon}
              >
                <Ionicons
                  name={icon as any}
                  size={19}
                  color={AuraColors.purple}
                />
              </View>

              <View
                style={styles.breakdownInfo}
              >
                <Text
                  style={
                    styles.breakdownLabel
                  }
                >
                  {label}
                </Text>

                <Text
                  style={
                    styles.breakdownValue
                  }
                >
                  {value}
                </Text>
              </View>
            </View>
          )
        )}
      </View>

      <Pressable
        style={styles.customizeButton}
        onPress={onCustomize}
      >
        <Ionicons
          name="options-outline"
          size={20}
          color={AuraColors.purple}
        />

        <Text style={styles.customizeText}>
          Customize This Look
        </Text>

        <Ionicons
          name="chevron-forward"
          size={18}
          color={AuraColors.purple}
        />
      </Pressable>

      <Pressable
        style={[
          styles.saveButton,
          saved && styles.savedButton,
        ]}
        onPress={onSave}
        disabled={saved}
      >
        <Ionicons
          name={
            saved
              ? 'heart'
              : 'heart-outline'
          }
          size={21}
          color={AuraColors.white}
        />

        <Text style={styles.saveButtonText}>
          {saved
            ? 'Saved to Your Looks'
            : 'Save This Look'}
        </Text>
      </Pressable>

      <Pressable
        style={styles.createAnotherButton}
        onPress={onCreateAnother}
      >
        <Ionicons
          name="sparkles-outline"
          size={18}
          color={AuraColors.purple}
        />

        <Text style={styles.createAnotherText}>
          Create Another Look
        </Text>
      </Pressable>

      <Text style={styles.hint}>
        You can customize this outfit before saving it.
      </Text>
    </View>
  );
}

/* =========================================================
   CUSTOMIZE SCREEN
========================================================= */

function CustomizeScreen({
  outfit,
  updateDraft,
  onBack,
  onApply,
}: {
  outfit: Outfit;
  updateDraft: (
    key: keyof Outfit,
    value: string
  ) => void;
  onBack: () => void;
  onApply: () => void;
}) {
  const choices: Record<
    keyof Outfit,
    string[]
  > = {
    top: [
      'Structured blouse',
      'Relaxed shirt',
      'Fitted top',
      'Classic blazer',
    ],

    bottom: [
      'Wide-leg trousers',
      'Straight-leg jeans',
      'Pleated trousers',
      'Midi skirt',
    ],

    footwear: [
      'Minimal sneakers',
      'Loafers',
      'Heeled sandals',
      'Ankle boots',
    ],

    bag: [
      'Structured shoulder bag',
      'Mini crossbody',
      'Tote bag',
      'Clutch',
    ],

    accessories: [
      'Gold accents',
      'Silver accents',
      'Minimal accessories',
      'Statement accessories',
    ],
  };

  const labels: Record<
    keyof Outfit,
    string
  > = {
    top: 'Top',
    bottom: 'Bottom',
    footwear: 'Footwear',
    bag: 'Bag',
    accessories: 'Accessories',
  };

  return (
    <View>
      <View style={styles.customizeHeader}>
        <Pressable
          style={styles.roundBack}
          onPress={onBack}
        >
          <Ionicons
            name="arrow-back"
            size={21}
            color={AuraColors.text}
          />
        </Pressable>

        <View>
          <Text style={styles.eyebrow}>
            CUSTOMIZE
          </Text>

          <Text
            style={styles.customizeHeading}
          >
            Make it yours.
          </Text>
        </View>
      </View>

      <Text style={styles.description}>
        Adjust individual pieces while keeping Aura's
        overall styling direction.
      </Text>

      {(Object.keys(choices) as Array<
        keyof Outfit
      >).map((key) => (
        <View
          key={key}
          style={styles.customSection}
        >
          <Text style={styles.sectionTitle}>
            {labels[key]}
          </Text>

          <View style={styles.customChoices}>
            {choices[key].map((choice) => {
              const selected =
                outfit[key] === choice;

              return (
                <Pressable
                  key={choice}
                  style={[
                    styles.customChoice,
                    selected &&
                      styles.customChoiceSelected,
                  ]}
                  onPress={() =>
                    updateDraft(
                      key,
                      choice
                    )
                  }
                >
                  <Text
                    style={[
                      styles.customChoiceText,
                      selected &&
                        styles.customChoiceTextSelected,
                    ]}
                  >
                    {choice}
                  </Text>

                  {selected && (
                    <Ionicons
                      name="checkmark-circle"
                      size={18}
                      color={
                        AuraColors.purple
                      }
                    />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>
      ))}

      <Pressable
        style={styles.applyButton}
        onPress={onApply}
      >
        <Ionicons
          name="checkmark"
          size={20}
          color={AuraColors.white}
        />

        <Text style={styles.applyButtonText}>
          Apply Changes
        </Text>
      </Pressable>

      <Pressable
        style={styles.cancelButton}
        onPress={onBack}
      >
        <Text style={styles.cancelButtonText}>
          Cancel
        </Text>
      </Pressable>
    </View>
  );
}

/* =========================================================
   SHARED BUTTONS
========================================================= */

function ContinueButton({
  disabled,
  label,
  onPress,
}: {
  disabled: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      style={[
        styles.continueButton,
        disabled &&
          styles.continueDisabled,
      ]}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={styles.continueText}>
        {label}
      </Text>

      <Ionicons
        name="arrow-forward"
        size={19}
        color={
          disabled
            ? AuraColors.textMuted
            : AuraColors.white
        }
      />
    </Pressable>
  );
}

function BackButton({
  onPress,
}: {
  onPress: () => void;
}) {
  return (
    <Pressable
      style={styles.backButton}
      onPress={onPress}
    >
      <Ionicons
        name="arrow-back"
        size={19}
        color={AuraColors.text}
      />
    </Pressable>
  );
}

/* =========================================================
   STYLES
========================================================= */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor:
      AuraColors.background,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 120,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  brand: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.8,
    color: AuraColors.purple,
  },

  headerTitle: {
    marginTop: 4,
    fontSize: 20,
    fontWeight: '700',
    color: AuraColors.text,
  },

  stepBadge: {
    backgroundColor:
      AuraColors.surfacePurple,
    paddingHorizontal: 13,
    paddingVertical: 9,
    borderRadius: AuraRadius.pill,
  },

  stepText: {
    fontSize: 12,
    fontWeight: '700',
    color: AuraColors.purple,
  },

  progressTrack: {
    height: 5,
    backgroundColor:
      AuraColors.border,
    borderRadius: 99,
    overflow: 'hidden',
    marginBottom: 30,
  },

  progressFill: {
    height: '100%',
    backgroundColor:
      AuraColors.purple,
    borderRadius: 99,
  },

  eyebrow: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: AuraColors.gold,
    marginBottom: 8,
  },

  heading: {
    ...AuraTypography.title,
    color: AuraColors.text,
    marginBottom: 8,
  },

  description: {
    ...AuraTypography.body,
    color: AuraColors.textSecondary,
    marginBottom: 24,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },

  occasionCard: {
    width: '48.2%',
    height: 158,
    borderRadius: AuraRadius.card,
    overflow: 'hidden',
    backgroundColor:
      AuraColors.surface,
    borderWidth: 2,
    borderColor:
      AuraColors.transparent,
    ...AuraShadow.soft,
  },

  selectedCard: {
    borderColor:
      AuraColors.gold,
  },

  cardImage: {
    width: '100%',
    height: '100%',
  },

  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:
      'rgba(15, 14, 35, 0.30)',
  },

  cardLabelWrap: {
    position: 'absolute',
    left: 14,
    bottom: 14,
    right: 10,
  },

  cardLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: AuraColors.white,
  },

  checkCircle: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 27,
    height: 27,
    borderRadius: 14,
    backgroundColor:
      AuraColors.purple,
    justifyContent: 'center',
    alignItems: 'center',
  },

  continueButton: {
    height: 54,
    borderRadius:
      AuraRadius.medium,
    backgroundColor:
      AuraColors.purple,
    marginTop: 26,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 9,
    ...AuraShadow.floating,
  },

  continueDisabled: {
    backgroundColor:
      AuraColors.border,
    shadowOpacity: 0,
    elevation: 0,
  },

  continueText: {
    ...AuraTypography.button,
    color: AuraColors.white,
  },

  hint: {
    textAlign: 'center',
    marginTop: 13,
    fontSize: 12,
    color: AuraColors.textMuted,
    lineHeight: 18,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: AuraColors.text,
    marginTop: 22,
    marginBottom: 12,
  },

  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },

  option: {
    width: '48.2%',
    minHeight: 52,
    paddingHorizontal: 14,
    borderRadius:
      AuraRadius.medium,
    backgroundColor:
      AuraColors.surface,
    borderWidth: 1,
    borderColor:
      AuraColors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  optionSelected: {
    backgroundColor:
      AuraColors.surfacePurple,
    borderColor:
      AuraColors.purple,
  },

  optionText: {
    fontSize: 14,
    fontWeight: '600',
    color: AuraColors.text,
  },

  optionTextSelected: {
    color: AuraColors.purple,
  },

  colorNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },

  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1,
    borderColor:
      AuraColors.border,
  },

  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'center',
    marginTop: 18,
  },

  flexButton: {
    flex: 1,
  },

  backButton: {
    width: 54,
    height: 54,
    borderRadius:
      AuraRadius.medium,
    backgroundColor:
      AuraColors.surface,
    borderWidth: 1,
    borderColor:
      AuraColors.border,
    justifyContent: 'center',
    alignItems: 'center',
  },

  inspirationCard: {
    width: '48.2%',
    minHeight: 118,
    borderRadius:
      AuraRadius.large,
    backgroundColor:
      AuraColors.surface,
    borderWidth: 1,
    borderColor:
      AuraColors.border,
    padding: 15,
  },

  inspirationIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor:
      AuraColors.surfacePurple,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },

  inspirationTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: AuraColors.text,
  },

  uploadBox: {
    marginTop: 18,
    minHeight: 125,
    borderRadius:
      AuraRadius.large,
    borderWidth: 1.5,
    borderColor:
      AuraColors.purple,
    borderStyle: 'dashed',
    backgroundColor:
      AuraColors.surfacePurple,
    justifyContent: 'center',
    alignItems: 'center',
  },

  uploadIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor:
      AuraColors.white,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 9,
  },

  uploadTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuraColors.text,
  },

  uploadSubtitle: {
    fontSize: 12,
    color: AuraColors.textSecondary,
    marginTop: 3,
  },

  inspirationImageGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },

  previewCard: {
    width: '48.2%',
    height: 180,
    borderRadius:
      AuraRadius.large,
    overflow: 'hidden',
  },

  previewImage: {
    width: '100%',
    height: '100%',
  },

  removeButton: {
    position: 'absolute',
    right: 9,
    top: 9,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor:
      'rgba(15,14,35,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  auraOrb: {
    alignItems: 'center',
    marginVertical: 32,
  },

  orbOuter: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: '#E9DDF8',
    justifyContent: 'center',
    alignItems: 'center',
  },

  orbMiddle: {
    width: 135,
    height: 135,
    borderRadius: 68,
    backgroundColor: '#C9A9EE',
    justifyContent: 'center',
    alignItems: 'center',
  },

  orbInner: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor:
      AuraColors.purple,
    justifyContent: 'center',
    alignItems: 'center',
    ...AuraShadow.floating,
  },

  generationCard: {
    backgroundColor:
      AuraColors.surface,
    borderRadius:
      AuraRadius.large,
    padding: 17,
    ...AuraShadow.soft,
  },

  generationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },

  generationCheck: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor:
      AuraColors.surfacePurple,
    justifyContent: 'center',
    alignItems: 'center',
  },

  generationCompleted: {
    backgroundColor:
      AuraColors.success,
  },

  generationActive: {
    backgroundColor:
      AuraColors.purple,
  },

  loadingDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor:
      AuraColors.white,
  },

  generationText: {
    marginLeft: 12,
    flex: 1,
  },

  generationTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuraColors.text,
  },

  generationSubtitle: {
    fontSize: 12,
    color: AuraColors.textSecondary,
    marginTop: 2,
  },

  aiNotice: {
    marginTop: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },

  aiNoticeText: {
    fontSize: 11,
    color: AuraColors.textMuted,
  },

  readyPill: {
    alignSelf: 'flex-start',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor:
      AuraColors.goldSoft,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius:
      AuraRadius.pill,
    marginBottom: 12,
  },

  readyPillText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
    color: AuraColors.gold,
  },

  modelCard: {
    height: 460,
    borderRadius:
      AuraRadius.card,
    overflow: 'hidden',
    backgroundColor:
      AuraColors.surface,
    ...AuraShadow.card,
  },

  modelImage: {
    width: '100%',
    height: '100%',
  },

  modelOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor:
      'rgba(15, 14, 35, 0.12)',
  },

  modelTopBadge: {
    position: 'absolute',
    left: 14,
    top: 14,
    backgroundColor:
      'rgba(15, 14, 35, 0.72)',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius:
      AuraRadius.pill,
  },

  modelBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.7,
    color: AuraColors.white,
  },

  scoreBadge: {
    position: 'absolute',
    right: 14,
    top: 14,
    backgroundColor:
      AuraColors.white,
    borderRadius:
      AuraRadius.pill,
    paddingHorizontal: 10,
    paddingVertical: 7,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  scoreText: {
    fontSize: 13,
    fontWeight: '800',
    color: AuraColors.text,
  },

  modelBottom: {
    position: 'absolute',
    left: 18,
    right: 18,
    bottom: 18,
  },

  lookTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: AuraColors.white,
  },

  lookSubtitle: {
    fontSize: 13,
    color: AuraColors.white,
    marginTop: 5,
  },

  breakdownCard: {
    backgroundColor:
      AuraColors.surface,
    borderRadius:
      AuraRadius.large,
    paddingHorizontal: 16,
    ...AuraShadow.soft,
  },

  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor:
      AuraColors.borderLight,
  },

  breakdownLast: {
    borderBottomWidth: 0,
  },

  breakdownIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor:
      AuraColors.surfacePurple,
    justifyContent: 'center',
    alignItems: 'center',
  },

  breakdownInfo: {
    marginLeft: 12,
  },

  breakdownLabel: {
    fontSize: 11,
    color: AuraColors.textMuted,
    fontWeight: '600',
  },

  breakdownValue: {
    fontSize: 14,
    color: AuraColors.text,
    fontWeight: '700',
    marginTop: 2,
  },

  customizeButton: {
    height: 54,
    borderRadius:
      AuraRadius.medium,
    backgroundColor:
      AuraColors.surfacePurple,
    marginTop: 18,
    borderWidth: 1,
    borderColor: '#DCCCF2',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  customizeText: {
    flex: 1,
    marginLeft: 9,
    fontSize: 14,
    fontWeight: '700',
    color: AuraColors.purple,
  },

  saveButton: {
    height: 54,
    borderRadius:
      AuraRadius.medium,
    backgroundColor:
      AuraColors.purple,
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...AuraShadow.floating,
  },

  savedButton: {
    backgroundColor:
      AuraColors.success,
    shadowOpacity: 0,
    elevation: 0,
  },

  saveButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: AuraColors.white,
  },

  createAnotherButton: {
    height: 50,
    borderRadius:
      AuraRadius.medium,
    marginTop: 10,
    borderWidth: 1,
    borderColor:
      AuraColors.border,
    backgroundColor:
      AuraColors.surface,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 7,
  },

  createAnotherText: {
    fontSize: 14,
    fontWeight: '700',
    color: AuraColors.purple,
  },

  customizeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 13,
    marginBottom: 10,
  },

  roundBack: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor:
      AuraColors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor:
      AuraColors.border,
  },

  customizeHeading: {
    fontSize: 25,
    fontWeight: '800',
    color: AuraColors.text,
  },

  customSection: {
    marginBottom: 4,
  },

  customChoices: {
    gap: 8,
  },

  customChoice: {
    minHeight: 50,
    paddingHorizontal: 14,
    borderRadius:
      AuraRadius.medium,
    backgroundColor:
      AuraColors.surface,
    borderWidth: 1,
    borderColor:
      AuraColors.border,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  customChoiceSelected: {
    backgroundColor:
      AuraColors.surfacePurple,
    borderColor:
      AuraColors.purple,
  },

  customChoiceText: {
    fontSize: 14,
    fontWeight: '600',
    color: AuraColors.text,
  },

  customChoiceTextSelected: {
    color: AuraColors.purple,
    fontWeight: '700',
  },

  applyButton: {
    height: 55,
    borderRadius:
      AuraRadius.medium,
    backgroundColor:
      AuraColors.purple,
    marginTop: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...AuraShadow.floating,
  },

  applyButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: AuraColors.white,
  },

  cancelButton: {
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },

  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: AuraColors.textSecondary,
  },
});