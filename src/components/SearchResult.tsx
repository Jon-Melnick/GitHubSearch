import {StyleSheet, Text, View} from 'react-native';

const SearchResult = ({item}: {item: SearchResult}) => {
  return (
    <View style={styles.dropdownItem}>
      <Text style={styles.text}>{item.full_name}</Text>
      <View style={styles.row}>
        <Text>{item.language}</Text>
        <Text>{`stars: ${item.stargazers_count}`}</Text>
      </View>
      <Text numberOfLines={3}>{item.description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontWeight: 'bold',
  },
  dropdownItem: {
    padding: 10,
    borderColor: 'aaa',
    borderBottomWidth: 1,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
});

export default SearchResult;
