import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
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
} from '../../constants/auraTheme';

type Category =
  | 'All'
  | 'Tops'
  | 'Bottoms'
  | 'Dresses'
  | 'Shoes'
  | 'Accessories';

type WardrobeItem = {
  id: string;
  name: string;
  category: Exclude<Category, 'All'>;
  image: string;
  colors: string[];
};

const ITEMS: WardrobeItem[] = [
  {
    id: '1',
    name: 'White Shirt',
    category: 'Tops',
    image:
      'https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=700&q=85',
    colors: ['#F8F8F5', '#D8D4CA'],
  },
  {
    id: '2',
    name: 'Denim Jacket',
    category: 'Tops',
    image:
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?auto=format&fit=crop&w=700&q=85',
    colors: ['#4C6D8D', '#A7B4C0'],
  },
  {
    id: '3',
    name: 'Black Jeans',
    category: 'Bottoms',
    image:
      'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&w=700&q=85',
    colors: ['#171717', '#3A3A3A'],
  },
  {
    id: '4',
    name: 'Neutral Dress',
    category: 'Dresses',
    image:
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?auto=format&fit=crop&w=700&q=85',
    colors: ['#C8B49D', '#E6D8C8'],
  },
  {
    id: '5',
    name: 'White Sneakers',
    category: 'Shoes',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85',
    colors: ['#F5F5F5', '#D7D7D7'],
  },
  {
    id: '6',
    name: 'Black Bag',
    category: 'Accessories',
    image:
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=85',
    colors: ['#171717', '#8A8178'],
  },
];

const CATEGORIES: Category[] = [
  'All',
  'Tops',
  'Bottoms',
  'Dresses',
  'Shoes',
  'Accessories',
];

function WardrobeCard({
  item,
}: {
  item: WardrobeItem;
}) {
  const [favorite, setFavorite] = useState(false);

  return (
    <Pressable
      style={({ pressed }) => [
        styles.itemCard,
        pressed && styles.itemPressed,
      ]}
    >
      <View style={styles.itemImageContainer}>
        <Image
          source={{ uri: item.image }}
          style={styles.itemImage}
        />

        <Pressable
          style={styles.favoriteButton}
          onPress={() => setFavorite(!favorite)}
          hitSlop={8}
        >
          <Ionicons
            name={favorite ? 'heart' : 'heart-outline'}
            size={18}
            color={
              favorite
                ? AuraColors.error
                : AuraColors.navy
            }
          />
        </Pressable>

        <View style={styles.categoryBadge}>
          <Text style={styles.categoryBadgeText}>
            {item.category}
          </Text>
        </View>
      </View>

      <View style={styles.itemInfo}>
        <Text
          style={styles.itemName}
          numberOfLines={1}
        >
          {item.name}
        </Text>

        <View style={styles.itemBottomRow}>
          <View style={styles.colorDots}>
            {item.colors.map((color, index) => (
              <View
                key={`${item.id}-${index}`}
                style={[
                  styles.colorDot,
                  {
                    backgroundColor: color,
                  },
                ]}
              />
            ))}
          </View>

          <Ionicons
            name="chevron-forward"
            size={15}
            color={AuraColors.textMuted}
          />
        </View>
      </View>
    </Pressable>
  );
}

export default function WardrobeScreen() {
  const [selectedCategory, setSelectedCategory] =
    useState<Category>('All');

  const filteredItems =
    selectedCategory === 'All'
      ? ITEMS
      : ITEMS.filter(
          (item) =>
            item.category === selectedCategory
        );

  const handleAddItem = () => {
    Alert.alert(
      'Add to Wardrobe',
      'Choose how you want to add your clothing item.',
      [
        {
          text: 'Take a Photo',
          onPress: () => {
            Alert.alert(
              'Camera',
              'Camera upload will be connected next.'
            );
          },
        },
        {
          text: 'Choose from Gallery',
          onPress: () => {
            Alert.alert(
              'Gallery',
              'Gallery upload will be connected next.'
            );
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

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
              YOUR DIGITAL CLOSET
            </Text>

            <Text style={styles.title}>
              My Wardrobe
            </Text>

            <Text style={styles.subtitle}>
              {ITEMS.length} pieces in your closet
            </Text>
          </View>

          <Pressable
            onPress={handleAddItem}
            style={styles.addButton}
          >
            <Ionicons
              name="add"
              size={25}
              color={AuraColors.white}
            />
          </Pressable>
        </View>

        {/* INTRO CARD */}
        <View style={styles.introCard}>
          <View style={styles.introIcon}>
            <Ionicons
              name="shirt-outline"
              size={23}
              color={AuraColors.purple}
            />
          </View>

          <View style={styles.introText}>
            <Text style={styles.introTitle}>
              Your personal closet
            </Text>

            <Text style={styles.introSubtitle}>
              Keep your favorite pieces here and
              let OutfitAura style them for you.
            </Text>
          </View>
        </View>

        {/* CATEGORY FILTERS */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((category) => {
            const active =
              selectedCategory === category;

            return (
              <Pressable
                key={category}
                onPress={() =>
                  setSelectedCategory(category)
                }
                style={[
                  styles.categoryChip,
                  active &&
                    styles.categoryChipActive,
                ]}
              >
                <Text
                  style={[
                    styles.categoryText,
                    active &&
                      styles.categoryTextActive,
                  ]}
                >
                  {category}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>

        {/* WARDROBE HEADER */}
        <View style={styles.gridHeader}>
          <View>
            <Text style={styles.gridTitle}>
              {selectedCategory === 'All'
                ? 'All pieces'
                : selectedCategory}
            </Text>

            <Text style={styles.gridSubtitle}>
              {filteredItems.length}{' '}
              {filteredItems.length === 1
                ? 'item'
                : 'items'}
            </Text>
          </View>

          <Pressable style={styles.sortButton}>
            <Ionicons
              name="options-outline"
              size={18}
              color={AuraColors.navy}
            />
          </Pressable>
        </View>

        {/* GRID */}
        <View style={styles.grid}>
          {filteredItems.map((item) => (
            <WardrobeCard
              key={item.id}
              item={item}
            />
          ))}
        </View>

        {/* AI CARD */}
        <Pressable
          onPress={() => router.push('/create')}
          style={styles.aiCard}
        >
          <View style={styles.aiIcon}>
            <Ionicons
              name="sparkles"
              size={20}
              color={AuraColors.white}
            />
          </View>

          <View style={styles.aiText}>
            <Text style={styles.aiTitle}>
              Style your wardrobe
            </Text>

            <Text style={styles.aiSubtitle}>
              Create a new outfit using pieces
              already in your closet.
            </Text>
          </View>

          <View style={styles.aiArrow}>
            <Ionicons
              name="arrow-forward"
              size={17}
              color={AuraColors.white}
            />
          </View>
        </Pressable>

        {/* FOOTER */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>
            OUTFITAURA
          </Text>

          <Text style={styles.footerText}>
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

  /* HEADER */

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
    fontSize: 13,
    marginTop: 5,
  },

  addButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: AuraColors.purple,
    alignItems: 'center',
    justifyContent: 'center',
    ...AuraShadow.floating,
  },

  /* INTRO */

  introCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuraColors.surfacePurple,
    borderRadius: AuraRadius.large,
    padding: AuraSpacing.lg,
    marginBottom: AuraSpacing.xl,
  },

  introIcon: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: AuraColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: AuraSpacing.md,
  },

  introText: {
    flex: 1,
  },

  introTitle: {
    color: AuraColors.navy,
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },

  introSubtitle: {
    color: AuraColors.textSecondary,
    fontSize: 11,
    lineHeight: 17,
  },

  /* FILTERS */

  categoryScroll: {
    paddingBottom: 4,
    gap: 8,
  },

  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: AuraRadius.pill,
    backgroundColor: AuraColors.white,
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  categoryChipActive: {
    backgroundColor: AuraColors.navy,
    borderColor: AuraColors.navy,
  },

  categoryText: {
    color: AuraColors.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },

  categoryTextActive: {
    color: AuraColors.white,
  },

  /* GRID HEADER */

  gridHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: AuraSpacing.xl,
    marginBottom: AuraSpacing.md,
  },

  gridTitle: {
    color: AuraColors.text,
    fontSize: 19,
    fontWeight: '700',
  },

  gridSubtitle: {
    color: AuraColors.textMuted,
    fontSize: 11,
    marginTop: 2,
  },

  sortButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: AuraColors.white,
    alignItems: 'center',
    justifyContent: 'center',
    ...AuraShadow.soft,
  },

  /* GRID */

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    rowGap: AuraSpacing.md,
  },

  itemCard: {
    width: '48.2%',
    backgroundColor: AuraColors.white,
    borderRadius: AuraRadius.large,
    overflow: 'hidden',
    ...AuraShadow.soft,
  },

  itemPressed: {
    opacity: 0.9,
    transform: [{ scale: 0.99 }],
  },

  itemImageContainer: {
    height: 185,
    backgroundColor: AuraColors.surfaceSoft,
    position: 'relative',
  },

  itemImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },

  favoriteButton: {
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

  categoryBadge: {
    position: 'absolute',
    left: 10,
    bottom: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: AuraRadius.pill,
    backgroundColor: 'rgba(18,22,74,0.82)',
  },

  categoryBadgeText: {
    color: AuraColors.white,
    fontSize: 9,
    fontWeight: '700',
  },

  itemInfo: {
    padding: 12,
  },

  itemName: {
    color: AuraColors.navy,
    fontSize: 14,
    fontWeight: '700',
  },

  itemBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 9,
  },

  colorDots: {
    flexDirection: 'row',
    gap: 5,
  },

  colorDot: {
    width: 13,
    height: 13,
    borderRadius: 6.5,
    borderWidth: 1,
    borderColor: AuraColors.border,
  },

  /* AI CARD */

  aiCard: {
    marginTop: AuraSpacing.xl,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: AuraColors.navy,
    borderRadius: AuraRadius.large,
    padding: AuraSpacing.lg,
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
    fontSize: 15,
    fontWeight: '700',
    marginBottom: 3,
  },

  aiSubtitle: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11,
    lineHeight: 16,
  },

  aiArrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: AuraColors.purpleDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
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
});