import {ReactNode, useEffect, useRef, useState} from 'react';
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

type Props<ItemT> = {
  placeholder?: string;
  minSearchLength?: number;
  onPress: (item: ItemT) => void;
  renderItem: (item: ItemT) => ReactNode;
  asyncFetcher: (query: string) => Promise<any>;
};

export function Typeahead<ItemT extends {id: string | number}>({
  renderItem,
  onPress,
  placeholder,
  asyncFetcher,
  minSearchLength = 2,
}: Props<ItemT>) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isFocued, setIsFocused] = useState(false);

  const inputRef = useRef<TextInput>(null);

  const _onPress = (item: ItemT) => {
    inputRef?.current?.blur();
    onPress(item);
  };

  const _renderItem = ({item}: {item: ItemT}) => {
    return (
      <TouchableOpacity onPress={() => _onPress(item)}>
        {renderItem(item)}
      </TouchableOpacity>
    );
  };

  const handleQueryChange = async (newQuery: string) => {
    if (newQuery.length < minSearchLength) {
      setResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await asyncFetcher(newQuery);
      setResults(response);
      setIsSearching(false);
    } catch (error) {
      console.error('Error fetching data:', error);
      setResults([]);
      setIsSearching(false);
    }
  };

  useEffect(() => {
    handleQueryChange(query);
  }, [query]);

  return (
    <View style={{zIndex: 1}}>
      <TextInput
        ref={inputRef}
        style={styles.searchInput}
        placeholder={placeholder}
        onChangeText={setQuery}
        value={query}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
      />
      {(isSearching || results.length > 0) && isFocued ? (
        <View style={styles.list}>
          {isSearching ? (
            <ActivityIndicator size="large" />
          ) : (
            <FlatList
              keyExtractor={d => String(d.id)}
              data={results}
              renderItem={_renderItem}
            />
          )}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: 'white',
    borderTopWidth: 0,
    left: 0,
    position: 'absolute',
    right: 0,
    zIndex: 10,
    top: 35,
    maxHeight: 300,
    borderStyle: 'solid',
    borderColor: 'gray',
    borderWidth: 1,
  },
  searchInput: {
    backgroundColor: 'white',
    borderColor: 'gray',
    borderRadius: 4,
    borderWidth: 1,
    fontSize: 14,
    padding: 8,
  },
});
