import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { AuraColors, AuraShadow } from '@/constants/auraTheme';

type TabIconProps = {
  focused: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

function TabIcon({ focused, icon, label }: TabIconProps) {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
        <Ionicons
          name={icon}
          size={21}
          color={focused ? AuraColors.purple : AuraColors.textMuted}
        />
      </View>

      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

function CustomTabBar({ state, navigation }: any) {
  return (
    <View style={styles.tabBarContainer}>
      <View style={styles.tabBar}>
        {state.routes.map((route: any, index: number) => {
          const focused = state.index === index;

          let icon: keyof typeof Ionicons.glyphMap = 'home-outline';
          let label = 'Home';

          if (route.name === 'index') {
            icon = focused ? 'home' : 'home-outline';
            label = 'Home';
          }

          if (route.name === 'wardrobe') {
            icon = focused ? 'shirt' : 'shirt-outline';
            label = 'Wardrobe';
          }

          if (route.name === 'saved') {
            icon = focused ? 'heart' : 'heart-outline';
            label = 'Saved';
          }

          if (route.name === 'profile') {
            icon = focused ? 'person' : 'person-outline';
            label = 'You';
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              activeOpacity={0.8}
              onPress={onPress}
              style={styles.tabButton}
            >
              <TabIcon
                focused={focused}
                icon={icon}
                label={label}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />

      <Tabs.Screen
        name="wardrobe"
        options={{
          title: 'Wardrobe',
        }}
      />

      <Tabs.Screen
        name="saved"
        options={{
          title: 'Saved',
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: 'You',
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 14,
  },

  tabBar: {
    height: 72,
    backgroundColor: AuraColors.surface,
    borderRadius: 28,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 6,
    borderWidth: 1,
    borderColor: AuraColors.borderLight,
    ...AuraShadow.floating,
  },

  tabButton: {
    flex: 1,
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },

  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrap: {
    width: 38,
    height: 34,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconWrapActive: {
    backgroundColor: AuraColors.surfacePurple,
  },

  tabLabel: {
    fontSize: 10,
    lineHeight: 13,
    fontWeight: '500',
    color: AuraColors.textMuted,
    marginTop: 2,
  },

  tabLabelActive: {
    color: AuraColors.purple,
    fontWeight: '700',
  },
});