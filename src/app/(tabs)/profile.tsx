import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import {
    Alert,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    View
} from 'react-native';

import {
    AuraColors,
    AuraRadius,
    AuraShadow,
    AuraSpacing,
    AuraTypography,
} from '../../constants/auraTheme';

type ProfileData = {
  bodyType: string;
  skinTone: string;
  height: string;
  style: string;
  preferredColors: string[];
  occasions: string[];
  moods: string[];
};

const PROFILE_KEY = '@outfitaura_profile';
const NOTIFICATIONS_KEY = '@outfitaura_notifications';

const defaultProfile: ProfileData = {
  bodyType: 'Balanced',
  skinTone: 'Warm',
  height: 'Your profile',
  style: 'Modern',
  preferredColors: ['Neutrals', 'Black', 'Purple'],
  occasions: ['College', 'Casual', 'Date Night'],
  moods: ['Modern', 'Minimal', 'Elegant'],
};

const bodyTypes = [
  'Balanced',
  'Petite',
  'Tall',
  'Curvy',
  'Athletic',
  'Rectangle',
];

const skinTones = [
  'Very Fair',
  'Fair',
  'Warm',
  'Neutral',
  'Deep',
  'Rich',
];

const stylesList = [
  'Modern',
  'Minimal',
  'Elegant',
  'Classic',
  'Streetwear',
  'Boho',
];

const heights = [
  'Below 5 ft',
  '5\'0" – 5\'4"',
  '5\'5" – 5\'8"',
  '5\'9" – 6\'0"',
  'Above 6 ft',
];

const colorOptions = [
  'Neutrals',
  'Black',
  'White',
  'Purple',
  'Blue',
  'Brown',
  'Pink',
  'Green',
];

const occasionOptions = [
  'College',
  'Casual',
  'Date Night',
  'Party',
  'Interview',
  'Wedding',
  'Vacation',
  'Festival',
];

const moodOptions = [
  'Modern',
  'Minimal',
  'Elegant',
  'Confident',
  'Effortless',
  'Playful',
  'Bold',
  'Relaxed',
];

export default function ProfileScreen() {
  const [profile, setProfile] =
    useState<ProfileData>(defaultProfile);

  const [notificationsEnabled, setNotificationsEnabled] =
    useState(true);

  const [editVisible, setEditVisible] = useState(false);
  const [preferencesVisible, setPreferencesVisible] =
    useState(false);
  const [aboutVisible, setAboutVisible] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);

  const [draftProfile, setDraftProfile] =
    useState<ProfileData>(defaultProfile);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const savedProfile =
        await AsyncStorage.getItem(PROFILE_KEY);

      const savedNotifications =
        await AsyncStorage.getItem(NOTIFICATIONS_KEY);

      if (savedProfile) {
        const parsed = JSON.parse(savedProfile);

        setProfile({
          ...defaultProfile,
          ...parsed,
        });
      }

      if (savedNotifications !== null) {
        setNotificationsEnabled(
          savedNotifications === 'true'
        );
      }
    } catch (error) {
      console.log('Error loading profile:', error);
    }
  };

  const saveProfile = async (updatedProfile: ProfileData) => {
    try {
      await AsyncStorage.setItem(
        PROFILE_KEY,
        JSON.stringify(updatedProfile)
      );
    } catch (error) {
      console.log('Error saving profile:', error);
    }
  };

  const updateNotifications = async (value: boolean) => {
    setNotificationsEnabled(value);

    try {
      await AsyncStorage.setItem(
        NOTIFICATIONS_KEY,
        String(value)
      );
    } catch (error) {
      console.log('Error saving notification preference:', error);
    }
  };

  const completion = useMemo(() => {
    let completed = 0;

    if (profile.bodyType) completed += 1;
    if (profile.skinTone) completed += 1;
    if (profile.height && profile.height !== 'Your profile') {
      completed += 1;
    }
    if (profile.style) completed += 1;
    if (profile.preferredColors.length > 0) completed += 1;
    if (profile.occasions.length > 0) completed += 1;
    if (profile.moods.length > 0) completed += 1;

    return Math.round((completed / 7) * 100);
  }, [profile]);

  const auraScore = useMemo(() => {
    const base = 88;
    const bonus = Math.round(completion * 0.06);

    return Math.min(99, base + bonus);
  }, [completion]);

  const openEditProfile = () => {
    setDraftProfile({
      ...profile,
      preferredColors: [...profile.preferredColors],
      occasions: [...profile.occasions],
      moods: [...profile.moods],
    });

    setEditVisible(true);
  };

  const saveEditedProfile = async () => {
    if (draftProfile.preferredColors.length === 0) {
      Alert.alert(
        'Choose your colors',
        'Select at least one preferred color.'
      );
      return;
    }

    if (draftProfile.occasions.length === 0) {
      Alert.alert(
        'Choose your occasions',
        'Select at least one favorite occasion.'
      );
      return;
    }

    if (draftProfile.moods.length === 0) {
      Alert.alert(
        'Choose your style mood',
        'Select at least one style mood.'
      );
      return;
    }

    setProfile(draftProfile);
    await saveProfile(draftProfile);

    setEditVisible(false);

    Alert.alert(
      'Profile Updated ✨',
      'Your style preferences have been saved.'
    );
  };

  const toggleArrayValue = (
    key: 'preferredColors' | 'occasions' | 'moods',
    value: string
  ) => {
    setDraftProfile((current) => {
      const currentValues = current[key];

      const exists = currentValues.includes(value);

      const updatedValues = exists
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value];

      return {
        ...current,
        [key]: updatedValues,
      };
    });
  };

  const resetProfile = () => {
    Alert.alert(
      'Reset Style Profile?',
      'This will restore your default OutfitAura style preferences.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: async () => {
            setProfile(defaultProfile);
            setDraftProfile(defaultProfile);

            await AsyncStorage.setItem(
              PROFILE_KEY,
              JSON.stringify(defaultProfile)
            );

            Alert.alert(
              'Profile Reset',
              'Your default style profile has been restored.'
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>
              OUTFITAURA PROFILE
            </Text>

            <Text style={styles.title}>Your Aura</Text>

            <Text style={styles.subtitle}>
              Your style identity, all in one place.
            </Text>
          </View>

          <Pressable
            style={styles.settingsButton}
            onPress={() => setSettingsVisible(true)}
          >
            <Ionicons
              name="settings-outline"
              size={20}
              color={AuraColors.text}
            />
          </Pressable>
        </View>

        {/* PROFILE CARD */}
        <View style={styles.profileCard}>
          <View style={styles.profileTop}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>OA</Text>

              <View style={styles.onlineDot} />
            </View>

            <View style={styles.profileIdentity}>
              <Text style={styles.profileName}>
                Style Explorer
              </Text>

              <Text style={styles.profileRole}>
                OutfitAura member
              </Text>

              <View style={styles.profileStatus}>
                <View style={styles.statusDot} />

                <Text style={styles.statusText}>
                  Style profile active
                </Text>
              </View>
            </View>

            <Pressable
              style={styles.editIconButton}
              onPress={openEditProfile}
            >
              <Ionicons
                name="create-outline"
                size={18}
                color={AuraColors.purple}
              />
            </Pressable>
          </View>

          {/* AURA SCORE */}
          <View style={styles.scoreSection}>
            <View style={styles.scoreHeader}>
              <View>
                <Text style={styles.scoreLabel}>
                  AURA SCORE
                </Text>

                <Text style={styles.scoreNumber}>
                  {auraScore}
                  <Text style={styles.scoreOutOf}> / 100</Text>
                </Text>
              </View>

              <View style={styles.scoreIcon}>
                <Ionicons
                  name="sparkles"
                  size={22}
                  color={AuraColors.gold}
                />
              </View>
            </View>

            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {
                    width: `${auraScore}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.scoreDescription}>
              Your score reflects how complete your style profile
              is and helps Aura personalize recommendations.
            </Text>
          </View>
        </View>

        {/* PROFILE COMPLETION */}
        <Pressable
          style={styles.completionCard}
          onPress={openEditProfile}
        >
          <View style={styles.completionIcon}>
            <Ionicons
              name="person-outline"
              size={20}
              color={AuraColors.purple}
            />
          </View>

          <View style={styles.completionContent}>
            <View style={styles.completionHeader}>
              <Text style={styles.completionTitle}>
                Profile completeness
              </Text>

              <Text style={styles.completionPercent}>
                {completion}%
              </Text>
            </View>

            <View style={styles.completionTrack}>
              <View
                style={[
                  styles.completionFill,
                  {
                    width: `${completion}%`,
                  },
                ]}
              />
            </View>

            <Text style={styles.completionText}>
              {completion >= 90
                ? 'Your profile is ready for personalized styling.'
                : 'Complete your profile for better AI recommendations.'}
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={18}
            color={AuraColors.textMuted}
          />
        </Pressable>

        {/* STYLE SNAPSHOT */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Style Snapshot
              </Text>

              <Text style={styles.sectionSubtitle}>
                What OutfitAura knows about your style
              </Text>
            </View>

            <Pressable onPress={openEditProfile}>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>

          <View style={styles.snapshotGrid}>
            <SnapshotItem
              icon="body-outline"
              label="Body Type"
              value={profile.bodyType}
            />

            <SnapshotItem
              icon="color-palette-outline"
              label="Skin Tone"
              value={profile.skinTone}
            />

            <SnapshotItem
              icon="resize-outline"
              label="Height"
              value={profile.height}
            />

            <SnapshotItem
              icon="sparkles-outline"
              label="Style"
              value={profile.style}
            />
          </View>
        </View>

        {/* PREFERRED COLORS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Preferred Colors
              </Text>

              <Text style={styles.sectionSubtitle}>
                Colors Aura should prioritize
              </Text>
            </View>

            <Pressable onPress={openEditProfile}>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>

          <View style={styles.tagsCard}>
            {profile.preferredColors.map((color) => (
              <View
                key={color}
                style={styles.preferenceTag}
              >
                <View
                  style={[
                    styles.preferenceDot,
                    {
                      backgroundColor: getColorValue(color),
                    },
                  ]}
                />

                <Text style={styles.preferenceTagText}>
                  {color}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* FAVORITE OCCASIONS */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Favorite Occasions
              </Text>

              <Text style={styles.sectionSubtitle}>
                Where your outfits need to work
              </Text>
            </View>

            <Pressable onPress={openEditProfile}>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>

          <View style={styles.tagsCard}>
            {profile.occasions.map((occasion) => (
              <View
                key={occasion}
                style={styles.occasionTag}
              >
                <Ionicons
                  name="calendar-outline"
                  size={14}
                  color={AuraColors.purple}
                />

                <Text style={styles.occasionText}>
                  {occasion}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* STYLE MOOD */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                Style Mood
              </Text>

              <Text style={styles.sectionSubtitle}>
                The feeling behind your outfits
              </Text>
            </View>

            <Pressable onPress={openEditProfile}>
              <Text style={styles.editText}>Edit</Text>
            </Pressable>
          </View>

          <View style={styles.tagsCard}>
            {profile.moods.map((mood) => (
              <View
                key={mood}
                style={styles.moodTag}
              >
                <Ionicons
                  name="sparkles-outline"
                  size={14}
                  color={AuraColors.gold}
                />

                <Text style={styles.moodText}>{mood}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* APP PREFERENCES */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>
                App Preferences
              </Text>

              <Text style={styles.sectionSubtitle}>
                Customize your OutfitAura experience
              </Text>
            </View>
          </View>

          <View style={styles.settingsCard}>
            <SettingRow
              icon="sparkles-outline"
              title="AI Style Preferences"
              subtitle="Personalize your recommendations"
              onPress={() => setPreferencesVisible(true)}
            />

            <SettingRow
              icon="albums-outline"
              title="Collections"
              subtitle="View and organize saved looks"
              onPress={() => router.push('/saved')}
            />

            <View style={styles.settingRow}>
              <View style={styles.settingIcon}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={AuraColors.purple}
                />
              </View>

              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>
                  Notifications
                </Text>

                <Text style={styles.settingSubtitle}>
                  Style reminders and AI updates
                </Text>
              </View>

              <Switch
                value={notificationsEnabled}
                onValueChange={updateNotifications}
                trackColor={{
                  false: AuraColors.border,
                  true: AuraColors.purpleLight,
                }}
                thumbColor={
                  notificationsEnabled
                    ? AuraColors.purple
                    : AuraColors.white
                }
              />
            </View>

            <SettingRow
              icon="information-circle-outline"
              title="About OutfitAura"
              subtitle="Version 1.0.0"
              onPress={() => setAboutVisible(true)}
              last
            />
          </View>
        </View>

        {/* AI CARD */}
        <View style={styles.aiCard}>
          <View style={styles.aiTop}>
            <View style={styles.aiIcon}>
              <Ionicons
                name="sparkles"
                size={21}
                color={AuraColors.gold}
              />
            </View>

            <View style={styles.aiTextWrap}>
              <Text style={styles.aiEyebrow}>
                OUTFITAURA AI
              </Text>

              <Text style={styles.aiTitle}>
                Your style gets smarter with you.
              </Text>
            </View>
          </View>

          <Text style={styles.aiDescription}>
            Your profile powers Correct My Outfit, Create My Outfit
            and AuraMatch to make recommendations feel more
            personal.
          </Text>

          <Pressable
            style={styles.aiButton}
            onPress={() => router.push('/auramatch')}
          >
            <Text style={styles.aiButtonText}>
              Explore AuraMatch
            </Text>

            <Ionicons
              name="arrow-forward"
              size={16}
              color={AuraColors.white}
            />
          </Pressable>
        </View>

        {/* RESET */}
        <Pressable
          style={styles.resetButton}
          onPress={resetProfile}
        >
          <Ionicons
            name="refresh-outline"
            size={17}
            color={AuraColors.error}
          />

          <Text style={styles.resetText}>
            Reset Style Profile
          </Text>
        </Pressable>

        <Text style={styles.footer}>
          OutfitAura v1.0.0{'\n'}
          Your style, made smarter.
        </Text>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* EDIT PROFILE MODAL */}
      <Modal
        visible={editVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setEditVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.editModal}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>
                  STYLE PROFILE
                </Text>

                <Text style={styles.modalTitle}>
                  Edit Your Aura
                </Text>
              </View>

              <Pressable
                style={styles.closeButton}
                onPress={() => setEditVisible(false)}
              >
                <Ionicons
                  name="close"
                  size={21}
                  color={AuraColors.text}
                />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.modalScroll}
            >
              <OptionSection
                title="Body Type"
                options={bodyTypes}
                selected={draftProfile.bodyType}
                onSelect={(value) =>
                  setDraftProfile((current) => ({
                    ...current,
                    bodyType: value,
                  }))
                }
              />

              <OptionSection
                title="Skin Tone"
                options={skinTones}
                selected={draftProfile.skinTone}
                onSelect={(value) =>
                  setDraftProfile((current) => ({
                    ...current,
                    skinTone: value,
                  }))
                }
              />

              <OptionSection
                title="Height"
                options={heights}
                selected={draftProfile.height}
                onSelect={(value) =>
                  setDraftProfile((current) => ({
                    ...current,
                    height: value,
                  }))
                }
              />

              <OptionSection
                title="Personal Style"
                options={stylesList}
                selected={draftProfile.style}
                onSelect={(value) =>
                  setDraftProfile((current) => ({
                    ...current,
                    style: value,
                  }))
                }
              />

              <MultiOptionSection
                title="Preferred Colors"
                options={colorOptions}
                selected={draftProfile.preferredColors}
                onToggle={(value) =>
                  toggleArrayValue(
                    'preferredColors',
                    value
                  )
                }
              />

              <MultiOptionSection
                title="Favorite Occasions"
                options={occasionOptions}
                selected={draftProfile.occasions}
                onToggle={(value) =>
                  toggleArrayValue('occasions', value)
                }
              />

              <MultiOptionSection
                title="Style Mood"
                options={moodOptions}
                selected={draftProfile.moods}
                onToggle={(value) =>
                  toggleArrayValue('moods', value)
                }
              />

              <Pressable
                style={styles.saveProfileButton}
                onPress={saveEditedProfile}
              >
                <Ionicons
                  name="checkmark-circle-outline"
                  size={19}
                  color={AuraColors.white}
                />

                <Text style={styles.saveProfileText}>
                  Save Style Profile
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* AI PREFERENCES MODAL */}
      <Modal
        visible={preferencesVisible}
        animationType="slide"
        transparent
        onRequestClose={() =>
          setPreferencesVisible(false)
        }
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.preferenceModal}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>
                  OUTFITAURA AI
                </Text>

                <Text style={styles.modalTitle}>
                  AI Style Preferences
                </Text>
              </View>

              <Pressable
                style={styles.closeButton}
                onPress={() =>
                  setPreferencesVisible(false)
                }
              >
                <Ionicons
                  name="close"
                  size={21}
                  color={AuraColors.text}
                />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.preferenceScroll}
            >
              <View style={styles.aiPreferenceHero}>
                <View style={styles.aiPreferenceIcon}>
                  <Ionicons
                    name="sparkles"
                    size={25}
                    color={AuraColors.gold}
                  />
                </View>

                <Text style={styles.aiPreferenceTitle}>
                  How Aura styles for you
                </Text>

                <Text style={styles.aiPreferenceText}>
                  These preferences are used across Create My
                  Outfit, Correct My Outfit and AuraMatch.
                </Text>
              </View>

              <PreferenceSummary
                icon="body-outline"
                title="Your Shape"
                value={profile.bodyType}
              />

              <PreferenceSummary
                icon="color-palette-outline"
                title="Your Tone"
                value={profile.skinTone}
              />

              <PreferenceSummary
                icon="sparkles-outline"
                title="Your Style"
                value={profile.style}
              />

              <PreferenceSummary
                icon="color-filter-outline"
                title="Colors"
                value={profile.preferredColors.join(
                  ' • '
                )}
              />

              <PreferenceSummary
                icon="calendar-outline"
                title="Occasions"
                value={profile.occasions.join(' • ')}
              />

              <PreferenceSummary
                icon="happy-outline"
                title="Mood"
                value={profile.moods.join(' • ')}
              />

              <Pressable
                style={styles.editPreferencesButton}
                onPress={() => {
                  setPreferencesVisible(false);
                  setTimeout(openEditProfile, 250);
                }}
              >
                <Ionicons
                  name="create-outline"
                  size={18}
                  color={AuraColors.purple}
                />

                <Text style={styles.editPreferencesText}>
                  Edit Preferences
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ABOUT MODAL */}
      <Modal
        visible={aboutVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setAboutVisible(false)}
      >
        <View style={styles.centerBackdrop}>
          <View style={styles.aboutModal}>
            <View style={styles.aboutLogo}>
              <Ionicons
                name="sparkles"
                size={28}
                color={AuraColors.gold}
              />
            </View>

            <Text style={styles.aboutTitle}>
              OutfitAura
            </Text>

            <Text style={styles.aboutTagline}>
              Your style, made smarter.
            </Text>

            <View style={styles.aboutDivider} />

            <Text style={styles.aboutDescription}>
              OutfitAura is an AI-powered personal fashion assistant
              designed to help you analyze outfits, create
              personalized looks, discover style gaps and build a
              smarter digital wardrobe.
            </Text>

            <View style={styles.aboutFeatureRow}>
              <AboutFeature
                icon="scan-outline"
                text="Analyze"
              />

              <AboutFeature
                icon="sparkles-outline"
                text="Create"
              />

              <AboutFeature
                icon="shirt-outline"
                text="Customize"
              />

              <AboutFeature
                icon="bookmark-outline"
                text="Save"
              />
            </View>

            <Text style={styles.versionText}>
              Version 1.0.0
            </Text>

            <Pressable
              style={styles.aboutCloseButton}
              onPress={() => setAboutVisible(false)}
            >
              <Text style={styles.aboutCloseText}>
                Done
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* SETTINGS MODAL */}
      <Modal
        visible={settingsVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setSettingsVisible(false)}
      >
        <View style={styles.centerBackdrop}>
          <View style={styles.settingsModal}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>
                  APP SETTINGS
                </Text>

                <Text style={styles.modalTitle}>
                  Settings
                </Text>
              </View>

              <Pressable
                style={styles.closeButton}
                onPress={() => setSettingsVisible(false)}
              >
                <Ionicons
                  name="close"
                  size={21}
                  color={AuraColors.text}
                />
              </Pressable>
            </View>

            <Pressable
              style={styles.settingsOption}
              onPress={() => {
                setSettingsVisible(false);
                setTimeout(openEditProfile, 250);
              }}
            >
              <View style={styles.settingsOptionIcon}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={AuraColors.purple}
                />
              </View>

              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>
                  Edit Style Profile
                </Text>

                <Text style={styles.settingSubtitle}>
                  Update your personal style details
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={AuraColors.textMuted}
              />
            </Pressable>

            <Pressable
              style={styles.settingsOption}
              onPress={() => {
                setSettingsVisible(false);
                setTimeout(
                  () => setPreferencesVisible(true),
                  250
                );
              }}
            >
              <View style={styles.settingsOptionIcon}>
                <Ionicons
                  name="sparkles-outline"
                  size={20}
                  color={AuraColors.purple}
                />
              </View>

              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>
                  AI Preferences
                </Text>

                <Text style={styles.settingSubtitle}>
                  Control how Aura styles for you
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={AuraColors.textMuted}
              />
            </Pressable>

            <Pressable
              style={styles.settingsOption}
              onPress={() => {
                setSettingsVisible(false);
                router.push('/saved');
              }}
            >
              <View style={styles.settingsOptionIcon}>
                <Ionicons
                  name="albums-outline"
                  size={20}
                  color={AuraColors.purple}
                />
              </View>

              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>
                  My Collections
                </Text>

                <Text style={styles.settingSubtitle}>
                  Manage your saved style boards
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={AuraColors.textMuted}
              />
            </Pressable>

            <View style={styles.settingsOption}>
              <View style={styles.settingsOptionIcon}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={AuraColors.purple}
                />
              </View>

              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>
                  Notifications
                </Text>

                <Text style={styles.settingSubtitle}>
                  {notificationsEnabled
                    ? 'Currently enabled'
                    : 'Currently disabled'}
                </Text>
              </View>

              <Switch
                value={notificationsEnabled}
                onValueChange={updateNotifications}
                trackColor={{
                  false: AuraColors.border,
                  true: AuraColors.purpleLight,
                }}
                thumbColor={
                  notificationsEnabled
                    ? AuraColors.purple
                    : AuraColors.white
                }
              />
            </View>

            <Pressable
              style={styles.settingsOption}
              onPress={() => {
                setSettingsVisible(false);
                setTimeout(() => setAboutVisible(true), 250);
              }}
            >
              <View style={styles.settingsOptionIcon}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={AuraColors.purple}
                />
              </View>

              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>
                  About
                </Text>

                <Text style={styles.settingSubtitle}>
                  OutfitAura v1.0.0
                </Text>
              </View>

              <Ionicons
                name="chevron-forward"
                size={18}
                color={AuraColors.textMuted}
              />
            </Pressable>

            <Pressable
              style={styles.settingsDoneButton}
              onPress={() => setSettingsVisible(false)}
            >
              <Text style={styles.settingsDoneText}>
                Done
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

/* -------------------------------------------------- */
/* REUSABLE COMPONENTS */
/* -------------------------------------------------- */

function SnapshotItem({
  icon,
  label,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
}) {
  return (
    <View style={styles.snapshotItem}>
      <View style={styles.snapshotIcon}>
        <Ionicons
          name={icon}
          size={19}
          color={AuraColors.purple}
        />
      </View>

      <Text style={styles.snapshotLabel}>{label}</Text>

      <Text
        style={styles.snapshotValue}
        numberOfLines={1}
      >
        {value}
      </Text>
    </View>
  );
}

function SettingRow({
  icon,
  title,
  subtitle,
  onPress,
  last = false,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
  last?: boolean;
}) {
  return (
    <Pressable
      style={[
        styles.settingRow,
        last && styles.settingRowLast,
      ]}
      onPress={onPress}
    >
      <View style={styles.settingIcon}>
        <Ionicons
          name={icon}
          size={20}
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
        size={18}
        color={AuraColors.textMuted}
      />
    </Pressable>
  );
}

function OptionSection({
  title,
  options,
  selected,
  onSelect,
}: {
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}) {
  return (
    <View style={styles.optionSection}>
      <Text style={styles.optionTitle}>{title}</Text>

      <View style={styles.optionGrid}>
        {options.map((option) => {
          const active = selected === option;

          return (
            <Pressable
              key={option}
              onPress={() => onSelect(option)}
              style={[
                styles.optionChip,
                active && styles.optionChipActive,
              ]}
            >
              <Text
                style={[
                  styles.optionChipText,
                  active &&
                    styles.optionChipTextActive,
                ]}
              >
                {option}
              </Text>

              {active && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color={AuraColors.white}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function MultiOptionSection({
  title,
  options,
  selected,
  onToggle,
}: {
  title: string;
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <View style={styles.optionSection}>
      <View style={styles.multiTitleRow}>
        <Text style={styles.optionTitle}>{title}</Text>

        <Text style={styles.multiHint}>
          Select multiple
        </Text>
      </View>

      <View style={styles.optionGrid}>
        {options.map((option) => {
          const active = selected.includes(option);

          return (
            <Pressable
              key={option}
              onPress={() => onToggle(option)}
              style={[
                styles.optionChip,
                active && styles.optionChipActive,
              ]}
            >
              <Text
                style={[
                  styles.optionChipText,
                  active &&
                    styles.optionChipTextActive,
                ]}
              >
                {option}
              </Text>

              {active && (
                <Ionicons
                  name="checkmark"
                  size={14}
                  color={AuraColors.white}
                />
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

function PreferenceSummary({
  icon,
  title,
  value,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  value: string;
}) {
  return (
    <View style={styles.preferenceSummary}>
      <View style={styles.preferenceSummaryIcon}>
        <Ionicons
          name={icon}
          size={19}
          color={AuraColors.purple}
        />
      </View>

      <View style={styles.preferenceSummaryText}>
        <Text style={styles.preferenceSummaryTitle}>
          {title}
        </Text>

        <Text style={styles.preferenceSummaryValue}>
          {value}
        </Text>
      </View>
    </View>
  );
}

function AboutFeature({
  icon,
  text,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  text: string;
}) {
  return (
    <View style={styles.aboutFeature}>
      <Ionicons
        name={icon}
        size={18}
        color={AuraColors.purple}
      />

      <Text style={styles.aboutFeatureText}>
        {text}
      </Text>
    </View>
  );
}

function getColorValue(color: string) {
  switch (color.toLowerCase()) {
    case 'black':
      return '#171717';

    case 'white':
      return '#F8F8F8';

    case 'neutrals':
      return '#B9A48C';

    case 'purple':
      return '#6537D8';

    case 'blue':
      return '#4C78A8';

    case 'brown':
      return '#795548';

    case 'pink':
      return '#D98BA5';

    case 'green':
      return '#718C73';

    default:
      return '#B8B8B8';
  }
}

/* -------------------------------------------------- */
/* STYLES */
/* -------------------------------------------------- */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AuraColors.background,
  },

  scrollContent: {
    paddingHorizontal: AuraSpacing.xl,
    paddingTop: AuraSpacing.lg,
    paddingBottom: 110,
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  eyebrow: {
    ...AuraTypography.label,
    color: AuraColors.purple,
    marginBottom: 4,
  },

  title: {
    ...AuraTypography.title,
    color: AuraColors.text,
  },

  subtitle: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    marginTop: 3,
  },

  settingsButton: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  profileCard: {
    backgroundColor: AuraColors.navy,
    borderRadius: AuraRadius.extraLarge,
    padding: AuraSpacing.xl,
    ...AuraShadow.card,
  },

  profileTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  avatar: {
    width: 66,
    height: 66,
    borderRadius: 23,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  avatarText: {
    fontSize: 20,
    fontWeight: '800',
    color: AuraColors.purple,
    letterSpacing: 1,
  },

  onlineDot: {
    position: 'absolute',
    width: 13,
    height: 13,
    borderRadius: 7,
    right: -1,
    bottom: 2,
    backgroundColor: AuraColors.gold,
    borderWidth: 2,
    borderColor: AuraColors.navy,
  },

  profileIdentity: {
    flex: 1,
    marginLeft: 14,
  },

  profileName: {
    ...AuraTypography.subheading,
    color: AuraColors.white,
  },

  profileRole: {
    ...AuraTypography.small,
    color: '#C9C7D9',
    marginTop: 2,
  },

  profileStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    gap: 5,
  },

  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AuraColors.success,
  },

  statusText: {
    fontSize: 10,
    color: '#D9D7E8',
  },

  editIconButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: AuraColors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  scoreSection: {
    marginTop: 22,
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
  },

  scoreHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  scoreLabel: {
    ...AuraTypography.label,
    color: AuraColors.goldLight,
  },

  scoreNumber: {
    fontSize: 31,
    fontWeight: '800',
    color: AuraColors.white,
    marginTop: 2,
  },

  scoreOutOf: {
    fontSize: 13,
    fontWeight: '500',
    color: '#BDB9D0',
  },

  scoreIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: 'rgba(201,154,74,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  progressTrack: {
    height: 7,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
    marginTop: 10,
  },

  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: AuraColors.gold,
  },

  scoreDescription: {
    ...AuraTypography.small,
    color: '#C9C7D9',
    lineHeight: 18,
    marginTop: 9,
  },

  completionCard: {
    marginTop: 15,
    padding: 15,
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.large,
    borderWidth: 1,
    borderColor: AuraColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    ...AuraShadow.soft,
  },

  completionIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  completionContent: {
    flex: 1,
    marginRight: 10,
  },

  completionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  completionTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.text,
  },

  completionPercent: {
    fontSize: 12,
    fontWeight: '800',
    color: AuraColors.purple,
  },

  completionTrack: {
    height: 5,
    borderRadius: 3,
    backgroundColor: AuraColors.surfaceSoft,
    overflow: 'hidden',
    marginTop: 8,
  },

  completionFill: {
    height: '100%',
    borderRadius: 3,
    backgroundColor: AuraColors.purple,
  },

  completionText: {
    ...AuraTypography.small,
    color: AuraColors.textMuted,
    marginTop: 6,
    lineHeight: 17,
  },

  section: {
    marginTop: 28,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 12,
  },

  sectionTitle: {
    ...AuraTypography.subheading,
    color: AuraColors.text,
  },

  sectionSubtitle: {
    ...AuraTypography.small,
    color: AuraColors.textMuted,
    marginTop: 2,
  },

  editText: {
    ...AuraTypography.small,
    color: AuraColors.purple,
    fontWeight: '700',
  },

  snapshotGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 10,
  },

  snapshotItem: {
    width: '48.2%',
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.large,
    padding: 14,
    borderWidth: 1,
    borderColor: AuraColors.borderLight,
  },

  snapshotIcon: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  snapshotLabel: {
    fontSize: 10,
    color: AuraColors.textMuted,
    fontWeight: '600',
  },

  snapshotValue: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.text,
    marginTop: 3,
  },

  tagsCard: {
    padding: 13,
    borderRadius: AuraRadius.large,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  preferenceTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.surfacePurple,
  },

  preferenceDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  preferenceTagText: {
    fontSize: 11,
    fontWeight: '600',
    color: AuraColors.text,
  },

  occasionTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.surfacePurple,
  },

  occasionText: {
    fontSize: 11,
    fontWeight: '600',
    color: AuraColors.purple,
  },

  moodTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.goldSoft,
  },

  moodText: {
    fontSize: 11,
    fontWeight: '600',
    color: AuraColors.text,
  },

  settingsCard: {
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.large,
    borderWidth: 1,
    borderColor: AuraColors.border,
    overflow: 'hidden',
  },

  settingRow: {
    minHeight: 72,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: AuraColors.borderLight,
  },

  settingRowLast: {
    borderBottomWidth: 0,
  },

  settingIcon: {
    width: 41,
    height: 41,
    borderRadius: 13,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  settingText: {
    flex: 1,
  },

  settingTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.text,
  },

  settingSubtitle: {
    ...AuraTypography.small,
    color: AuraColors.textMuted,
    marginTop: 2,
  },

  aiCard: {
    marginTop: 28,
    padding: AuraSpacing.xl,
    borderRadius: AuraRadius.extraLarge,
    backgroundColor: AuraColors.navy,
  },

  aiTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  aiIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: 'rgba(201,154,74,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  aiTextWrap: {
    flex: 1,
  },

  aiEyebrow: {
    ...AuraTypography.label,
    color: AuraColors.goldLight,
  },

  aiTitle: {
    ...AuraTypography.subheading,
    color: AuraColors.white,
    marginTop: 2,
  },

  aiDescription: {
    ...AuraTypography.small,
    color: '#D9D7E8',
    lineHeight: 19,
    marginTop: 13,
  },

  aiButton: {
    alignSelf: 'flex-start',
    marginTop: 15,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.purple,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  aiButtonText: {
    ...AuraTypography.small,
    color: AuraColors.white,
    fontWeight: '700',
  },

  resetButton: {
    marginTop: 22,
    minHeight: 45,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },

  resetText: {
    ...AuraTypography.small,
    color: AuraColors.error,
    fontWeight: '700',
  },

  footer: {
    ...AuraTypography.small,
    color: AuraColors.textMuted,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 12,
  },

  bottomSpace: {
    height: 25,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,19,47,0.58)',
    justifyContent: 'flex-end',
  },

  centerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,19,47,0.58)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 23,
  },

  editModal: {
    height: '91%',
    backgroundColor: AuraColors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: AuraSpacing.xl,
  },

  preferenceModal: {
    height: '86%',
    backgroundColor: AuraColors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: AuraSpacing.xl,
  },

  modalHandle: {
    alignSelf: 'center',
    width: 42,
    height: 5,
    borderRadius: 3,
    backgroundColor: AuraColors.border,
    marginTop: 10,
    marginBottom: 10,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  modalEyebrow: {
    ...AuraTypography.label,
    color: AuraColors.purple,
    marginBottom: 3,
  },

  modalTitle: {
    ...AuraTypography.heading,
    color: AuraColors.text,
  },

  closeButton: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalScroll: {
    paddingTop: 8,
    paddingBottom: 35,
  },

  optionSection: {
    marginTop: 18,
  },

  optionTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.text,
    marginBottom: 9,
  },

  multiTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  multiHint: {
    fontSize: 10,
    color: AuraColors.textMuted,
    marginBottom: 9,
  },

  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },

  optionChip: {
    minHeight: 38,
    paddingHorizontal: 12,
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },

  optionChipActive: {
    backgroundColor: AuraColors.purple,
    borderColor: AuraColors.purple,
  },

  optionChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: AuraColors.textSecondary,
  },

  optionChipTextActive: {
    color: AuraColors.white,
  },

  saveProfileButton: {
    height: 53,
    marginTop: 25,
    borderRadius: AuraRadius.medium,
    backgroundColor: AuraColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
    ...AuraShadow.floating,
  },

  saveProfileText: {
    ...AuraTypography.button,
    color: AuraColors.white,
  },

  preferenceScroll: {
    paddingTop: 10,
    paddingBottom: 35,
  },

  aiPreferenceHero: {
    padding: 18,
    borderRadius: AuraRadius.large,
    backgroundColor: AuraColors.navy,
    marginBottom: 15,
  },

  aiPreferenceIcon: {
    width: 47,
    height: 47,
    borderRadius: 15,
    backgroundColor: 'rgba(201,154,74,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },

  aiPreferenceTitle: {
    ...AuraTypography.subheading,
    color: AuraColors.white,
  },

  aiPreferenceText: {
    ...AuraTypography.small,
    color: '#D9D7E8',
    lineHeight: 19,
    marginTop: 4,
  },

  preferenceSummary: {
    minHeight: 65,
    padding: 11,
    borderRadius: AuraRadius.medium,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  preferenceSummaryIcon: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  preferenceSummaryText: {
    flex: 1,
  },

  preferenceSummaryTitle: {
    fontSize: 10,
    color: AuraColors.textMuted,
    fontWeight: '600',
  },

  preferenceSummaryValue: {
    ...AuraTypography.small,
    color: AuraColors.text,
    fontWeight: '600',
    marginTop: 2,
  },

  editPreferencesButton: {
    height: 50,
    marginTop: 12,
    borderRadius: AuraRadius.medium,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },

  editPreferencesText: {
    ...AuraTypography.button,
    color: AuraColors.purple,
  },

  aboutModal: {
    width: '100%',
    backgroundColor: AuraColors.background,
    borderRadius: 27,
    padding: 23,
    alignItems: 'center',
    ...AuraShadow.card,
  },

  aboutLogo: {
    width: 62,
    height: 62,
    borderRadius: 21,
    backgroundColor: AuraColors.navy,
    alignItems: 'center',
    justifyContent: 'center',
  },

  aboutTitle: {
    ...AuraTypography.title,
    color: AuraColors.text,
    marginTop: 13,
  },

  aboutTagline: {
    ...AuraTypography.small,
    color: AuraColors.purple,
    fontWeight: '600',
    marginTop: 2,
  },

  aboutDivider: {
    width: '100%',
    height: 1,
    backgroundColor: AuraColors.border,
    marginVertical: 18,
  },

  aboutDescription: {
    ...AuraTypography.body,
    color: AuraColors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },

  aboutFeatureRow: {
    width: '100%',
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  aboutFeature: {
    alignItems: 'center',
    gap: 5,
  },

  aboutFeatureText: {
    fontSize: 10,
    color: AuraColors.textMuted,
    fontWeight: '600',
  },

  versionText: {
    fontSize: 10,
    color: AuraColors.textMuted,
    marginTop: 20,
  },

  aboutCloseButton: {
    width: '100%',
    height: 48,
    borderRadius: AuraRadius.medium,
    backgroundColor: AuraColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 14,
  },

  aboutCloseText: {
    ...AuraTypography.button,
    color: AuraColors.white,
  },

  settingsModal: {
    width: '100%',
    backgroundColor: AuraColors.background,
    borderRadius: 27,
    padding: 20,
    ...AuraShadow.card,
  },

  settingsOption: {
    minHeight: 68,
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.medium,
    borderWidth: 1,
    borderColor: AuraColors.border,
    paddingHorizontal: 11,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },

  settingsOptionIcon: {
    width: 40,
    height: 40,
    borderRadius: 13,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  settingsDoneButton: {
    height: 49,
    borderRadius: AuraRadius.medium,
    backgroundColor: AuraColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5,
  },

  settingsDoneText: {
    ...AuraTypography.button,
    color: AuraColors.white,
  },
});