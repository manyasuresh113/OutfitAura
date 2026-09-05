import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
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
    AuraTypography
} from '../../constants/auraTheme';

const SAVED_LOOKS_KEY = '@outfitaura_saved_looks';

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

const demoLooks: SavedLook[] = [
  {
    id: 'demo-1',
    title: 'Effortless Minimal',
    subtitle: 'Modern • Confident',
    score: 9.4,
    occasion: 'College',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800',
    outfit: {
      top: 'Classic shirt',
      bottom: 'Straight-leg jeans',
      footwear: 'Minimal sneakers',
      bag: 'Tote bag',
      accessories: 'Minimal accessories',
    },
    createdAt: '',
  },
  {
    id: 'demo-2',
    title: 'City Casual',
    subtitle: 'Streetwear • Effortless',
    score: 9.1,
    occasion: 'Casual',
    image:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800',
    outfit: {
      top: 'Relaxed shirt',
      bottom: 'Wide-leg trousers',
      footwear: 'Minimal sneakers',
      bag: 'Crossbody',
      accessories: 'Minimal accessories',
    },
    createdAt: '',
  },
  {
    id: 'demo-3',
    title: 'Soft Elegance',
    subtitle: 'Elegant • Confident',
    score: 9.6,
    occasion: 'Date',
    image:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
    outfit: {
      top: 'Structured blouse',
      bottom: 'Midi skirt',
      footwear: 'Heeled sandals',
      bag: 'Clutch',
      accessories: 'Gold accents',
    },
    createdAt: '',
  },
  {
    id: 'demo-4',
    title: 'Weekend Ease',
    subtitle: 'Classic • Effortless',
    score: 8.9,
    occasion: 'Vacation',
    image:
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    outfit: {
      top: 'Relaxed shirt',
      bottom: 'Straight-leg jeans',
      footwear: 'Loafers',
      bag: 'Tote bag',
      accessories: 'Minimal accessories',
    },
    createdAt: '',
  },
];

export default function Saved() {
  const router = useRouter();

  const [savedLooks, setSavedLooks] =
    useState<SavedLook[]>(demoLooks);

  const [selectedFilter, setSelectedFilter] =
    useState('All');

  const [liked, setLiked] = useState<string[]>([]);

  const loadSavedLooks = async () => {
    try {
      const stored = await AsyncStorage.getItem(
        SAVED_LOOKS_KEY
      );

      if (stored) {
        const userLooks: SavedLook[] = JSON.parse(stored);

        setSavedLooks([
          ...userLooks,
          ...demoLooks,
        ]);
      } else {
        setSavedLooks(demoLooks);
      }
    } catch (error) {
      console.log(error);
      setSavedLooks(demoLooks);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSavedLooks();
    }, [])
  );

  const toggleLike = (id: string) => {
    setLiked((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  const deleteLook = async (id: string) => {
    if (id.startsWith('demo-')) {
      Alert.alert(
        'Demo Look',
        'This sample look cannot be deleted.'
      );
      return;
    }

    Alert.alert(
      'Delete Look?',
      'This saved outfit will be removed from your Saved Looks.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const stored = await AsyncStorage.getItem(
                SAVED_LOOKS_KEY
              );

              const looks: SavedLook[] = stored
                ? JSON.parse(stored)
                : [];

              const updated = looks.filter(
                (look) => look.id !== id
              );

              await AsyncStorage.setItem(
                SAVED_LOOKS_KEY,
                JSON.stringify(updated)
              );

              loadSavedLooks();
            } catch (error) {
              console.log(error);
            }
          },
        },
      ]
    );
  };

  const filters = [
    'All',
    'College',
    'Casual',
    'Date',
    'Vacation',
  ];

  const filteredLooks =
    selectedFilter === 'All'
      ? savedLooks
      : savedLooks.filter(
          (look) => look.occasion === selectedFilter
        );

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scroll}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>YOUR STYLE LIBRARY</Text>

            <Text style={styles.title}>Saved Looks</Text>

            <Text style={styles.subtitle}>
              Your favorite Aura creations, all in one place.
            </Text>
          </View>

          <View style={styles.countBadge}>
            <Text style={styles.countText}>
              {savedLooks.length}
            </Text>

            <Text style={styles.countLabel}>LOOKS</Text>
          </View>
        </View>

        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Ionicons
              name="heart"
              size={22}
              color={AuraColors.purple}
            />
          </View>

          <View style={styles.introText}>
            <Text style={styles.introTitle}>
              Your personal style collection
            </Text>

            <Text style={styles.introSubtitle}>
              Save outfits you love and come back to them
              whenever you need inspiration.
            </Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filters}
        >
          {filters.map((filter) => {
            const active = selectedFilter === filter;

            return (
              <Pressable
                key={filter}
                style={[
                  styles.filter,
                  active && styles.filterActive,
                ]}
                onPress={() => setSelectedFilter(filter)}
              >
                <Text
                  style={[
                    styles.filterText,
                    active && styles.filterTextActive,
                  ]}
                >
                  {filter}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        <View style={styles.lookGrid}>
          {filteredLooks.map((look) => (
            <Pressable
              key={look.id}
              style={styles.lookCard}
              onLongPress={() => deleteLook(look.id)}
            >
              <Image
                source={{ uri: look.image }}
                style={styles.lookImage}
              />

              <View style={styles.lookOverlay} />

              <View style={styles.occasionBadge}>
                <Text style={styles.occasionText}>
                  {look.occasion}
                </Text>
              </View>

              <View style={styles.scoreBadge}>
                <Ionicons
                  name="sparkles"
                  size={11}
                  color={AuraColors.gold}
                />

                <Text style={styles.scoreText}>
                  {look.score}
                </Text>
              </View>

              <Pressable
                style={styles.heartButton}
                onPress={() => toggleLike(look.id)}
              >
                <Ionicons
                  name={
                    liked.includes(look.id)
                      ? 'heart'
                      : 'heart-outline'
                  }
                  size={18}
                  color={
                    liked.includes(look.id)
                      ? AuraColors.error
                      : AuraColors.white
                  }
                />
              </Pressable>

              <View style={styles.lookInfo}>
                <Text style={styles.lookTitle}>
                  {look.title}
                </Text>

                <Text style={styles.lookSubtitle}>
                  {look.subtitle}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>

        {filteredLooks.length === 0 && (
          <View style={styles.emptyState}>
            <Ionicons
              name="heart-outline"
              size={38}
              color={AuraColors.purple}
            />

            <Text style={styles.emptyTitle}>
              No looks here yet
            </Text>

            <Text style={styles.emptyText}>
              Create an outfit for this occasion and save it
              here.
            </Text>
          </View>
        )}

        <Pressable
          style={styles.collectionCard}
          onPress={() =>
            Alert.alert(
              'Collections',
              'Collections are coming next. Your saved looks are already being stored.'
            )
          }
        >
          <View style={styles.collectionIcon}>
            <Ionicons
              name="albums-outline"
              size={22}
              color={AuraColors.purple}
            />
          </View>

          <View style={styles.collectionText}>
            <Text style={styles.collectionTitle}>
              Organize into Collections
            </Text>

            <Text style={styles.collectionSubtitle}>
              Build college, date night, travel and seasonal
              lookbooks.
            </Text>
          </View>

          <Ionicons
            name="chevron-forward"
            size={20}
            color={AuraColors.textMuted}
          />
        </Pressable>

        <View style={styles.aiCard}>
          <View style={styles.aiIcon}>
            <Ionicons
              name="sparkles"
              size={21}
              color={AuraColors.gold}
            />
          </View>

          <View style={styles.aiText}>
            <Text style={styles.aiTitle}>
              Your saved looks tell a story.
            </Text>

            <Text style={styles.aiSubtitle}>
              Create another outfit and keep building your
              personal style library.
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.createButton}
          onPress={() => router.push('/create')}
        >
          <Ionicons
            name="sparkles-outline"
            size={19}
            color={AuraColors.white}
          />

          <Text style={styles.createButtonText}>
            Create New Look
          </Text>
        </Pressable>

        <Text style={styles.footer}>
          OUTFITAURA · Your style, made smarter.
        </Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: AuraColors.background,
  },

  scroll: {
    paddingHorizontal: 20,
    paddingTop: 58,
    paddingBottom: 120,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  eyebrow: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1.5,
    color: AuraColors.gold,
    marginBottom: 5,
  },

  title: {
    ...AuraTypography.title,
    color: AuraColors.text,
  },

  subtitle: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    marginTop: 5,
    maxWidth: 250,
  },

  countBadge: {
    backgroundColor: AuraColors.surfacePurple,
    borderRadius: AuraRadius.large,
    paddingHorizontal: 13,
    paddingVertical: 10,
    alignItems: 'center',
  },

  countText: {
    fontSize: 20,
    fontWeight: '800',
    color: AuraColors.purple,
  },

  countLabel: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 1,
    color: AuraColors.textSecondary,
  },

  introCard: {
    marginTop: 22,
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.large,
    padding: 15,
    flexDirection: 'row',
    ...AuraShadow.soft,
  },

  introIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: AuraColors.surfacePurple,
    justifyContent: 'center',
    alignItems: 'center',
  },

  introText: {
    flex: 1,
    marginLeft: 12,
  },

  introTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuraColors.text,
  },

  introSubtitle: {
    fontSize: 12,
    color: AuraColors.textSecondary,
    lineHeight: 17,
    marginTop: 3,
  },

  filters: {
    gap: 8,
    paddingVertical: 18,
  },

  filter: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  filterActive: {
    backgroundColor: AuraColors.purple,
    borderColor: AuraColors.purple,
  },

  filterText: {
    fontSize: 12,
    fontWeight: '700',
    color: AuraColors.textSecondary,
  },

  filterTextActive: {
    color: AuraColors.white,
  },

  lookGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 14,
  },

  lookCard: {
    width: '48.2%',
    height: 270,
    borderRadius: AuraRadius.card,
    overflow: 'hidden',
    backgroundColor: AuraColors.surface,
    ...AuraShadow.soft,
  },

  lookImage: {
    width: '100%',
    height: '100%',
  },

  lookOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 14, 35, 0.28)',
  },

  occasionBadge: {
    position: 'absolute',
    top: 11,
    left: 11,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: AuraRadius.pill,
  },

  occasionText: {
    fontSize: 9,
    fontWeight: '800',
    color: AuraColors.purple,
  },

  scoreBadge: {
    position: 'absolute',
    top: 11,
    right: 11,
    backgroundColor: AuraColors.white,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: AuraRadius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },

  scoreText: {
    fontSize: 10,
    fontWeight: '800',
    color: AuraColors.text,
  },

  heartButton: {
    position: 'absolute',
    right: 10,
    bottom: 64,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(15,14,35,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  lookInfo: {
    position: 'absolute',
    left: 13,
    right: 10,
    bottom: 13,
  },

  lookTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: AuraColors.white,
  },

  lookSubtitle: {
    fontSize: 10,
    color: AuraColors.white,
    marginTop: 3,
  },

  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },

  emptyTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: AuraColors.text,
    marginTop: 10,
  },

  emptyText: {
    textAlign: 'center',
    fontSize: 12,
    color: AuraColors.textSecondary,
    marginTop: 5,
    maxWidth: 260,
    lineHeight: 18,
  },

  collectionCard: {
    marginTop: 22,
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.large,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    ...AuraShadow.soft,
  },

  collectionIcon: {
    width: 43,
    height: 43,
    borderRadius: 14,
    backgroundColor: AuraColors.surfacePurple,
    justifyContent: 'center',
    alignItems: 'center',
  },

  collectionText: {
    flex: 1,
    marginLeft: 12,
  },

  collectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuraColors.text,
  },

  collectionSubtitle: {
    fontSize: 11,
    color: AuraColors.textSecondary,
    lineHeight: 16,
    marginTop: 3,
  },

  aiCard: {
    marginTop: 14,
    padding: 15,
    borderRadius: AuraRadius.large,
    backgroundColor: AuraColors.navy,
    flexDirection: 'row',
  },

  aiIcon: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: AuraColors.navySoft,
    justifyContent: 'center',
    alignItems: 'center',
  },

  aiText: {
    flex: 1,
    marginLeft: 12,
  },

  aiTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: AuraColors.white,
  },

  aiSubtitle: {
    fontSize: 11,
    lineHeight: 16,
    color: '#D7D3E2',
    marginTop: 3,
  },

  createButton: {
    height: 53,
    borderRadius: AuraRadius.medium,
    backgroundColor: AuraColors.purple,
    marginTop: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
    ...AuraShadow.floating,
  },

  createButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: AuraColors.white,
  },

  footer: {
    textAlign: 'center',
    marginTop: 24,
    fontSize: 10,
    color: AuraColors.textMuted,
    letterSpacing: 0.5,
  },
});