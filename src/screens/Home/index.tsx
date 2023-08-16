import React, {useMemo, useState} from 'react';
import {View} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';
import {Typeahead} from '../../components/Typeahead';
import SearchResult from '../../components/SearchResult';
import {useGitHubContext} from '../../stores/GitHubContext';
import BottomModal from '../../components/BottomModal';
import SavedList from '../../components/SavedList';
import {RepoDetail} from '../../components/RepoDetail';
import {useAsyncDebounce, fetchData} from '../../utils';

const insetCalc = (insets: EdgeInsets) => ({
  paddingTop: Math.max(insets.top, 16),
  paddingBottom: Math.max(insets.bottom, 16),
  paddingLeft: Math.max(insets.left, 16),
  paddingRight: Math.max(insets.right, 16),
});

export const Home = () => {
  const insets = useSafeAreaInsets();
  const style = useMemo(() => insetCalc(insets), [insets]);
  const {saveRepo} = useGitHubContext();
  const [selectedSearchResult, setSelectedSearchResult] =
    useState<SearchResult | null>(null);

  const debouncedFetchData = useAsyncDebounce(fetchData, 1000);

  const onPressSearchResult = (item: SearchResult) => {
    setSelectedSearchResult(item);
  };

  const clearSelected = () => setSelectedSearchResult(null);

  return (
    <View style={style}>
      <Typeahead<SearchResult>
        placeholder="Search GitHub Repositories..."
        renderItem={item => <SearchResult item={item} />}
        onPress={onPressSearchResult}
        asyncFetcher={debouncedFetchData}
      />
      <SavedList />
      {selectedSearchResult && (
        <BottomModal
          visible={true}
          onClose={clearSelected}
          actionButtons={[
            {
              title: 'Save',
              onPress: () => {
                saveRepo(selectedSearchResult);
                clearSelected();
              },
            },
          ]}>
          <RepoDetail
            repoID={String(selectedSearchResult.id)}
            repoInfo={selectedSearchResult}
          />
        </BottomModal>
      )}
    </View>
  );
};
