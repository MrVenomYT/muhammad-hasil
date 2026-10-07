import { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/router';

/**
 * Custom React hook that observes Next.js router.pathname, router.asPath,
 * router.query, and route change events to dynamically maintain and update
 * the active state of sidebar navigation links.
 */
export function useAdminSidebarNavigation(initialTab = 'overview') {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const validTabs = useMemo(() => [
    'overview',
    'projects',
    'products',
    'inquiries',
    'reviews',
    'services',
    'about',
    'profile'
  ], []);

  // Synchronize active tab from router pathname and query params
  const syncActiveTabWithRoute = useCallback(() => {
    let determinedTab = 'overview';

    if (router.isReady) {
      if (router.query?.tab) {
        determinedTab = String(router.query.tab).toLowerCase().trim();
      } else if (router.pathname) {
        const pathLower = router.pathname.toLowerCase();
        if (pathLower.includes('/projects')) determinedTab = 'projects';
        else if (pathLower.includes('/products')) determinedTab = 'products';
        else if (pathLower.includes('/inquiries')) determinedTab = 'inquiries';
        else if (pathLower.includes('/reviews')) determinedTab = 'reviews';
        else if (pathLower.includes('/services')) determinedTab = 'services';
        else if (pathLower.includes('/about')) determinedTab = 'about';
        else if (pathLower.includes('/profile')) determinedTab = 'profile';
        else if (pathLower.includes('/admin/dashboard') || pathLower === '/admin') determinedTab = 'overview';
      }
    } else if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const tabParam = urlParams.get('tab');
      if (tabParam) {
        determinedTab = tabParam.toLowerCase().trim();
      } else {
        const pathLower = window.location.pathname.toLowerCase();
        if (pathLower.includes('/projects')) determinedTab = 'projects';
        else if (pathLower.includes('/products')) determinedTab = 'products';
        else if (pathLower.includes('/inquiries')) determinedTab = 'inquiries';
        else if (pathLower.includes('/reviews')) determinedTab = 'reviews';
        else if (pathLower.includes('/services')) determinedTab = 'services';
        else if (pathLower.includes('/about')) determinedTab = 'about';
        else if (pathLower.includes('/profile')) determinedTab = 'profile';
      }
    }

    if (validTabs.includes(determinedTab)) {
      setActiveTab(prev => (prev !== determinedTab ? determinedTab : prev));
    }
  }, [router.isReady, router.pathname, router.query, router.asPath, validTabs]);

  // Hook observation on router.pathname, query, and lifecycle events
  useEffect(() => {
    syncActiveTabWithRoute();

    if (router.events) {
      const handleRouteChange = () => {
        syncActiveTabWithRoute();
      };

      router.events.on('routeChangeComplete', handleRouteChange);
      router.events.on('hashChangeComplete', handleRouteChange);

      return () => {
        router.events.off('routeChangeComplete', handleRouteChange);
        router.events.off('hashChangeComplete', handleRouteChange);
      };
    }
  }, [router.events, router.pathname, router.asPath, router.query?.tab, router.isReady, syncActiveTabWithRoute]);

  // Navigation transition helper
  const navigateToTab = useCallback((tabId) => {
    if (!validTabs.includes(tabId)) return;
    setActiveTab(tabId);
    setMobileNavOpen(false);
    setSearchQuery('');
    setFilterCategory('all');

    if (router.isReady) {
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, tab: tabId }
        },
        undefined,
        { shallow: true }
      ).catch(() => {});
    }
  }, [router, validTabs]);

  // Active state tester for sidebar items and link elements
  const isNavItemActive = useCallback((itemId, itemHref) => {
    // 1. Direct active state match
    if (activeTab === itemId) return true;

    // 2. Next.js router query param & pathname inspection
    if (router.isReady) {
      const currentQueryTab = router.query?.tab 
        ? String(router.query.tab).toLowerCase().trim() 
        : (router.pathname === '/admin/dashboard' || router.asPath === '/admin/dashboard' ? 'overview' : null);
      if (currentQueryTab === itemId) return true;

      if (itemHref) {
        const cleanAsPath = (router.asPath || '').split('#')[0];
        const cleanHref = (itemHref || '').split('#')[0];
        if (cleanAsPath === cleanHref || router.pathname === cleanHref) return true;

        if (cleanAsPath.includes('?') && cleanHref.includes('?')) {
          const asPathParams = new URLSearchParams(cleanAsPath.split('?')[1]);
          const hrefParams = new URLSearchParams(cleanHref.split('?')[1]);
          if (asPathParams.get('tab') && asPathParams.get('tab') === hrefParams.get('tab')) {
            return true;
          }
        }
      }
    }

    // 3. Fallback to window.location (handles SSR hydration and direct URL navigation)
    if (typeof window !== 'undefined') {
      const windowPath = window.location.pathname;
      const windowSearch = window.location.search;
      const windowFullPath = `${windowPath}${windowSearch}`.split('#')[0];

      if (itemHref) {
        const cleanHref = itemHref.split('#')[0];
        if (windowFullPath === cleanHref || windowPath === cleanHref) return true;

        if (windowSearch) {
          const urlParams = new URLSearchParams(windowSearch);
          const tabParam = urlParams.get('tab');
          if (tabParam && tabParam.toLowerCase().trim() === itemId) return true;
        } else if ((windowPath === '/admin/dashboard' || windowPath === '/admin') && itemId === 'overview') {
          return true;
        }
      }
    }

    return false;
  }, [activeTab, router.isReady, router.query, router.pathname, router.asPath]);

  return {
    activeTab,
    setActiveTab,
    navigateToTab,
    isNavItemActive,
    mobileNavOpen,
    setMobileNavOpen,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory,
    syncActiveTabWithRoute
  };
}
