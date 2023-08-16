import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  RefreshControl,
  StyleSheet,
  Button,
} from 'react-native';
import BottomModal from '../BottomModal';
import React, {useState, useMemo} from 'react';
import {useGitHubContext} from '../../stores/GitHubContext';
import {RepoDetail} from '../../components/RepoDetail';

const SORTS = ['Ascending', 'Descending'];

export default function SavedList() {
  const {
    savedRepos,
    fetchSavedRepos,
    isFetching: isFetchingSavedRepos,
    deleteRepo,
  } = useGitHubContext();

  const [sortMethod, setSortMethod] = useState('Ascending');
  const [selectedRepo, setSelectedRepo] = useState<SavedRepo | null>(null);
  const [isSortModalOpen, setIsSortModalOpen] = useState(false);

  const sortedRepos = useMemo(() => {
    switch (sortMethod) {
      case 'Ascending':
        return savedRepos.sort(
          (repoA, repoB) => repoA.stargazersCount - repoB.stargazersCount,
        );
      case 'Descending':
        return savedRepos.sort(
          (repoA, repoB) => repoB.stargazersCount - repoA.stargazersCount,
        );
      default:
        return savedRepos;
    }
  }, [savedRepos, sortMethod]);

  const closeModal = () => setSelectedRepo(null);
  const selectSortMethod = (method: string) => {
    setSortMethod(method);
    setIsSortModalOpen(false);
  };

  return (
    <>
      <View style={styles.container}>
        <Text style={styles.headerText}>Saved Repositories: </Text>
        <Button onPress={() => setIsSortModalOpen(true)} title="Sort" />
      </View>
      {sortedRepos.length > 0 ? (
        <FlatList
          contentContainerStyle={styles.listContainer}
          data={sortedRepos}
          keyExtractor={item => item.id.toString()}
          renderItem={({item}) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => {
                setSelectedRepo(item);
              }}>
              <View style={styles.detailCard}>
                <View style={styles.rowContainer}>
                  <View style={styles.infoContainer}>
                    <Text style={styles.textName}>{item.fullName}</Text>
                    <View style={styles.row}>
                      <Text>{`Language: ${item.language}`}</Text>
                      <Text>{`Stars: ${item.stargazersCount}`}</Text>
                    </View>
                    <View style={styles.deleteButton}>
                      <Button title="Delete" onPress={() => deleteRepo(item)} />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isFetchingSavedRepos}
              onRefresh={fetchSavedRepos}
            />
          }
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyHeader}>Nothing has been saved yet.</Text>
          <Text>Start adding favorite repos by searching above!</Text>
        </View>
      )}
      {selectedRepo != null && (
        <BottomModal
          visible={true}
          onClose={closeModal}
          actionButtons={[
            {
              title: 'Delete',
              onPress: () => {
                deleteRepo(selectedRepo);
                closeModal();
              },
            },
          ]}>
          <RepoDetail repoID={selectedRepo.id} />
        </BottomModal>
      )}
      <BottomModal
        visible={isSortModalOpen}
        onClose={() => setIsSortModalOpen(false)}
        actionButtons={SORTS.map(sort => ({
          title: sort,
          onPress: () => selectSortMethod(sort),
          disabled: sort === sortMethod,
        }))}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  listContainer: {
    paddingBottom: 120,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
  },
  emptyHeader: {fontSize: 20, fontWeight: 'bold'},
  row: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  deleteButton: {alignItems: 'flex-end'},
  detailCard: {
    padding: 20,
    marginBottom: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  infoContainer: {
    flex: 1,
  },
  textName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  headerText: {
    fontSize: 24,
    fontWeight: '400',
    margin: 4,
  },
});
