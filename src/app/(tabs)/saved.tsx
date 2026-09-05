import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    FlatList,
    Image,
    Modal,
    Pressable,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import {
    AuraColors,
    AuraRadius,
    AuraShadow,
    AuraSpacing,
    AuraTypography,
} from '../../constants/auraTheme';

type SavedLook = {
  id: string;
  title: string;
  category: string;
  image: string;
  score: number;
  pieces?: string[];
  createdByUser?: boolean;
  favorite?: boolean;
};

type Collection = {
  id: string;
  name: string;
  lookIds: string[];
};

const SAVED_KEY = '@outfitaura_saved_looks';
const COLLECTIONS_KEY = '@outfitaura_collections';

const demoLooks: SavedLook[] = [
  {
    id: 'demo-1',
    title: 'Effortless Minimal',
    category: 'College',
    image:
      'https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=900&q=85',
    score: 9.4,
    pieces: ['White Shirt', 'Black Trousers', 'White Sneakers', 'Black Bag'],
  },
  {
    id: 'demo-2',
    title: 'City Casual',
    category: 'Casual',
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=85',
    score: 9.1,
    pieces: ['Denim Jacket', 'White Top', 'Straight Jeans', 'Sneakers'],
  },
  {
    id: 'demo-3',
    title: 'Soft Elegance',
    category: 'Date Night',
    image:
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=900&q=85',
    score: 9.6,
    pieces: ['Neutral Dress', 'Heels', 'Gold Accessories', 'Mini Bag'],
  },
  {
    id: 'demo-4',
    title: 'Weekend Ease',
    category: 'Casual',
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=85',
    score: 8.9,
    pieces: ['Relaxed Shirt', 'Wide Leg Pants', 'Sneakers'],
  },
];

const defaultCollections: Collection[] = [
  {
    id: 'collection-college',
    name: 'College Fits',
    lookIds: ['demo-1'],
  },
  {
    id: 'collection-casual',
    name: 'Everyday',
    lookIds: ['demo-2', 'demo-4'],
  },
  {
    id: 'collection-date',
    name: 'Date Night',
    lookIds: ['demo-3'],
  },
];

const filters = ['All', 'College', 'Casual', 'Date Night', 'Vacation'];

export default function SavedScreen() {
  const [savedLooks, setSavedLooks] = useState<SavedLook[]>(demoLooks);
  const [collections, setCollections] =
    useState<Collection[]>(defaultCollections);

  const [selectedFilter, setSelectedFilter] = useState('All');
  const [selectedLook, setSelectedLook] = useState<SavedLook | null>(null);
  const [selectedCollection, setSelectedCollection] =
    useState<Collection | null>(null);

  const [detailVisible, setDetailVisible] = useState(false);
  const [collectionVisible, setCollectionVisible] = useState(false);
  const [collectionManagerVisible, setCollectionManagerVisible] =
    useState(false);
  const [createCollectionVisible, setCreateCollectionVisible] =
    useState(false);

  const [newCollectionName, setNewCollectionName] = useState('');
  const [collectionLookMode, setCollectionLookMode] = useState(false);

  useEffect(() => {
    loadSavedData();
  }, []);

  const loadSavedData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(SAVED_KEY);
      const collectionData = await AsyncStorage.getItem(COLLECTIONS_KEY);

      if (savedData) {
        const parsed = JSON.parse(savedData);

        if (Array.isArray(parsed)) {
          setSavedLooks([...parsed, ...demoLooks]);
        }
      }

      if (collectionData) {
        const parsedCollections = JSON.parse(collectionData);

        if (Array.isArray(parsedCollections)) {
          setCollections(parsedCollections);
        }
      }
    } catch (error) {
      console.log('Unable to load saved data:', error);
    }
  };

  const persistSavedLooks = async (looks: SavedLook[]) => {
    try {
      const userLooks = looks.filter((look) => look.createdByUser);
      await AsyncStorage.setItem(SAVED_KEY, JSON.stringify(userLooks));
    } catch (error) {
      console.log('Unable to save looks:', error);
    }
  };

  const persistCollections = async (items: Collection[]) => {
    try {
      await AsyncStorage.setItem(COLLECTIONS_KEY, JSON.stringify(items));
    } catch (error) {
      console.log('Unable to save collections:', error);
    }
  };

  const filteredLooks =
    selectedFilter === 'All'
      ? savedLooks
      : savedLooks.filter((look) => look.category === selectedFilter);

  const openLook = (look: SavedLook) => {
    setSelectedLook(look);
    setDetailVisible(true);
  };

  const toggleFavorite = async (lookId: string) => {
    const updated = savedLooks.map((look) =>
      look.id === lookId
        ? {
            ...look,
            favorite: !look.favorite,
          }
        : look
    );

    setSavedLooks(updated);
    await persistSavedLooks(updated);

    if (selectedLook?.id === lookId) {
      const updatedSelected = updated.find((look) => look.id === lookId);

      if (updatedSelected) {
        setSelectedLook(updatedSelected);
      }
    }
  };

  const deleteLook = (look: SavedLook) => {
    if (!look.createdByUser) {
      Alert.alert(
        'Demo Look',
        'This is a sample OutfitAura look. Create your own look to save and delete it.'
      );
      return;
    }

    Alert.alert(
      'Delete saved look?',
      `Remove "${look.title}" from your saved looks?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = savedLooks.filter(
              (item) => item.id !== look.id
            );

            setSavedLooks(updated);
            await persistSavedLooks(updated);

            const updatedCollections = collections.map((collection) => ({
              ...collection,
              lookIds: collection.lookIds.filter((id) => id !== look.id),
            }));

            setCollections(updatedCollections);
            await persistCollections(updatedCollections);

            setDetailVisible(false);
          },
        },
      ]
    );
  };

  const createCollection = async () => {
    const name = newCollectionName.trim();

    if (!name) {
      Alert.alert('Collection name', 'Please enter a collection name.');
      return;
    }

    const newCollection: Collection = {
      id: `collection-${Date.now()}`,
      name,
      lookIds: [],
    };

    const updated = [...collections, newCollection];

    setCollections(updated);
    await persistCollections(updated);

    setNewCollectionName('');
    setCreateCollectionVisible(false);

    Alert.alert(
      'Collection created',
      `"${name}" is ready for your saved looks.`
    );
  };

  const isLookInCollection = (
    collection: Collection,
    lookId: string
  ) => {
    return collection.lookIds.includes(lookId);
  };

  const toggleLookInCollection = async (
    collection: Collection,
    lookId: string
  ) => {
    const updatedCollections = collections.map((item) => {
      if (item.id !== collection.id) return item;

      const alreadyAdded = item.lookIds.includes(lookId);

      return {
        ...item,
        lookIds: alreadyAdded
          ? item.lookIds.filter((id) => id !== lookId)
          : [...item.lookIds, lookId],
      };
    });

    setCollections(updatedCollections);
    await persistCollections(updatedCollections);

    const updatedSelected = updatedCollections.find(
      (item) => item.id === collection.id
    );

    if (updatedSelected) {
      setSelectedCollection(updatedSelected);
    }
  };

  const openCollection = (collection: Collection) => {
    setSelectedCollection(collection);
    setCollectionVisible(true);
  };

  const getCollectionLooks = (collection: Collection) => {
    return savedLooks.filter((look) =>
      collection.lookIds.includes(look.id)
    );
  };

  const openCollectionManager = () => {
    setCollectionLookMode(false);
    setCollectionManagerVisible(true);
  };

  const addSelectedLookToCollections = () => {
    if (!selectedLook) return;

    setCollectionLookMode(true);
    setDetailVisible(false);
    setCollectionManagerVisible(true);
  };

  const collectionCount = collections.length;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.header}>
          <View>
            <Text style={styles.eyebrow}>YOUR STYLE LIBRARY</Text>

            <Text style={styles.title}>Saved Looks</Text>

            <Text style={styles.subtitle}>
              Keep your best looks close.
            </Text>
          </View>

          <View style={styles.headerBadge}>
            <Ionicons
              name="bookmark"
              size={17}
              color={AuraColors.purple}
            />

            <Text style={styles.headerBadgeText}>
              {savedLooks.length}
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* INTRO CARD */}
          <View style={styles.introCard}>
            <View style={styles.introIcon}>
              <Ionicons
                name="sparkles"
                size={20}
                color={AuraColors.gold}
              />
            </View>

            <View style={styles.introTextWrap}>
              <Text style={styles.introTitle}>
                Your personal style board
              </Text>

              <Text style={styles.introText}>
                Open any look to view the outfit, score, pieces and
                collections.
              </Text>
            </View>
          </View>

          {/* FILTERS */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterRow}
          >
            {filters.map((filter) => {
              const active = selectedFilter === filter;

              return (
                <Pressable
                  key={filter}
                  onPress={() => setSelectedFilter(filter)}
                  style={[
                    styles.filterChip,
                    active && styles.filterChipActive,
                  ]}
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

          {/* SECTION HEADER */}
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>My Looks</Text>

              <Text style={styles.sectionSubtitle}>
                {filteredLooks.length}{' '}
                {filteredLooks.length === 1 ? 'look' : 'looks'}
              </Text>
            </View>

            <Pressable
              style={styles.sortButton}
              onPress={() =>
                setSelectedFilter(
                  selectedFilter === 'All' ? 'Casual' : 'All'
                )
              }
            >
              <Ionicons
                name="options-outline"
                size={17}
                color={AuraColors.text}
              />
            </Pressable>
          </View>

          {/* LOOK GRID */}
          {filteredLooks.length > 0 ? (
            <View style={styles.grid}>
              {filteredLooks.map((look) => (
                <Pressable
                  key={look.id}
                  style={styles.lookCard}
                  onPress={() => openLook(look)}
                >
                  <View style={styles.imageWrap}>
                    <Image
                      source={{ uri: look.image }}
                      style={styles.lookImage}
                    />

                    <View style={styles.scoreBadge}>
                      <Ionicons
                        name="sparkles"
                        size={11}
                        color={AuraColors.gold}
                      />

                      <Text style={styles.scoreText}>
                        {look.score.toFixed(1)}
                      </Text>
                    </View>

                    <Pressable
                      style={styles.heartButton}
                      onPress={(event) => {
                        event.stopPropagation();
                        toggleFavorite(look.id);
                      }}
                    >
                      <Ionicons
                        name={
                          look.favorite
                            ? 'heart'
                            : 'heart-outline'
                        }
                        size={18}
                        color={
                          look.favorite
                            ? AuraColors.purple
                            : AuraColors.text
                        }
                      />
                    </Pressable>

                    {look.createdByUser && (
                      <View style={styles.youBadge}>
                        <Text style={styles.youBadgeText}>YOU</Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.lookInfo}>
                    <Text
                      style={styles.lookTitle}
                      numberOfLines={1}
                    >
                      {look.title}
                    </Text>

                    <View style={styles.lookMeta}>
                      <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>
                          {look.category}
                        </Text>
                      </View>

                      <Ionicons
                        name="chevron-forward"
                        size={15}
                        color={AuraColors.textMuted}
                      />
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Ionicons
                name="bookmark-outline"
                size={36}
                color={AuraColors.purple}
              />

              <Text style={styles.emptyTitle}>
                No looks here yet
              </Text>

              <Text style={styles.emptyText}>
                Create a look and save it to build your personal
                style library.
              </Text>

              <Pressable
                style={styles.primaryButton}
                onPress={() => router.push('/create')}
              >
                <Ionicons
                  name="sparkles"
                  size={17}
                  color={AuraColors.white}
                />

                <Text style={styles.primaryButtonText}>
                  Create a Look
                </Text>
              </Pressable>
            </View>
          )}

          {/* COLLECTIONS */}
          <View style={styles.collectionSection}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Collections</Text>

                <Text style={styles.sectionSubtitle}>
                  Organize your style your way
                </Text>
              </View>

              <Pressable
                style={styles.addCollectionButton}
                onPress={() => setCreateCollectionVisible(true)}
              >
                <Ionicons
                  name="add"
                  size={20}
                  color={AuraColors.white}
                />
              </Pressable>
            </View>

            <View style={styles.collectionsCard}>
              <View style={styles.collectionHeroIcon}>
                <Ionicons
                  name="albums-outline"
                  size={23}
                  color={AuraColors.purple}
                />
              </View>

              <View style={styles.collectionHeroText}>
                <Text style={styles.collectionHeroTitle}>
                  {collectionCount} style collections
                </Text>

                <Text style={styles.collectionHeroSubtitle}>
                  College days, date nights, vacations and
                  everything in between.
                </Text>
              </View>
            </View>

            <View style={styles.collectionList}>
              {collections.map((collection) => {
                const count = getCollectionLooks(collection).length;

                return (
                  <Pressable
                    key={collection.id}
                    style={styles.collectionRow}
                    onPress={() => openCollection(collection)}
                  >
                    <View style={styles.collectionThumbnail}>
                      {getCollectionLooks(collection)[0] ? (
                        <Image
                          source={{
                            uri: getCollectionLooks(collection)[0]
                              .image,
                          }}
                          style={styles.collectionThumbnailImage}
                        />
                      ) : (
                        <Ionicons
                          name="images-outline"
                          size={22}
                          color={AuraColors.purple}
                        />
                      )}
                    </View>

                    <View style={styles.collectionRowText}>
                      <Text style={styles.collectionName}>
                        {collection.name}
                      </Text>

                      <Text style={styles.collectionCount}>
                        {count}{' '}
                        {count === 1 ? 'look' : 'looks'}
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={19}
                      color={AuraColors.textMuted}
                    />
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={styles.manageCollectionsButton}
              onPress={openCollectionManager}
            >
              <Ionicons
                name="albums-outline"
                size={17}
                color={AuraColors.purple}
              />

              <Text style={styles.manageCollectionsText}>
                Manage Collections
              </Text>
            </Pressable>
          </View>

          {/* AI CARD */}
          <View style={styles.aiCard}>
            <View style={styles.aiIcon}>
              <Ionicons
                name="sparkles"
                size={21}
                color={AuraColors.gold}
              />
            </View>

            <Text style={styles.aiTitle}>
              Your saved looks tell a story.
            </Text>

            <Text style={styles.aiText}>
              Keep building your style library and AuraMatch will
              help you discover what's missing.
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

          <View style={styles.footerSpace} />
        </ScrollView>

        {/* SAVED LOOK DETAIL MODAL */}
        <Modal
          visible={detailVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setDetailVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.detailModal}>
              <View style={styles.modalHandle} />

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.detailScroll}
              >
                {selectedLook && (
                  <>
                    <View style={styles.detailImageWrap}>
                      <Image
                        source={{ uri: selectedLook.image }}
                        style={styles.detailImage}
                      />

                      <Pressable
                        style={styles.closeButton}
                        onPress={() => setDetailVisible(false)}
                      >
                        <Ionicons
                          name="close"
                          size={22}
                          color={AuraColors.text}
                        />
                      </Pressable>

                      <View style={styles.detailScore}>
                        <Ionicons
                          name="sparkles"
                          size={14}
                          color={AuraColors.gold}
                        />

                        <Text style={styles.detailScoreText}>
                          {selectedLook.score.toFixed(1)} Aura
                          Score
                        </Text>
                      </View>
                    </View>

                    <View style={styles.detailHeader}>
                      <View style={styles.detailTitleWrap}>
                        <Text style={styles.detailTitle}>
                          {selectedLook.title}
                        </Text>

                        <View style={styles.detailCategory}>
                          <Text
                            style={styles.detailCategoryText}
                          >
                            {selectedLook.category}
                          </Text>
                        </View>
                      </View>

                      <Pressable
                        style={styles.detailHeart}
                        onPress={() =>
                          toggleFavorite(selectedLook.id)
                        }
                      >
                        <Ionicons
                          name={
                            selectedLook.favorite
                              ? 'heart'
                              : 'heart-outline'
                          }
                          size={22}
                          color={AuraColors.purple}
                        />
                      </Pressable>
                    </View>

                    <Text style={styles.detailDescription}>
                      A saved OutfitAura look created around your
                      personal style preferences.
                    </Text>

                    <Text style={styles.piecesTitle}>
                      Outfit Breakdown
                    </Text>

                    <View style={styles.piecesList}>
                      {(selectedLook.pieces || [
                        'Top',
                        'Bottom',
                        'Footwear',
                        'Accessories',
                      ]).map((piece, index) => (
                        <View
                          key={`${piece}-${index}`}
                          style={styles.pieceRow}
                        >
                          <View style={styles.pieceIcon}>
                            <Ionicons
                              name={
                                index === 0
                                  ? 'shirt-outline'
                                  : index === 1
                                  ? 'resize-outline'
                                  : index === 2
                                  ? 'footsteps-outline'
                                  : 'sparkles-outline'
                              }
                              size={17}
                              color={AuraColors.purple}
                            />
                          </View>

                          <Text style={styles.pieceText}>
                            {piece}
                          </Text>
                        </View>
                      ))}
                    </View>

                    <View style={styles.detailActions}>
                      <Pressable
                        style={styles.collectionAction}
                        onPress={addSelectedLookToCollections}
                      >
                        <Ionicons
                          name="albums-outline"
                          size={18}
                          color={AuraColors.purple}
                        />

                        <Text style={styles.collectionActionText}>
                          Add to Collection
                        </Text>
                      </Pressable>

                      <Pressable
                        style={styles.createAction}
                        onPress={() => {
                          setDetailVisible(false);
                          router.push('/create');
                        }}
                      >
                        <Ionicons
                          name="sparkles"
                          size={18}
                          color={AuraColors.white}
                        />

                        <Text style={styles.createActionText}>
                          Create Similar
                        </Text>
                      </Pressable>
                    </View>

                    {selectedLook.createdByUser && (
                      <Pressable
                        style={styles.deleteButton}
                        onPress={() => deleteLook(selectedLook)}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={17}
                          color={AuraColors.error}
                        />

                        <Text style={styles.deleteButtonText}>
                          Delete Saved Look
                        </Text>
                      </Pressable>
                    )}
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* COLLECTION DETAIL MODAL */}
        <Modal
          visible={collectionVisible}
          animationType="slide"
          transparent
          onRequestClose={() => setCollectionVisible(false)}
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.collectionModal}>
              <View style={styles.modalHandle} />

              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalEyebrow}>
                    COLLECTION
                  </Text>

                  <Text style={styles.modalTitle}>
                    {selectedCollection?.name}
                  </Text>
                </View>

                <Pressable
                  style={styles.closeButtonSmall}
                  onPress={() => setCollectionVisible(false)}
                >
                  <Ionicons
                    name="close"
                    size={20}
                    color={AuraColors.text}
                  />
                </Pressable>
              </View>

              {selectedCollection &&
              getCollectionLooks(selectedCollection).length > 0 ? (
                <FlatList
                  data={getCollectionLooks(selectedCollection)}
                  keyExtractor={(item) => item.id}
                  numColumns={2}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={styles.collectionGrid}
                  renderItem={({ item }) => (
                    <Pressable
                      style={styles.collectionLookCard}
                      onPress={() => {
                        setCollectionVisible(false);
                        setTimeout(() => openLook(item), 250);
                      }}
                    >
                      <Image
                        source={{ uri: item.image }}
                        style={styles.collectionLookImage}
                      />

                      <View style={styles.collectionLookInfo}>
                        <Text
                          style={styles.collectionLookTitle}
                          numberOfLines={1}
                        >
                          {item.title}
                        </Text>

                        <Text style={styles.collectionLookScore}>
                          ✦ {item.score.toFixed(1)}
                        </Text>
                      </View>
                    </Pressable>
                  )}
                />
              ) : (
                <View style={styles.collectionEmpty}>
                  <Ionicons
                    name="images-outline"
                    size={42}
                    color={AuraColors.purple}
                  />

                  <Text style={styles.emptyTitle}>
                    This collection is empty
                  </Text>

                  <Text style={styles.emptyText}>
                    Open a saved look and add it to this collection.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Modal>

        {/* COLLECTION MANAGER */}
        <Modal
          visible={collectionManagerVisible}
          animationType="slide"
          transparent
          onRequestClose={() =>
            setCollectionManagerVisible(false)
          }
        >
          <View style={styles.modalBackdrop}>
            <View style={styles.managerModal}>
              <View style={styles.modalHandle} />

              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalEyebrow}>
                    {collectionLookMode
                      ? 'ADD TO COLLECTION'
                      : 'ORGANIZE YOUR STYLE'}
                  </Text>

                  <Text style={styles.modalTitle}>
                    {collectionLookMode
                      ? selectedLook?.title
                      : 'Collections'}
                  </Text>
                </View>

                <Pressable
                  style={styles.closeButtonSmall}
                  onPress={() =>
                    setCollectionManagerVisible(false)
                  }
                >
                  <Ionicons
                    name="close"
                    size={20}
                    color={AuraColors.text}
                  />
                </Pressable>
              </View>

              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.managerScroll}
              >
                {!collectionLookMode && (
                  <Pressable
                    style={styles.newCollectionRow}
                    onPress={() => {
                      setCollectionManagerVisible(false);
                      setCreateCollectionVisible(true);
                    }}
                  >
                    <View style={styles.newCollectionIcon}>
                      <Ionicons
                        name="add"
                        size={22}
                        color={AuraColors.purple}
                      />
                    </View>

                    <View style={styles.collectionRowText}>
                      <Text style={styles.collectionName}>
                        Create New Collection
                      </Text>

                      <Text style={styles.collectionCount}>
                        Start a fresh style board
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={19}
                      color={AuraColors.textMuted}
                    />
                  </Pressable>
                )}

                {collections.map((collection) => {
                  const selected =
                    collectionLookMode &&
                    selectedLook &&
                    isLookInCollection(
                      collection,
                      selectedLook.id
                    );

                  return (
                    <Pressable
                      key={collection.id}
                      style={[
                        styles.managerCollectionRow,
                        selected &&
                          styles.managerCollectionRowActive,
                      ]}
                      onPress={() => {
                        if (collectionLookMode && selectedLook) {
                          toggleLookInCollection(
                            collection,
                            selectedLook.id
                          );
                        } else {
                          setCollectionManagerVisible(false);
                          setTimeout(
                            () => openCollection(collection),
                            200
                          );
                        }
                      }}
                    >
                      <View style={styles.managerCollectionIcon}>
                        <Ionicons
                          name="albums-outline"
                          size={20}
                          color={AuraColors.purple}
                        />
                      </View>

                      <View style={styles.collectionRowText}>
                        <Text style={styles.collectionName}>
                          {collection.name}
                        </Text>

                        <Text style={styles.collectionCount}>
                          {getCollectionLooks(collection).length}{' '}
                          {getCollectionLooks(collection).length === 1
                            ? 'look'
                            : 'looks'}
                        </Text>
                      </View>

                      {collectionLookMode ? (
                        <View
                          style={[
                            styles.checkCircle,
                            selected &&
                              styles.checkCircleActive,
                          ]}
                        >
                          {selected && (
                            <Ionicons
                              name="checkmark"
                              size={15}
                              color={AuraColors.white}
                            />
                          )}
                        </View>
                      ) : (
                        <Ionicons
                          name="chevron-forward"
                          size={19}
                          color={AuraColors.textMuted}
                        />
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* CREATE COLLECTION MODAL */}
        <Modal
          visible={createCollectionVisible}
          animationType="fade"
          transparent
          onRequestClose={() =>
            setCreateCollectionVisible(false)
          }
        >
          <View style={styles.createBackdrop}>
            <View style={styles.createModal}>
              <View style={styles.createIcon}>
                <Ionicons
                  name="albums-outline"
                  size={25}
                  color={AuraColors.purple}
                />
              </View>

              <Text style={styles.createModalTitle}>
                New Collection
              </Text>

              <Text style={styles.createModalText}>
                Give your style board a name.
              </Text>

              <TextInput
                value={newCollectionName}
                onChangeText={setNewCollectionName}
                placeholder="e.g. Summer Fits"
                placeholderTextColor={AuraColors.textMuted}
                style={styles.collectionInput}
                autoFocus
              />

              <View style={styles.createModalActions}>
                <Pressable
                  style={styles.cancelModalButton}
                  onPress={() => {
                    setNewCollectionName('');
                    setCreateCollectionVisible(false);
                  }}
                >
                  <Text style={styles.cancelModalText}>
                    Cancel
                  </Text>
                </Pressable>

                <Pressable
                  style={styles.saveCollectionButton}
                  onPress={createCollection}
                >
                  <Text style={styles.saveCollectionText}>
                    Create
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: AuraColors.background,
  },

  container: {
    flex: 1,
    backgroundColor: AuraColors.background,
  },

  scrollContent: {
    paddingHorizontal: AuraSpacing.xl,
    paddingBottom: 100,
  },

  header: {
    paddingHorizontal: AuraSpacing.xl,
    paddingTop: AuraSpacing.lg,
    paddingBottom: AuraSpacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

  headerBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.surfacePurple,
  },

  headerBadgeText: {
    ...AuraTypography.small,
    fontWeight: '700',
    color: AuraColors.purple,
  },

  introCard: {
    marginTop: 8,
    padding: AuraSpacing.lg,
    borderRadius: AuraRadius.large,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    ...AuraShadow.soft,
  },

  introIcon: {
    width: 44,
    height: 44,
    borderRadius: 15,
    backgroundColor: AuraColors.goldSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  introTextWrap: {
    flex: 1,
  },

  introTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.text,
    marginBottom: 2,
  },

  introText: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    lineHeight: 18,
  },

  filterRow: {
    paddingVertical: AuraSpacing.lg,
    gap: 8,
  },

  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  filterChipActive: {
    backgroundColor: AuraColors.purple,
    borderColor: AuraColors.purple,
  },

  filterText: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    fontWeight: '600',
  },

  filterTextActive: {
    color: AuraColors.white,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: AuraSpacing.md,
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

  sortButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: AuraColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },

  lookCard: {
    width: '48.2%',
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.large,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AuraColors.borderLight,
    ...AuraShadow.soft,
  },

  imageWrap: {
    height: 205,
    position: 'relative',
    overflow: 'hidden',
  },

  lookImage: {
    width: '100%',
    height: '100%',
    backgroundColor: AuraColors.surfaceSoft,
  },

  scoreBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: AuraRadius.pill,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },

  scoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: AuraColors.text,
  },

  heartButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  youBadge: {
    position: 'absolute',
    bottom: 9,
    left: 9,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.purple,
  },

  youBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: AuraColors.white,
    letterSpacing: 0.5,
  },

  lookInfo: {
    padding: 12,
  },

  lookTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.text,
  },

  lookMeta: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.surfacePurple,
  },

  categoryText: {
    fontSize: 10,
    fontWeight: '700',
    color: AuraColors.purple,
  },

  emptyCard: {
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.large,
    borderWidth: 1,
    borderColor: AuraColors.border,
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingVertical: 38,
  },

  emptyTitle: {
    ...AuraTypography.subheading,
    color: AuraColors.text,
    marginTop: 12,
  },

  emptyText: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    textAlign: 'center',
    lineHeight: 19,
    marginTop: 6,
    marginBottom: 18,
  },

  primaryButton: {
    backgroundColor: AuraColors.purple,
    paddingHorizontal: 18,
    paddingVertical: 11,
    borderRadius: AuraRadius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },

  primaryButtonText: {
    ...AuraTypography.button,
    color: AuraColors.white,
  },

  collectionSection: {
    marginTop: 30,
  },

  addCollectionButton: {
    width: 38,
    height: 38,
    borderRadius: 13,
    backgroundColor: AuraColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  collectionsCard: {
    padding: AuraSpacing.lg,
    borderRadius: AuraRadius.large,
    backgroundColor: AuraColors.surfacePurple,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E1D4F2',
  },

  collectionHeroIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    backgroundColor: AuraColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  collectionHeroText: {
    flex: 1,
  },

  collectionHeroTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.text,
  },

  collectionHeroSubtitle: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    lineHeight: 18,
    marginTop: 3,
  },

  collectionList: {
    marginTop: 10,
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.large,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  collectionRow: {
    minHeight: 70,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: AuraColors.borderLight,
  },

  collectionThumbnail: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    marginRight: 12,
  },

  collectionThumbnailImage: {
    width: '100%',
    height: '100%',
  },

  collectionRowText: {
    flex: 1,
  },

  collectionName: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.text,
  },

  collectionCount: {
    ...AuraTypography.small,
    color: AuraColors.textMuted,
    marginTop: 2,
  },

  manageCollectionsButton: {
    marginTop: 12,
    minHeight: 48,
    borderRadius: AuraRadius.medium,
    borderWidth: 1,
    borderColor: AuraColors.border,
    backgroundColor: AuraColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },

  manageCollectionsText: {
    ...AuraTypography.button,
    color: AuraColors.purple,
  },

  aiCard: {
    marginTop: 30,
    padding: AuraSpacing.xl,
    borderRadius: AuraRadius.large,
    backgroundColor: AuraColors.navy,
    overflow: 'hidden',
  },

  aiIcon: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: 'rgba(201,154,74,0.16)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 13,
  },

  aiTitle: {
    ...AuraTypography.subheading,
    color: AuraColors.white,
  },

  aiText: {
    ...AuraTypography.small,
    color: '#D9D7E8',
    lineHeight: 19,
    marginTop: 5,
  },

  aiButton: {
    marginTop: 16,
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 10,
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

  footerSpace: {
    height: 30,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,19,47,0.55)',
    justifyContent: 'flex-end',
  },

  detailModal: {
    height: '91%',
    backgroundColor: AuraColors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
  },

  collectionModal: {
    height: '82%',
    backgroundColor: AuraColors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
    paddingHorizontal: AuraSpacing.xl,
  },

  managerModal: {
    height: '78%',
    backgroundColor: AuraColors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    overflow: 'hidden',
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

  detailScroll: {
    paddingBottom: 35,
  },

  detailImageWrap: {
    height: 390,
    marginHorizontal: AuraSpacing.xl,
    borderRadius: AuraRadius.extraLarge,
    overflow: 'hidden',
    position: 'relative',
  },

  detailImage: {
    width: '100%',
    height: '100%',
  },

  closeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  detailScore: {
    position: 'absolute',
    bottom: 13,
    left: 13,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    paddingHorizontal: 11,
    paddingVertical: 7,
    borderRadius: AuraRadius.pill,
    backgroundColor: 'rgba(18,22,74,0.88)',
  },

  detailScoreText: {
    fontSize: 11,
    fontWeight: '700',
    color: AuraColors.white,
  },

  detailHeader: {
    marginTop: 18,
    paddingHorizontal: AuraSpacing.xl,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },

  detailTitleWrap: {
    flex: 1,
    paddingRight: 12,
  },

  detailTitle: {
    ...AuraTypography.title,
    color: AuraColors.text,
  },

  detailCategory: {
    alignSelf: 'flex-start',
    marginTop: 7,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.surfacePurple,
  },

  detailCategoryText: {
    fontSize: 11,
    fontWeight: '700',
    color: AuraColors.purple,
  },

  detailHeart: {
    width: 43,
    height: 43,
    borderRadius: 15,
    backgroundColor: AuraColors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  detailDescription: {
    ...AuraTypography.body,
    color: AuraColors.textSecondary,
    lineHeight: 22,
    paddingHorizontal: AuraSpacing.xl,
    marginTop: 12,
  },

  piecesTitle: {
    ...AuraTypography.subheading,
    color: AuraColors.text,
    paddingHorizontal: AuraSpacing.xl,
    marginTop: 24,
    marginBottom: 10,
  },

  piecesList: {
    paddingHorizontal: AuraSpacing.xl,
  },

  pieceRow: {
    minHeight: 53,
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.medium,
    marginBottom: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: AuraColors.borderLight,
  },

  pieceIcon: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 11,
  },

  pieceText: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.text,
  },

  detailActions: {
    paddingHorizontal: AuraSpacing.xl,
    marginTop: 20,
    gap: 10,
  },

  collectionAction: {
    minHeight: 52,
    borderRadius: AuraRadius.medium,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  collectionActionText: {
    ...AuraTypography.button,
    color: AuraColors.purple,
  },

  createAction: {
    minHeight: 52,
    borderRadius: AuraRadius.medium,
    backgroundColor: AuraColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  createActionText: {
    ...AuraTypography.button,
    color: AuraColors.white,
  },

  deleteButton: {
    marginHorizontal: AuraSpacing.xl,
    marginTop: 15,
    minHeight: 45,
    borderRadius: AuraRadius.medium,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },

  deleteButtonText: {
    ...AuraTypography.small,
    color: AuraColors.error,
    fontWeight: '700',
  },

  modalHeader: {
    paddingTop: 8,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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

  closeButtonSmall: {
    width: 38,
    height: 38,
    borderRadius: 14,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  collectionGrid: {
    paddingBottom: 30,
    justifyContent: 'space-between',
  },

  collectionLookCard: {
    width: '48%',
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.large,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  collectionLookImage: {
    width: '100%',
    height: 190,
  },

  collectionLookInfo: {
    padding: 10,
  },

  collectionLookTitle: {
    ...AuraTypography.small,
    fontWeight: '600',
    color: AuraColors.text,
  },

  collectionLookScore: {
    fontSize: 11,
    color: AuraColors.gold,
    fontWeight: '700',
    marginTop: 4,
  },

  collectionEmpty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
    paddingBottom: 50,
  },

  managerScroll: {
    paddingBottom: 35,
  },

  newCollectionRow: {
    minHeight: 74,
    padding: 12,
    backgroundColor: AuraColors.surfacePurple,
    borderRadius: AuraRadius.large,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E1D4F2',
  },

  newCollectionIcon: {
    width: 46,
    height: 46,
    borderRadius: 15,
    backgroundColor: AuraColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  managerCollectionRow: {
    minHeight: 72,
    padding: 12,
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.large,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  managerCollectionRowActive: {
    borderColor: AuraColors.purple,
    backgroundColor: AuraColors.surfacePurple,
  },

  managerCollectionIcon: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  checkCircle: {
    width: 25,
    height: 25,
    borderRadius: 13,
    borderWidth: 1.5,
    borderColor: AuraColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checkCircleActive: {
    backgroundColor: AuraColors.purple,
    borderColor: AuraColors.purple,
  },

  createBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,19,47,0.55)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 25,
  },

  createModal: {
    width: '100%',
    borderRadius: 26,
    backgroundColor: AuraColors.background,
    padding: 22,
    ...AuraShadow.card,
  },

  createIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },

  createModalTitle: {
    ...AuraTypography.heading,
    color: AuraColors.text,
  },

  createModalText: {
    ...AuraTypography.body,
    color: AuraColors.textSecondary,
    marginTop: 4,
    marginBottom: 16,
  },

  collectionInput: {
    height: 52,
    borderRadius: AuraRadius.medium,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    paddingHorizontal: 15,
    ...AuraTypography.body,
    color: AuraColors.text,
  },

  createModalActions: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 15,
  },

  cancelModalButton: {
    flex: 1,
    height: 50,
    borderRadius: AuraRadius.medium,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  cancelModalText: {
    ...AuraTypography.button,
    color: AuraColors.textSecondary,
  },

  saveCollectionButton: {
    flex: 1,
    height: 50,
    borderRadius: AuraRadius.medium,
    backgroundColor: AuraColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },

  saveCollectionText: {
    ...AuraTypography.button,
    color: AuraColors.white,
  },
});