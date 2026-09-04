import { StyleSheet, Text, View } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OutfitAura</Text>
      <Text style={styles.subtitle}>Your style, made smarter.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FAF8FC',
  },

  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#12164A',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 15,
    color: '#6E6879',
  },
});