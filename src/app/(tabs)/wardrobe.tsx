import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
    Alert,
    Image,
    Modal,
    Pressable,
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

type WardrobeItem = {
  id: string;
  name: string;
  category: string;
  color: string;
  image: string;
  favorite?: boolean;
  createdByUser?: boolean;
};

const STORAGE_KEY = '@outfitaura_wardrobe';

const categories = [
  'All',
  'Tops',
  'Bottoms',
  'Dresses',
  'Shoes',
  'Accessories',
];

const demoItems: WardrobeItem[] = [
  {
    id: 'demo-white-shirt',
    name: 'White Shirt',
    category: 'Tops',
    color: 'White',
    image:
      'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'demo-denim-jacket',
    name: 'Denim Jacket',
    category: 'Tops',
    color: 'Blue',
    image:
      'https://images.unsplash.com/photo-1551537482-f2075a1d41f2?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'demo-black-jeans',
    name: 'Black Jeans',
    category: 'Bottoms',
    color: 'Black',
    image:
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'demo-neutral-dress',
    name: 'Neutral Dress',
    category: 'Dresses',
    color: 'Beige',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'demo-white-sneakers',
    name: 'White Sneakers',
    category: 'Shoes',
    color: 'White',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85',
  },
  {
    id: 'demo-black-bag',
    name: 'Black Bag',
    category: 'Accessories',
    color: 'Black',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=85',
  },
];

export default function WardrobeScreen() {
  const [items, setItems] = useState<WardrobeItem[]>(demoItems);

  const [selectedCategory, setSelectedCategory] = useState('All');

  const [addModalVisible, setAddModalVisible] = useState(false);
  const [filterModalVisible, setFilterModalVisible] = useState(false);

  const [itemName, setItemName] = useState('');
  const [itemCategory, setItemCategory] = useState('Tops');
  const [itemColor, setItemColor] = useState('Black');
  const [selectedImage, setSelectedImage] = useState<string | null>(
    null
  );

  const [sortMode, setSortMode] = useState<'default' | 'favorites'>(
    'default'
  );

  useEffect(() => {
    loadWardrobe();
  }, []);

  const loadWardrobe = async () => {
    try {
      const stored = await AsyncStorage.getItem(STORAGE_KEY);

      if (stored) {
        const parsed = JSON.parse(stored);

        if (Array.isArray(parsed)) {
          setItems([...parsed, ...demoItems]);
        }
      }
    } catch (error) {
      console.log('Error loading wardrobe:', error);
    }
  };

  const saveWardrobe = async (updatedItems: WardrobeItem[]) => {
    try {
      const userItems = updatedItems.filter(
        (item) => item.createdByUser
      );

      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(userItems)
      );
    } catch (error) {
      console.log('Error saving wardrobe:', error);
    }
  };

  const takePhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Camera Permission',
          'Please allow camera access to add clothing photos.'
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.85,
        allowsEditing: true,
        aspect: [4, 5],
      });

      if (!result.canceled && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(
        'Camera Error',
        'Unable to open the camera right now.'
      );
      console.log(error);
    }
  };

  const chooseFromGallery = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          'Gallery Permission',
          'Please allow gallery access to add clothing photos.'
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 0.85,
          allowsEditing: true,
          aspect: [4, 5],
        });

      if (!result.canceled && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      Alert.alert(
        'Gallery Error',
        'Unable to open your gallery right now.'
      );
      console.log(error);
    }
  };

  const resetAddForm = () => {
    setItemName('');
    setItemCategory('Tops');
    setItemColor('Black');
    setSelectedImage(null);
  };

  const openAddModal = () => {
    resetAddForm();
    setAddModalVisible(true);
  };

  const addWardrobeItem = async () => {
    if (!selectedImage) {
      Alert.alert(
        'Add a photo',
        'Please take a photo or choose one from your gallery.'
      );
      return;
    }

    if (!itemName.trim()) {
      Alert.alert(
        'Name your item',
        'Give this clothing piece a name.'
      );
      return;
    }

    const newItem: WardrobeItem = {
      id: `wardrobe-${Date.now()}`,
      name: itemName.trim(),
      category: itemCategory,
      color: itemColor,
      image: selectedImage,
      favorite: false,
      createdByUser: true,
    };

    const updated = [newItem, ...items];

    setItems(updated);
    await saveWardrobe(updated);

    setAddModalVisible(false);
    resetAddForm();

    Alert.alert(
      'Added to Wardrobe ✨',
      `${newItem.name} is now in your digital wardrobe.`
    );
  };

  const toggleFavorite = async (id: string) => {
    const updated = items.map((item) =>
      item.id === id
        ? {
            ...item,
            favorite: !item.favorite,
          }
        : item
    );

    setItems(updated);
    await saveWardrobe(updated);
  };

  const deleteItem = (item: WardrobeItem) => {
    if (!item.createdByUser) {
      Alert.alert(
        'Sample Item',
        'This is a demo wardrobe piece. You can delete clothing that you add yourself.'
      );
      return;
    }

    Alert.alert(
      'Remove from wardrobe?',
      `Remove "${item.name}" from your wardrobe?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            const updated = items.filter(
              (current) => current.id !== item.id
            );

            setItems(updated);
            await saveWardrobe(updated);
          },
        },
      ]
    );
  };

  let filteredItems =
    selectedCategory === 'All'
      ? items
      : items.filter(
          (item) => item.category === selectedCategory
        );

  if (sortMode === 'favorites') {
    filteredItems = [...filteredItems].sort(
      (a, b) => Number(b.favorite) - Number(a.favorite)
    );
  }

  const userItemCount = items.filter(
    (item) => item.createdByUser
  ).length;

  const openAuraMatch = () => {
    router.push('/auramatch');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* HEADER */}
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text style={styles.eyebrow}>YOUR DIGITAL CLOSET</Text>

            <Text style={styles.title}>My Wardrobe</Text>

            <Text style={styles.subtitle}>
              {items.length} pieces in your closet
            </Text>
          </View>

          <Pressable
            style={styles.addHeaderButton}
            onPress={openAddModal}
          >
            <Ionicons
              name="add"
              size={22}
              color={AuraColors.white}
            />
          </Pressable>
        </View>

        {/* HERO CARD */}
        <View style={styles.heroCard}>
          <View style={styles.heroIcon}>
            <Ionicons
              name="shirt-outline"
              size={24}
              color={AuraColors.gold}
            />
          </View>

          <View style={styles.heroContent}>
            <Text style={styles.heroTitle}>
              Your style, organized.
            </Text>

            <Text style={styles.heroText}>
              Add your clothes and let AuraMatch discover better
              combinations from what you already own.
            </Text>
          </View>
        </View>

        {/* CATEGORY CHIPS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {categories.map((category) => {
            const active = selectedCategory === category;

            return (
              <Pressable
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={[
                  styles.categoryChip,
                  active && styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    active && styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* SECTION HEADER */}
        <View style={styles.sectionHeader}>
          <View>
            <Text style={styles.sectionTitle}>Your Pieces</Text>

            <Text style={styles.sectionSubtitle}>
              {filteredItems.length}{' '}
              {filteredItems.length === 1 ? 'piece' : 'pieces'}
            </Text>
          </View>

          <Pressable
            style={styles.filterButton}
            onPress={() => setFilterModalVisible(true)}
          >
            <Ionicons
              name="options-outline"
              size={18}
              color={AuraColors.text}
            />
          </Pressable>
        </View>

        {/* WARDROBE GRID */}
        <View style={styles.grid}>
          {filteredItems.map((item) => (
            <Pressable
              key={item.id}
              style={styles.itemCard}
              onLongPress={() => deleteItem(item)}
            >
              <View style={styles.itemImageWrap}>
                <Image
                  source={{ uri: item.image }}
                  style={styles.itemImage}
                />

                <View style={styles.itemCategoryBadge}>
                  <Text style={styles.itemCategoryText}>
                    {item.category}
                  </Text>
                </View>

                <Pressable
                  style={styles.favoriteButton}
                  onPress={() => toggleFavorite(item.id)}
                >
                  <Ionicons
                    name={
                      item.favorite
                        ? 'heart'
                        : 'heart-outline'
                    }
                    size={18}
                    color={
                      item.favorite
                        ? AuraColors.purple
                        : AuraColors.text
                    }
                  />
                </Pressable>

                {item.createdByUser && (
                  <View style={styles.youBadge}>
                    <Text style={styles.youBadgeText}>YOU</Text>
                  </View>
                )}
              </View>

              <View style={styles.itemInfo}>
                <Text
                  style={styles.itemName}
                  numberOfLines={1}
                >
                  {item.name}
                </Text>

                <View style={styles.colorRow}>
                  <View
                    style={[
                      styles.colorDot,
                      {
                        backgroundColor:
                          getColorValue(item.color),
                      },
                    ]}
                  />

                  <Text style={styles.colorText}>
                    {item.color}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>

        {/* EMPTY STATE */}
        {filteredItems.length === 0 && (
          <View style={styles.emptyCard}>
            <View style={styles.emptyIcon}>
              <Ionicons
                name="shirt-outline"
                size={28}
                color={AuraColors.purple}
              />
            </View>

            <Text style={styles.emptyTitle}>
              Nothing here yet
            </Text>

            <Text style={styles.emptyText}>
              Add pieces to this category and build your digital
              wardrobe.
            </Text>

            <Pressable
              style={styles.emptyButton}
              onPress={openAddModal}
            >
              <Ionicons
                name="add"
                size={17}
                color={AuraColors.white}
              />

              <Text style={styles.emptyButtonText}>
                Add Clothing
              </Text>
            </Pressable>
          </View>
        )}

        {/* AURAMATCH CARD */}
        <Pressable
          style={styles.auraCard}
          onPress={openAuraMatch}
        >
          <View style={styles.auraIcon}>
            <Ionicons
              name="sparkles"
              size={22}
              color={AuraColors.gold}
            />
          </View>

          <View style={styles.auraContent}>
            <Text style={styles.auraEyebrow}>
              AI STYLE ANALYSIS
            </Text>

            <Text style={styles.auraTitle}>
              Style your wardrobe
            </Text>

            <Text style={styles.auraText}>
              Find missing essentials and discover outfits hiding
              in your closet.
            </Text>

            <View style={styles.auraAction}>
              <Text style={styles.auraActionText}>
                Open AuraMatch
              </Text>

              <Ionicons
                name="arrow-forward"
                size={16}
                color={AuraColors.white}
              />
            </View>
          </View>
        </Pressable>

        {/* ADD BUTTON */}
        <Pressable
          style={styles.bottomAddButton}
          onPress={openAddModal}
        >
          <Ionicons
            name="add-circle-outline"
            size={19}
            color={AuraColors.purple}
          />

          <Text style={styles.bottomAddText}>
            Add a new wardrobe piece
          </Text>
        </Pressable>

        <Text style={styles.footerText}>
          OutfitAura • Your style, made smarter.
        </Text>

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* ADD ITEM MODAL */}
      <Modal
        visible={addModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setAddModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={styles.addModal}>
            <View style={styles.modalHandle} />

            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>
                  DIGITAL WARDROBE
                </Text>

                <Text style={styles.modalTitle}>
                  Add Clothing
                </Text>
              </View>

              <Pressable
                style={styles.closeButton}
                onPress={() => setAddModalVisible(false)}
              >
                <Ionicons
                  name="close"
                  size={21}
                  color={AuraColors.text}
                />
              </Pressable>
            </View>

            {/* IMAGE PICKER */}
            <Pressable
              style={[
                styles.imagePicker,
                selectedImage && styles.imagePickerSelected,
              ]}
              onPress={chooseFromGallery}
            >
              {selectedImage ? (
                <Image
                  source={{ uri: selectedImage }}
                  style={styles.selectedPreview}
                />
              ) : (
                <>
                  <View style={styles.imagePickerIcon}>
                    <Ionicons
                      name="image-outline"
                      size={25}
                      color={AuraColors.purple}
                    />
                  </View>

                  <Text style={styles.imagePickerTitle}>
                    Add clothing photo
                  </Text>

                  <Text style={styles.imagePickerSubtitle}>
                    Choose from gallery
                  </Text>
                </>
              )}
            </Pressable>

            <View style={styles.photoButtons}>
              <Pressable
                style={styles.photoButton}
                onPress={takePhoto}
              >
                <Ionicons
                  name="camera-outline"
                  size={18}
                  color={AuraColors.purple}
                />

                <Text style={styles.photoButtonText}>
                  Take Photo
                </Text>
              </Pressable>

              <Pressable
                style={styles.photoButton}
                onPress={chooseFromGallery}
              >
                <Ionicons
                  name="images-outline"
                  size={18}
                  color={AuraColors.purple}
                />

                <Text style={styles.photoButtonText}>
                  Gallery
                </Text>
              </Pressable>
            </View>

            {/* NAME */}
            <Text style={styles.inputLabel}>Item Name</Text>

            <TextInput
              value={itemName}
              onChangeText={setItemName}
              placeholder="e.g. Blue Oversized Shirt"
              placeholderTextColor={AuraColors.textMuted}
              style={styles.input}
            />

            {/* CATEGORY */}
            <Text style={styles.inputLabel}>Category</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modalChipRow}
            >
              {categories
                .filter((category) => category !== 'All')
                .map((category) => {
                  const active = itemCategory === category;

                  return (
                    <Pressable
                      key={category}
                      onPress={() => setItemCategory(category)}
                      style={[
                        styles.modalChip,
                        active && styles.modalChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.modalChipText,
                          active &&
                            styles.modalChipTextActive,
                        ]}
                      >
                        {category}
                      </Text>
                    </Pressable>
                  );
                })}
            </ScrollView>

            {/* COLOR */}
            <Text style={styles.inputLabel}>Color</Text>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.modalChipRow}
            >
              {[
                'Black',
                'White',
                'Beige',
                'Brown',
                'Blue',
                'Purple',
                'Pink',
                'Green',
              ].map((color) => {
                const active = itemColor === color;

                return (
                  <Pressable
                    key={color}
                    onPress={() => setItemColor(color)}
                    style={[
                      styles.colorChip,
                      active && styles.colorChipActive,
                    ]}
                  >
                    <View
                      style={[
                        styles.colorChipDot,
                        {
                          backgroundColor:
                            getColorValue(color),
                        },
                      ]}
                    />

                    <Text
                      style={[
                        styles.colorChipText,
                        active &&
                          styles.colorChipTextActive,
                      ]}
                    >
                      {color}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* SAVE */}
            <Pressable
              style={styles.saveButton}
              onPress={addWardrobeItem}
            >
              <Ionicons
                name="checkmark-circle-outline"
                size={19}
                color={AuraColors.white}
              />

              <Text style={styles.saveButtonText}>
                Add to My Wardrobe
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* FILTER MODAL */}
      <Modal
        visible={filterModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.centerBackdrop}>
          <View style={styles.filterModal}>
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalEyebrow}>SORT</Text>

                <Text style={styles.modalTitle}>
                  Organize Wardrobe
                </Text>
              </View>

              <Pressable
                style={styles.closeButton}
                onPress={() => setFilterModalVisible(false)}
              >
                <Ionicons
                  name="close"
                  size={21}
                  color={AuraColors.text}
                />
              </Pressable>
            </View>

            <Pressable
              style={[
                styles.sortOption,
                sortMode === 'default' &&
                  styles.sortOptionActive,
              ]}
              onPress={() => {
                setSortMode('default');
                setFilterModalVisible(false);
              }}
            >
              <Ionicons
                name="grid-outline"
                size={20}
                color={AuraColors.purple}
              />

              <View style={styles.sortTextWrap}>
                <Text style={styles.sortTitle}>
                  Default
                </Text>

                <Text style={styles.sortSubtitle}>
                  Show your wardrobe normally
                </Text>
              </View>

              {sortMode === 'default' && (
                <Ionicons
                  name="checkmark-circle"
                  size={21}
                  color={AuraColors.purple}
                />
              )}
            </Pressable>

            <Pressable
              style={[
                styles.sortOption,
                sortMode === 'favorites' &&
                  styles.sortOptionActive,
              ]}
              onPress={() => {
                setSortMode('favorites');
                setFilterModalVisible(false);
              }}
            >
              <Ionicons
                name="heart-outline"
                size={20}
                color={AuraColors.purple}
              />

              <View style={styles.sortTextWrap}>
                <Text style={styles.sortTitle}>
                  Favorites First
                </Text>

                <Text style={styles.sortSubtitle}>
                  Keep your favorite pieces at the top
                </Text>
              </View>

              {sortMode === 'favorites' && (
                <Ionicons
                  name="checkmark-circle"
                  size={21}
                  color={AuraColors.purple}
                />
              )}
            </Pressable>

            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {items.length}
                </Text>

                <Text style={styles.statLabel}>
                  Total Pieces
                </Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {userItemCount}
                </Text>

                <Text style={styles.statLabel}>
                  Added by You
                </Text>
              </View>

              <View style={styles.statDivider} />

              <View style={styles.statItem}>
                <Text style={styles.statNumber}>
                  {items.filter((item) => item.favorite).length}
                </Text>

                <Text style={styles.statLabel}>
                  Favorites
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

function getColorValue(color: string) {
  switch (color.toLowerCase()) {
    case 'black':
      return '#171717';

    case 'white':
      return '#F8F8F8';

    case 'beige':
      return '#D8C2A5';

    case 'brown':
      return '#795548';

    case 'blue':
      return '#4C78A8';

    case 'purple':
      return '#6537D8';

    case 'pink':
      return '#D98BA5';

    case 'green':
      return '#718C73';

    default:
      return '#B8B8B8';
  }
}

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

  headerText: {
    flex: 1,
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

  addHeaderButton: {
    width: 45,
    height: 45,
    borderRadius: 16,
    backgroundColor: AuraColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    ...AuraShadow.floating,
  },

  heroCard: {
    backgroundColor: AuraColors.navy,
    borderRadius: AuraRadius.large,
    padding: AuraSpacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
  },

  heroIcon: {
    width: 49,
    height: 49,
    borderRadius: 16,
    backgroundColor: 'rgba(201,154,74,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  heroContent: {
    flex: 1,
  },

  heroTitle: {
    ...AuraTypography.subheading,
    color: AuraColors.white,
  },

  heroText: {
    ...AuraTypography.small,
    color: '#D9D7E8',
    lineHeight: 18,
    marginTop: 3,
  },

  categoryRow: {
    paddingVertical: 18,
    gap: 8,
  },

  categoryChip: {
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  categoryChipActive: {
    backgroundColor: AuraColors.purple,
    borderColor: AuraColors.purple,
  },

  categoryText: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    fontWeight: '600',
  },

  categoryTextActive: {
    color: AuraColors.white,
  },

  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 13,
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

  filterButton: {
    width: 39,
    height: 39,
    borderRadius: 13,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: 16,
  },

  itemCard: {
    width: '48.2%',
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.large,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: AuraColors.borderLight,
    ...AuraShadow.soft,
  },

  itemImageWrap: {
    height: 205,
    position: 'relative',
  },

  itemImage: {
    width: '100%',
    height: '100%',
    backgroundColor: AuraColors.surfaceSoft,
  },

  itemCategoryBadge: {
    position: 'absolute',
    left: 9,
    bottom: 9,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: AuraRadius.pill,
    backgroundColor: 'rgba(255,255,255,0.94)',
  },

  itemCategoryText: {
    fontSize: 9,
    fontWeight: '700',
    color: AuraColors.purple,
  },

  favoriteButton: {
    position: 'absolute',
    top: 9,
    right: 9,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255,255,255,0.94)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  youBadge: {
    position: 'absolute',
    right: 9,
    bottom: 9,
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

  itemInfo: {
    padding: 12,
  },

  itemName: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.text,
  },

  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
    gap: 6,
  },

  colorDot: {
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  colorText: {
    ...AuraTypography.small,
    color: AuraColors.textMuted,
  },

  emptyCard: {
    backgroundColor: AuraColors.surface,
    borderRadius: AuraRadius.large,
    borderWidth: 1,
    borderColor: AuraColors.border,
    padding: 30,
    alignItems: 'center',
    marginTop: 5,
  },

  emptyIcon: {
    width: 55,
    height: 55,
    borderRadius: 18,
    backgroundColor: AuraColors.surfacePurple,
    alignItems: 'center',
    justifyContent: 'center',
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
    marginTop: 5,
  },

  emptyButton: {
    marginTop: 15,
    backgroundColor: AuraColors.purple,
    borderRadius: AuraRadius.pill,
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  emptyButtonText: {
    ...AuraTypography.small,
    color: AuraColors.white,
    fontWeight: '700',
  },

  auraCard: {
    marginTop: 28,
    borderRadius: AuraRadius.large,
    backgroundColor: AuraColors.navy,
    padding: AuraSpacing.xl,
    flexDirection: 'row',
  },

  auraIcon: {
    width: 45,
    height: 45,
    borderRadius: 15,
    backgroundColor: 'rgba(201,154,74,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 13,
  },

  auraContent: {
    flex: 1,
  },

  auraEyebrow: {
    ...AuraTypography.label,
    color: AuraColors.goldLight,
  },

  auraTitle: {
    ...AuraTypography.subheading,
    color: AuraColors.white,
    marginTop: 3,
  },

  auraText: {
    ...AuraTypography.small,
    color: '#D9D7E8',
    lineHeight: 19,
    marginTop: 4,
  },

  auraAction: {
    alignSelf: 'flex-start',
    marginTop: 13,
    backgroundColor: AuraColors.purple,
    borderRadius: AuraRadius.pill,
    paddingHorizontal: 13,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },

  auraActionText: {
    ...AuraTypography.small,
    color: AuraColors.white,
    fontWeight: '700',
  },

  bottomAddButton: {
    marginTop: 14,
    minHeight: 49,
    borderRadius: AuraRadius.medium,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 7,
  },

  bottomAddText: {
    ...AuraTypography.button,
    color: AuraColors.purple,
  },

  footerText: {
    ...AuraTypography.small,
    color: AuraColors.textMuted,
    textAlign: 'center',
    marginTop: 25,
  },

  bottomSpace: {
    height: 20,
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,19,47,0.58)',
    justifyContent: 'flex-end',
  },

  addModal: {
    height: '91%',
    backgroundColor: AuraColors.background,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: AuraSpacing.xl,
    paddingBottom: 20,
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
    marginBottom: 15,
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

  imagePicker: {
    height: 180,
    borderRadius: AuraRadius.large,
    backgroundColor: AuraColors.surfacePurple,
    borderWidth: 1.5,
    borderColor: AuraColors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  imagePickerSelected: {
    borderStyle: 'solid',
  },

  selectedPreview: {
    width: '100%',
    height: '100%',
  },

  imagePickerIcon: {
    width: 52,
    height: 52,
    borderRadius: 17,
    backgroundColor: AuraColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 9,
  },

  imagePickerTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.text,
  },

  imagePickerSubtitle: {
    ...AuraTypography.small,
    color: AuraColors.textMuted,
    marginTop: 3,
  },

  photoButtons: {
    flexDirection: 'row',
    gap: 9,
    marginTop: 10,
  },

  photoButton: {
    flex: 1,
    height: 45,
    borderRadius: AuraRadius.medium,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },

  photoButtonText: {
    ...AuraTypography.small,
    color: AuraColors.purple,
    fontWeight: '700',
  },

  inputLabel: {
    ...AuraTypography.label,
    color: AuraColors.text,
    marginTop: 15,
    marginBottom: 7,
  },

  input: {
    height: 49,
    borderRadius: AuraRadius.medium,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    paddingHorizontal: 14,
    ...AuraTypography.body,
    color: AuraColors.text,
  },

  modalChipRow: {
    gap: 7,
  },

  modalChip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  modalChipActive: {
    backgroundColor: AuraColors.purple,
    borderColor: AuraColors.purple,
  },

  modalChipText: {
    ...AuraTypography.small,
    color: AuraColors.textSecondary,
    fontWeight: '600',
  },

  modalChipTextActive: {
    color: AuraColors.white,
  },

  colorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 11,
    paddingVertical: 8,
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  colorChipActive: {
    borderColor: AuraColors.purple,
    backgroundColor: AuraColors.surfacePurple,
  },

  colorChipDot: {
    width: 13,
    height: 13,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  colorChipText: {
    fontSize: 11,
    color: AuraColors.textSecondary,
    fontWeight: '600',
  },

  colorChipTextActive: {
    color: AuraColors.purple,
  },

  saveButton: {
    marginTop: 18,
    height: 52,
    borderRadius: AuraRadius.medium,
    backgroundColor: AuraColors.purple,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    ...AuraShadow.floating,
  },

  saveButtonText: {
    ...AuraTypography.button,
    color: AuraColors.white,
  },

  centerBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(17,19,47,0.58)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },

  filterModal: {
    width: '100%',
    backgroundColor: AuraColors.background,
    borderRadius: 27,
    padding: AuraSpacing.xl,
    ...AuraShadow.card,
  },

  sortOption: {
    minHeight: 70,
    borderRadius: AuraRadius.medium,
    backgroundColor: AuraColors.surface,
    borderWidth: 1,
    borderColor: AuraColors.border,
    paddingHorizontal: 13,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 9,
  },

  sortOptionActive: {
    backgroundColor: AuraColors.surfacePurple,
    borderColor: AuraColors.purple,
  },

  sortTextWrap: {
    flex: 1,
    marginLeft: 11,
  },

  sortTitle: {
    ...AuraTypography.bodyMedium,
    color: AuraColors.text,
  },

  sortSubtitle: {
    ...AuraTypography.small,
    color: AuraColors.textMuted,
    marginTop: 2,
  },

  statsCard: {
    marginTop: 8,
    minHeight: 76,
    borderRadius: AuraRadius.medium,
    backgroundColor: AuraColors.navy,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },

  statItem: {
    flex: 1,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: AuraColors.white,
  },

  statLabel: {
    fontSize: 9,
    color: '#D9D7E8',
    marginTop: 2,
  },

  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
}); 