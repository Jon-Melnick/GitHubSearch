import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';

type State = {
  savedRepos: SavedRepoList;
  isFetching: boolean;
};

type Context = {
  savedRepos: SavedRepoList;
  isFetching: boolean;
  fetchSavedRepos: () => void;
  saveRepo: (repo: SearchResult) => void;
  deleteRepo: (repo: SavedRepo) => void;
};

type ActionType =
  | 'INIT_REPOSITORIES'
  | 'SET_IS_FETCHING_REPOS'
  | 'ADD_REPOSITORY'
  | 'DELETE_REPOSITORY';

const GitHubContext = createContext<Context | undefined>(undefined);

const DEFAULT_STATE = {
  savedRepos: [],
  isFetching: true,
  error: null,
};

// Define reducer function
const reducer = (state: State, action: {type: ActionType; payload: any}) => {
  switch (action.type) {
    case 'INIT_REPOSITORIES':
      return {
        ...state,
        savedRepos: action.payload as SavedRepoList,
        isFetching: false,
      };
    case 'SET_IS_FETCHING_REPOS':
      return {...state, isFetching: action.payload};
    case 'ADD_REPOSITORY':
      return {
        ...state,
        savedRepos: [...state.savedRepos, action.payload] as SavedRepoList,
      };
    case 'DELETE_REPOSITORY':
      return {
        ...state,
        savedRepos: state.savedRepos.filter(repo => repo.id !== action.payload),
      };
    default:
      return state;
  }
};

// Create context provider component
export const GitHubProvider = ({children}: {children: ReactNode}) => {
  const [state, dispatch] = useReducer(reducer, DEFAULT_STATE);

  const initSavedRepositories = (savedRepos: SavedRepoList) => {
    dispatch({type: 'INIT_REPOSITORIES', payload: savedRepos});
  };

  const addRepository = (repo: SavedRepo) => {
    dispatch({type: 'ADD_REPOSITORY', payload: repo});
  };

  const deleteRepository = (id: string) => {
    dispatch({type: 'DELETE_REPOSITORY', payload: id});
  };

  const setIsFetching = (isFetching: boolean) => {
    dispatch({type: 'SET_IS_FETCHING_REPOS', payload: isFetching});
  };

  const fetchSavedRepos = async () => {
    try {
      const response = await fetch('http://localhost:8080/repo/');
      const data = await response.json();
      initSavedRepositories(data.repos);
    } catch (error) {
      console.error('Error fetching repositories:', error);
    }
  };

  const saveRepo = async (repo: SearchResult) => {
    if (state.savedRepos.length === 10) {
      console.error(
        'You have already saved your max allowed repositories. Please delete one if you want to save a different one.',
      );
      return;
    } else if (
      state.savedRepos.findIndex(saved => saved.id === String(repo.id)) > -1
    ) {
      console.error(
        'You have already saved this repository to your favorites.',
      );
      return;
    }

    try {
      const saveObject = {
        id: repo.id.toString(),
        stargazersCount: repo.stargazers_count,
        fullName: repo.full_name,
        createdAt: repo.created_at,
        language: repo.language,
        url: repo.url,
      };
      // Optimistic response: add the repo to the list of saved ones
      addRepository(saveObject);
      const response = await fetch('http://localhost:8080/repo/', {
        method: 'POST',
        body: JSON.stringify(saveObject),
      });
      console.log(response.ok, response);
      if (!response.ok) throw new Error('Trouble saving repository');
    } catch (error) {
      console.log(error);
      // Handle issue if there was a problem saving the repo to the server by undoing the optimistic response
      deleteRepository(String(repo.id));
    }
  };

  const deleteRepo = async (repo: SavedRepo) => {
    try {
      // Optimistic response: remove the repo from the list of saved ones
      deleteRepository(repo.id);
      const response = await fetch(`http://localhost:8080/repo/${repo.id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Trouble deleting repository');
    } catch (error) {
      console.log(error);
      // Handle issue if there was a problem deleting the repo to the server by undoing the optimistic response
      addRepository(repo);
    }
  };

  useEffect(() => {
    // Fetch data on initialization
    fetchSavedRepos();
  }, []);

  const contextValue = {
    ...state,
    fetchSavedRepos,
    saveRepo,
    deleteRepo,
  };

  return (
    <GitHubContext.Provider value={contextValue}>
      {children}
    </GitHubContext.Provider>
  );
};

// Custom hook to access the context
export const useGitHubContext = () => {
  const context = useContext(GitHubContext);
  if (!context)
    throw new Error('No Context.Provider found when calling useGitHubContext.');
  return context;
};
