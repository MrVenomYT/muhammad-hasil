import useSWR, { mutate as globalSWRMutate } from 'swr';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { initialSeedProjects, seedProductsList } from './storage';

export const PROJECTS_QUERY_KEY = ['projects'];

// Helper to get cached data synchronously from localStorage on client side
const getLocalStorageCache = (key, fallback) => {
  if (typeof window === 'undefined') return fallback;
  try {
    const cached = localStorage.getItem(key);
    if (cached) {
      const parsed = JSON.parse(cached);
      if (Array.isArray(parsed) ? parsed.length > 0 : parsed && Object.keys(parsed).length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.warn(`Error reading localStorage key [${key}]:`, e);
  }
  return fallback;
};

// Helper to update localStorage cache synchronously
const setLocalStorageCache = (key, data) => {
  if (typeof window === 'undefined' || !data) return;
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn(`Error writing localStorage key [${key}]:`, e);
  }
};

// Universal JSON fetcher with error handling and automatic localStorage caching
export const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch from ${url}: ${res.statusText}`);
  }
  const json = await res.json();
  if (json && json.success !== undefined && !json.success) {
    throw new Error(json.error || 'API returned an error');
  }
  const resultData = json.data !== undefined ? json.data : json;

  // Cache response into localStorage based on route
  if (url.includes('/api/projects')) setLocalStorageCache('swr_cached_projects', resultData);
  if (url.includes('/api/about')) setLocalStorageCache('swr_cached_about', resultData);
  if (url.includes('/api/products')) setLocalStorageCache('swr_cached_products', resultData);

  return resultData;
};

// React Query Custom Hook for Fetching Projects
export function useProjectsQuery() {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: () => fetcher('/api/projects'),
    initialData: () => getLocalStorageCache('swr_cached_projects', initialSeedProjects),
    staleTime: 1000 * 60 * 5,
  });
}

// React Query Custom Mutation Hook for Adding/Updating Projects with explicit cache invalidation
export function useSaveProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ payload, isEdit }) => {
      const url = isEdit ? `/api/projects/${payload.id || payload._id}` : '/api/projects';
      const method = isEdit ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to save project');
      }
      return data.data;
    },
    onSuccess: (savedProject) => {
      // Explicitly invalidate the 'projects' query key so UI immediately refetches and updates server state
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      // Also revalidate SWR cache
      globalSWRMutate('/api/projects');

      if (typeof window !== 'undefined') {
        const current = getLocalStorageCache('swr_cached_projects', []);
        const filtered = current.filter(p => p.id !== savedProject.id && p._id !== savedProject._id && p.title?.toLowerCase() !== savedProject.title?.toLowerCase());
        const updatedList = [savedProject, ...filtered];
        setLocalStorageCache('swr_cached_projects', updatedList);
      }
    }
  });
}

// React Query Custom Mutation Hook for Deleting Projects with explicit cache invalidation
export function useDeleteProjectMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`/api/projects/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (!data.success) {
        throw new Error(data.error || 'Failed to delete project');
      }
      return id;
    },
    onSuccess: (deletedId) => {
      // Explicitly invalidate the 'projects' query key
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      globalSWRMutate('/api/projects');

      if (typeof window !== 'undefined') {
        const current = getLocalStorageCache('swr_cached_projects', []);
        const updatedList = current.filter(p => p.id !== deletedId && p._id !== deletedId);
        setLocalStorageCache('swr_cached_projects', updatedList);
      }
    }
  });
}

// SWR Custom Hook for Projects
export function useProjects(fallbackProjects = null) {
  const initialCache = (Array.isArray(fallbackProjects) && fallbackProjects.length > 0)
    ? fallbackProjects
    : getLocalStorageCache('swr_cached_projects', initialSeedProjects);

  const { data, error, isLoading, isValidating, mutate } = useSWR('/api/projects', fetcher, {
    fallbackData: initialCache,
    revalidateOnFocus: true,
    revalidateIfStale: true,
    revalidateOnMount: true,
    dedupingInterval: 2000,
    keepPreviousData: true,
    onSuccess: (fetchedData) => {
      if (Array.isArray(fetchedData) && fetchedData.length > 0) {
        setLocalStorageCache('swr_cached_projects', fetchedData);
      }
    }
  });

  const projectsList = (Array.isArray(data) && data.length > 0) ? data : initialCache;

  return {
    projects: projectsList,
    isLoading: isLoading && !data,
    isValidating,
    error,
    mutate
  };
}

// SWR Custom Hook for About Section (skills, education, experience, certs)
export function useAbout(fallbackAbout = null) {
  const initialCache = (fallbackAbout && Object.keys(fallbackAbout).length > 0)
    ? fallbackAbout
    : getLocalStorageCache('swr_cached_about', fallbackAbout);

  const { data, error, isLoading, isValidating, mutate } = useSWR('/api/about', fetcher, {
    fallbackData: initialCache,
    revalidateOnFocus: true,
    revalidateIfStale: true,
    revalidateOnMount: true,
    dedupingInterval: 2000,
    keepPreviousData: true,
    onSuccess: (fetchedData) => {
      if (fetchedData && Object.keys(fetchedData).length > 0) {
        setLocalStorageCache('swr_cached_about', fetchedData);
      }
    }
  });

  const aboutData = data || initialCache || fallbackAbout;

  return {
    about: aboutData,
    isLoading: isLoading && !data,
    isValidating,
    error,
    mutate
  };
}

// SWR Custom Hook for Products
export function useProducts(fallbackProducts = null) {
  const initialCache = (Array.isArray(fallbackProducts) && fallbackProducts.length > 0)
    ? fallbackProducts
    : getLocalStorageCache('swr_cached_products', seedProductsList);

  const { data, error, isLoading, isValidating, mutate } = useSWR('/api/products', fetcher, {
    fallbackData: initialCache,
    revalidateOnFocus: true,
    revalidateIfStale: true,
    revalidateOnMount: true,
    dedupingInterval: 2000,
    keepPreviousData: true,
    onSuccess: (fetchedData) => {
      if (Array.isArray(fetchedData) && fetchedData.length > 0) {
        setLocalStorageCache('swr_cached_products', fetchedData);
      }
    }
  });

  const productsList = (Array.isArray(data) && data.length > 0) ? data : initialCache;

  return {
    products: productsList,
    isLoading: isLoading && !data,
    isValidating,
    error,
    mutate
  };
}

// SWR Custom Hook for Reviews
export function useReviews(fallbackReviews = []) {
  const { data, error, isLoading, isValidating, mutate } = useSWR('/api/reviews', fetcher, {
    fallbackData: fallbackReviews,
    revalidateOnFocus: false,
    revalidateIfStale: true,
    revalidateOnMount: true,
    dedupingInterval: 4000,
    keepPreviousData: true
  });

  return {
    reviews: Array.isArray(data) ? data : fallbackReviews,
    isLoading: isLoading && !data,
    isValidating,
    error,
    mutate
  };
}

// SWR Custom Hook for Stats
export function useStats(fallbackStats = { projectsCompleted: '299+', happyClients: '200+', yearsExperience: '6+ Years', positiveReviews: '99.8%' }) {
  const { data, error, isLoading, isValidating, mutate } = useSWR('/api/stats', async (url) => {
    const res = await fetch(url);
    const json = await res.json();
    return json.stats || json;
  }, {
    revalidateOnFocus: false,
    revalidateIfStale: true,
    dedupingInterval: 6000,
    keepPreviousData: true
  });

  let stats = fallbackStats;
  if (data) {
    stats = {
      projectsCompleted: (data.totalProjects && data.totalProjects > 0) ? `${Math.max(299, data.totalProjects * 25)}+` : fallbackStats.projectsCompleted,
      happyClients: (data.totalSales && data.totalSales > 0) ? `${data.totalSales + 200}+` : fallbackStats.happyClients,
      yearsExperience: '6+ Years',
      positiveReviews: '99.8%'
    };
  }

  return {
    stats,
    isLoading: isLoading && !data,
    isValidating,
    error,
    mutate
  };
}
