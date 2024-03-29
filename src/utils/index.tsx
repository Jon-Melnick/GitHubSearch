import React from 'react';

export const fetchData: FetchFunction<SearchResult[]> = async (
  query: string,
) => {
  try {
    const response = await fetch(
      `https://api.github.com/search/repositories?q=${query}`,
    );
    const repos = await response.json();
    return repos.items;
  } catch (err) {
    console.error('err');
    return new Promise(() => []);
  }
};

export const useGetLatest = (obj: any) => {
  const ref = React.useRef();
  ref.current = obj;

  return React.useCallback(() => ref.current, []);
};

export function useAsyncDebounce<T>(
  defaultFn: FetchFunction<T>,
  defaultWait = 0,
) {
  const debounceRef = React.useRef<{
    promise?: any;
    resolve: (value: unknown) => void;
    reject: (reason: any) => void;
    timeout?: string | number | NodeJS.Timeout;
  }>({resolve: () => {}, reject: () => {}});

  const getDefaultFn: any = useGetLatest(defaultFn);
  const getDefaultWait = useGetLatest(defaultWait);

  return React.useCallback(
    async (...args: any) => {
      if (!debounceRef.current.promise) {
        debounceRef.current.promise = new Promise((resolve, reject) => {
          debounceRef.current.resolve = resolve;
          debounceRef.current.reject = reject;
        });
      }

      if (debounceRef.current.timeout) {
        clearTimeout(debounceRef.current.timeout);
      }

      debounceRef.current.timeout = setTimeout(async () => {
        delete debounceRef.current.timeout;
        try {
          debounceRef.current.resolve(await getDefaultFn()(...args));
        } catch (err) {
          debounceRef.current.reject(err);
        } finally {
          delete debounceRef.current.promise;
        }
      }, getDefaultWait());

      return debounceRef.current.promise;
    },
    [getDefaultFn, getDefaultWait],
  );
}
