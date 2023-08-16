import React, {useEffect, useMemo, useState} from 'react';
import {
  ActivityIndicator,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {EdgeInsets, useSafeAreaInsets} from 'react-native-safe-area-context';

const insetCalc = (insets: EdgeInsets) => ({
  paddingTop: Math.max(insets.top, 16),
  paddingBottom: Math.max(insets.bottom, 16),
  paddingLeft: Math.max(insets.left, 16),
  paddingRight: Math.max(insets.right, 16),
});

export const RepoDetail = ({
  repoID,
  repoInfo,
}: {
  repoID: string;
  repoInfo?: SearchResult;
}) => {
  const insets = useSafeAreaInsets();
  const style = useMemo(() => insetCalc(insets), [insets]);
  const [gitHubRepo, setGitHubRepo] = useState<SearchResult | undefined>(
    repoInfo,
  );

  useEffect(() => {
    if (gitHubRepo != null) return;

    const fetchData = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repositories/${repoID}`,
        );
        const data = await response.json();
        setGitHubRepo(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [repoID]);

  const onOpenURL = async () => {
    gitHubRepo && (await Linking.openURL(gitHubRepo?.html_url));
  };

  return (
    <View style={style}>
      {gitHubRepo != null ? (
        <View>
          <Text style={styles.textName}>{gitHubRepo.full_name}</Text>
          <View style={styles.row}>
            <Text>{`Language: ${gitHubRepo.language}`}</Text>
            <Text>{`Stars: ${gitHubRepo.stargazers_count}`}</Text>
          </View>
          <Text numberOfLines={5} style={styles.textDescription}>
            {gitHubRepo.description}
          </Text>
          <TouchableOpacity onPress={onOpenURL}>
            <Text style={styles.url}>{gitHubRepo.html_url}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ActivityIndicator size={'large'} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  textName: {
    fontWeight: 'bold',
    fontSize: 24,
  },
  textDescription: {
    fontWeight: '300',
    fontSize: 16,
    paddingVertical: 4,
  },
  url: {
    color: '#517fa4',
  },
  row: {
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: 'gray',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
    marginTop: 4,
  },
});
