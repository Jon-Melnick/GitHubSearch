type SavedRepo = {
  id: string;
  fullName: string;
  createdAt: string;
  stargazersCount: number;
  language: string;
  url: string;
};

type SavedRepoList = SavedRepo[];

type SearchResult = {
  id: number;
  description: string;
  stargazers_count: number;
  full_name: string;
  created_at: string;
  language: string;
  url: string;
  html_url: string;
  // ... other properties
};

type FetchFunction<T> = (...args: any[]) => Promise<T>;
