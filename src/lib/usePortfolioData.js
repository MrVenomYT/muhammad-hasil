import useSWR from 'swr';
import { initialSeedProjects, seedProductsList } from './storage';

// Universal JSON fetcher with error handling
export const fetcher = async (url) => {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to fetch from ${url}: ${res.statusText}`);
  }
  const json = await res.json();
  if (json && json.success !== undefined && !json.success) {
    throw new Error(json.error || 'API returned an error');
  }
  return json.data !== undefined ? json.data : json;
};

// SWR Custom Hook for Projects
export function useProjects() {
  const { data, error, isLoading, isValidating, mutate } = useSWR('/api/projects', fetcher, {
    fallbackData: initialSeedProjects,
    revalidateOnFocus: false,
    revalidateIfStale: true,
    revalidateOnMount: true,
    dedupingInterval: 4000,
    keepPreviousData: true
  });

  return {
    projects: Array.isArray(data) ? data : initialSeedProjects,
    isLoading: isLoading && !data,
    isValidating,
    error,
    mutate
  };
}

// SWR Custom Hook for About Section (skills, education, experience, certs)
export function useAbout(fallbackAbout) {
  const { data, error, isLoading, isValidating, mutate } = useSWR('/api/about', fetcher, {
    fallbackData: fallbackAbout,
    revalidateOnFocus: false,
    revalidateIfStale: true,
    revalidateOnMount: true,
    dedupingInterval: 4000,
    keepPreviousData: true
  });

  return {
    about: data || fallbackAbout,
    isLoading: isLoading && !data,
    isValidating,
    error,
    mutate
  };
}

// SWR Custom Hook for Products
export function useProducts() {
  const { data, error, isLoading, isValidating, mutate } = useSWR('/api/products', fetcher, {
    fallbackData: seedProductsList,
    revalidateOnFocus: false,
    revalidateIfStale: true,
    revalidateOnMount: true,
    dedupingInterval: 4000,
    keepPreviousData: true
  });

  return {
    products: Array.isArray(data) ? data : seedProductsList,
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
