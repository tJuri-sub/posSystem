import { View, TextInput, StyleSheet } from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
  return (
    <View style={styles.container}>
      <Ionicons name="search-outline" size={24} color="#00487C" />
      <TextInput
        style={styles.search}
        placeholder="Search product name..."
        placeholderTextColor="#999999"
        value={value}
        onChangeText={onChangeText}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    width: ' 100%',
    paddingLeft: 10,

    marginTop: 10,

    borderColor: 'hsla(100,18%,13%,0.16)',

    borderWidth: 1,
    borderRadius: 6,

    backgroundColor: '#FFFFFF',
  },

  search: {
    width: '100%',

    marginLeft: 10,
    paddingLeft: 10,

    borderLeftColor: 'hsla(100,18%,13%,0.16)',
    borderLeftWidth: 1,

    color: '#000000',
    fontSize: 16,
  },
});
