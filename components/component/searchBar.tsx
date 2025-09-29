import { View, TextInput, StyleSheet } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
}

export const SearchBar = ({ value, onChangeText }: SearchBarProps) => {
  return (
    <View style={styles.container}>
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
    width: ' 100%',

    marginTop: 10,
  },

  search: {
    width: '100%',

    paddingLeft: 10,

    borderColor: 'rgba(31,39,27,0.4)',

    borderWidth: 1,
    borderRadius: 6,

    backgroundColor: '#FFFFFF',

    color: '#000000',
    fontSize: 16,
  },
});
