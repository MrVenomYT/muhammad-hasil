import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { useQueryClient } from '@tanstack/react-query';
import { mutate as globalSWRMutate } from 'swr';
import Link from 'next/link';
import AdminProjectMetrics from './AdminProjectMetrics';
import { useAdminSidebarNavigation } from '../hooks/useActiveRoute';
import { 
  saveLocalProject, 
  deleteLocalProject, 
  saveLocalProduct, 
  deleteLocalProduct 
} from '../lib/storage';

export default function AdminDashboardSection() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();

  // Navigation State managed by useAdminSidebarNavigation hook observing router.pathname & query
  const {
    activeTab,
    setActiveTab,
    navigateToTab,
    isNavItemActive,
    mobileNavOpen,
    setMobileNavOpen,
    searchQuery,
    setSearchQuery,
    filterCategory,
    setFilterCategory
  } = useAdminSidebarNavigation('overview');


  // Data States
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalProducts: 0,
    totalInquiries: 0,
    unreadInquiries: 0,
    totalReviews: 0,
    totalServices: 0,
    totalViews: 0,
    totalSales: 0,
    dbStatus: 'connected'
  });
  const [projects, setProjects] = useState([]);
  const [products, setProducts] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [services, setServices] = useState([]);
  const [profile, setProfile] = useState({
    fullName: 'Muhammad Hasil',
    tagline: 'Full Stack Developer & UI/UX Designer',
    bio: '',
    yearsExperience: 4,
    projectsCompleted: 35,
    happyClients: 28,
    hoursCoded: 3400,
    availableForHire: true,
    availabilityText: 'Available for freelance client work & full-stack contract roles',
    socials: {
      github: '',
      linkedin: '',
      fiverr: '',
      patreon: '',
      email: ''
    }
  });

  const [about, setAbout] = useState({
    headline: '',
    subtext: '',
    ctaText: 'Hire me on Fiverr',
    ctaLink: 'https://pro.fiverr.com/users/venomdesigne613/',
    skills: [],
    education: [],
    experience: [],
    certifications: []
  });

  const [loadingData, setLoadingData] = useState(true);
  const [initialHydrated, setInitialHydrated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [toast, setToast] = useState({ show: false, type: 'success', text: '' });

  // Modal & Form States
  const [projectModal, setProjectModal] = useState({ isOpen: false, mode: 'create', data: null });
  const [productModal, setProductModal] = useState({ isOpen: false, mode: 'create', data: null });
  const [reviewModal, setReviewModal] = useState({ isOpen: false, mode: 'create', data: null });
  const [serviceModal, setServiceModal] = useState({ isOpen: false, mode: 'create', data: null });
  const [inquiryModal, setInquiryModal] = useState({ isOpen: false, data: null });
  const [deleteConfirm, setDeleteConfirm] = useState({ isOpen: false, type: '', id: null, title: '' });
  const [experienceModal, setExperienceModal] = useState({ isOpen: false, mode: 'create', index: -1, data: null });
  const [educationModal, setEducationModal] = useState({ isOpen: false, mode: 'create', index: -1, data: null });
  const [certificationModal, setCertificationModal] = useState({ isOpen: false, mode: 'create', index: -1, data: null });

  const [experienceForm, setExperienceForm] = useState({
    role: '',
    company: '',
    period: '2024 - Present',
    description: '',
    projectLink: ''
  });

  const [educationForm, setEducationForm] = useState({
    degree: '',
    institution: '',
    period: '2025 - Present',
    description: '',
    certificationLink: ''
  });

  const [certificationForm, setCertificationForm] = useState({
    title: '',
    issuer: '',
    date: '2025',
    link: ''
  });

  // Forms
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'fullstack react',
    pill: 'Full Stack Web App',
    description: '',
    liveDemoUrl: '',
    githubUrl: '',
    imageUrl: '/assets/thumbnail.png',
    technologies: 'React, Next.js, Node.js',
    featured: true
  });

  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Web Apps',
    price: '$29',
    badge: 'Featured',
    description: '',
    imageUrl: '/assets/thumbnail.png',
    buyUrl: '',
    demoUrl: '',
    features: 'Responsive UI, Clean Code, Documentation',
    salesCount: 0,
    isPublished: true
  });

  const [reviewForm, setReviewForm] = useState({
    authorName: '',
    authorRole: 'Client',
    company: '',
    rating: 5,
    badge: 'Verified Client',
    quote: '',
    verified: true,
    featured: true
  });

  const [serviceForm, setServiceForm] = useState({
    title: '',
    category: 'Engineering',
    icon: 'Layers',
    description: '',
    deliverables: 'Full Source Code, Deployment Setup, 30 Days Support',
    startingPrice: '$500',
    deliveryTime: '5-7 Days',
    active: true
  });

  // Auth Guard
  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/admin/login');
    }
  }, [user, authLoading, router]);

  // Initial Load with Instant Cache Hydration
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem('admin_dashboard_cache_v2');
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed.stats) setStats(parsed.stats);
          if (Array.isArray(parsed.projects) && parsed.projects.length > 0) setProjects(parsed.projects);
          if (Array.isArray(parsed.products) && parsed.products.length > 0) setProducts(parsed.products);
          if (Array.isArray(parsed.inquiries)) setInquiries(parsed.inquiries);
          if (Array.isArray(parsed.reviews) && parsed.reviews.length > 0) setReviews(parsed.reviews);
          if (Array.isArray(parsed.services) && parsed.services.length > 0) setServices(parsed.services);
          if (parsed.profile) setProfile(parsed.profile);
          if (parsed.about) setAbout(parsed.about);
          setInitialHydrated(true);
        }
      } catch (e) {
        console.warn('Cache parse notice:', e);
      }
    }
    fetchAllData();
  }, []);

  const showToast = (text, type = 'success') => {
    setToast({ show: true, type, text });
    setTimeout(() => setToast({ show: false, type: 'success', text: '' }), 4000);
  };

  const fetchAllData = async () => {
    try {
      const [statsRes, projRes, prodRes, inqRes, revRes, srvRes, profRes, aboutRes] = await Promise.all([
        fetch('/api/stats').then(r => r.json()).catch(() => ({})),
        fetch('/api/projects').then(r => r.json()).catch(() => ({})),
        fetch('/api/products').then(r => r.json()).catch(() => ({})),
        fetch('/api/inquiries').then(r => r.json()).catch(() => ({})),
        fetch('/api/reviews').then(r => r.json()).catch(() => ({})),
        fetch('/api/services').then(r => r.json()).catch(() => ({})),
        fetch('/api/profile').then(r => r.json()).catch(() => ({})),
        fetch('/api/about').then(r => r.json()).catch(() => ({}))
      ]);

      if (statsRes && statsRes.success) setStats(statsRes.stats);
      if (projRes && projRes.success && Array.isArray(projRes.data)) setProjects(projRes.data);
      if (prodRes && prodRes.success && Array.isArray(prodRes.data)) setProducts(prodRes.data);
      if (inqRes && inqRes.success && Array.isArray(inqRes.data)) setInquiries(inqRes.data);
      if (revRes && revRes.success && Array.isArray(revRes.data)) setReviews(revRes.data);
      if (srvRes && srvRes.success && Array.isArray(srvRes.data)) setServices(srvRes.data);
      if (profRes && profRes.success && profRes.data) setProfile(profRes.data);
      if (aboutRes && aboutRes.success && aboutRes.data) setAbout(aboutRes.data);

      setInitialHydrated(true);

      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('admin_dashboard_cache_v2', JSON.stringify({
            stats: statsRes?.success ? statsRes.stats : null,
            projects: projRes?.success ? projRes.data : [],
            products: prodRes?.success ? prodRes.data : [],
            inquiries: inqRes?.success ? inqRes.data : [],
            reviews: revRes?.success ? revRes.data : [],
            services: srvRes?.success ? srvRes.data : [],
            profile: profRes?.success ? profRes.data : null,
            about: aboutRes?.success ? aboutRes.data : null
          }));
        } catch (e) {}
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
      showToast('Error syncing with database', 'error');
    } finally {
      setLoadingData(false);
    }
  };

  // -------------------------------------------------------------
  // PROJECT ACTIONS
  // -------------------------------------------------------------
  const openProjectModal = (proj = null) => {
    if (proj) {
      setProjectForm({
        id: proj.id || proj._id,
        title: proj.title || '',
        category: proj.category || 'fullstack react',
        pill: proj.pill || 'Full Stack Web App',
        description: proj.description || '',
        liveDemoUrl: proj.liveDemoUrl || '',
        githubUrl: proj.githubUrl || '',
        imageUrl: proj.imageUrl || '/assets/thumbnail.png',
        technologies: Array.isArray(proj.technologies) ? proj.technologies.join(', ') : (proj.technologies || ''),
        featured: proj.featured !== false
      });
      setProjectModal({ isOpen: true, mode: 'edit', data: proj });
    } else {
      setProjectForm({
        title: '',
        category: 'fullstack react',
        pill: 'Full Stack Web App',
        description: '',
        liveDemoUrl: '',
        githubUrl: '',
        imageUrl: '/assets/thumbnail.png',
        technologies: 'React, Next.js, Node.js',
        featured: true
      });
      setProjectModal({ isOpen: true, mode: 'create', data: null });
    }
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) {
      showToast('Title and description are required', 'error');
      return;
    }

    setIsSubmitting(true);
    const techArray = typeof projectForm.technologies === 'string'
      ? projectForm.technologies.split(',').map(t => t.trim()).filter(Boolean)
      : projectForm.technologies;

    const payload = {
      ...projectForm,
      technologies: techArray
    };

    try {
      const isEdit = projectModal.mode === 'edit';
      const url = isEdit ? `/api/projects/${projectForm.id}` : '/api/projects';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({ success: false, error: 'Invalid response from server' }));

      if (res.ok && data.success && data.data) {
        const savedItem = data.data;
        saveLocalProject(savedItem);
        if (isEdit) {
          setProjects(prev => prev.map(p => (p.id === savedItem.id || p._id === savedItem._id || (projectForm.id && (p.id === projectForm.id || p._id === projectForm.id))) ? savedItem : p));
        } else {
          setProjects(prev => [savedItem, ...prev.filter(p => p.id !== savedItem.id && (p.title || '').toLowerCase() !== (savedItem.title || '').toLowerCase())]);
          setStats(prev => ({ ...prev, totalProjects: prev.totalProjects + 1 }));
        }
        queryClient.invalidateQueries({ queryKey: ['projects'] });
        await globalSWRMutate('/api/projects');
        showToast(isEdit ? 'Project updated successfully!' : 'New project created successfully!');
        setProjectModal({ isOpen: false, mode: 'create', data: null });
        await fetchAllData();
      } else {
        const errorMsg = data.error || `Failed to save project (HTTP ${res.status})`;
        showToast(errorMsg, 'error');
      }
    } catch (err) {
      showToast(err.message || 'Network error while saving project', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // PRODUCT ACTIONS
  // -------------------------------------------------------------
  const openProductModal = (prod = null) => {
    if (prod) {
      setProductForm({
        id: prod.id || prod._id,
        title: prod.title || '',
        category: prod.category || 'Web Apps',
        price: prod.price || '$29',
        badge: prod.badge || 'Featured',
        description: prod.description || '',
        imageUrl: prod.imageUrl || '/assets/thumbnail.png',
        buyUrl: prod.buyUrl || '',
        demoUrl: prod.demoUrl || '',
        features: Array.isArray(prod.features) ? prod.features.join(', ') : (prod.features || ''),
        salesCount: prod.salesCount || 0,
        isPublished: prod.isPublished !== false
      });
      setProductModal({ isOpen: true, mode: 'edit', data: prod });
    } else {
      setProductForm({
        title: '',
        category: 'Web Apps',
        price: '$29',
        badge: 'Featured',
        description: '',
        imageUrl: '/assets/thumbnail.png',
        buyUrl: 'https://pro.fiverr.com/users/venomdesigne613/',
        demoUrl: '',
        features: 'Responsive UI, Clean Code, Documentation',
        salesCount: 0,
        isPublished: true
      });
      setProductModal({ isOpen: true, mode: 'create', data: null });
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.title || !productForm.description) {
      showToast('Title and description are required', 'error');
      return;
    }

    setIsSubmitting(true);
    const featuresArray = typeof productForm.features === 'string'
      ? productForm.features.split(',').map(f => f.trim()).filter(Boolean)
      : productForm.features;

    const payload = {
      ...productForm,
      features: featuresArray
    };

    try {
      const isEdit = productModal.mode === 'edit';
      const url = isEdit ? `/api/products/${productForm.id}` : '/api/products';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({ success: false, error: 'Invalid response from server' }));

      if (res.ok && data.success && data.data) {
        const savedItem = data.data;
        saveLocalProduct(savedItem);
        if (isEdit) {
          setProducts(prev => prev.map(p => (p.id === savedItem.id || p._id === savedItem._id || (productForm.id && (p.id === productForm.id || p._id === productForm.id))) ? savedItem : p));
        } else {
          setProducts(prev => [savedItem, ...prev.filter(p => p.id !== savedItem.id && (p.title || '').toLowerCase() !== (savedItem.title || '').toLowerCase())]);
          setStats(prev => ({ ...prev, totalProducts: prev.totalProducts + 1 }));
        }
        queryClient.invalidateQueries({ queryKey: ['products'] });
        await globalSWRMutate('/api/products');
        showToast(isEdit ? 'Product updated permanently in database!' : 'New digital product created in database!');
        setProductModal({ isOpen: false, mode: 'create', data: null });
        await fetchAllData();
      } else {
        showToast(data.error || `Failed to save product (HTTP ${res.status})`, 'error');
      }
    } catch (err) {
      showToast(err.message || 'Network error while saving product', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // REVIEWS & TESTIMONIALS
  // -------------------------------------------------------------
  const openReviewModal = (rev = null) => {
    if (rev) {
      setReviewForm({
        id: rev.id || rev._id,
        authorName: rev.authorName || '',
        authorRole: rev.authorRole || 'Client',
        company: rev.company || '',
        rating: rev.rating || 5,
        badge: rev.badge || 'Verified Client',
        quote: rev.quote || '',
        verified: rev.verified !== false,
        featured: rev.featured !== false
      });
      setReviewModal({ isOpen: true, mode: 'edit', data: rev });
    } else {
      setReviewForm({
        authorName: '',
        authorRole: 'Client',
        company: '',
        rating: 5,
        badge: 'Verified Client',
        quote: '',
        verified: true,
        featured: true
      });
      setReviewModal({ isOpen: true, mode: 'create', data: null });
    }
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!reviewForm.authorName || !reviewForm.quote) {
      showToast('Author name and quote are required', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const isEdit = reviewModal.mode === 'edit';
      const url = isEdit ? `/api/reviews/${reviewForm.id}` : '/api/reviews';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reviewForm)
      });
      const data = await res.json().catch(() => ({ success: false, error: 'Invalid response from server' }));

      if (res.ok && data.success && data.data) {
        const savedItem = data.data;
        if (isEdit) {
          setReviews(prev => prev.map(r => (r.id === savedItem.id || r._id === savedItem._id || (reviewForm.id && (r.id === reviewForm.id || r._id === reviewForm.id))) ? savedItem : r));
        } else {
          setReviews(prev => [savedItem, ...prev.filter(r => r.id !== savedItem.id)]);
          setStats(prev => ({ ...prev, totalReviews: prev.totalReviews + 1 }));
        }
        queryClient.invalidateQueries({ queryKey: ['reviews'] });
        await globalSWRMutate('/api/reviews');
        showToast(isEdit ? 'Review updated in database!' : 'New review added to database!');
        setReviewModal({ isOpen: false, mode: 'create', data: null });
        await fetchAllData();
      } else {
        showToast(data.error || 'Failed to save review', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Network error while saving review', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // SERVICES ACTIONS
  // -------------------------------------------------------------
  const openServiceModal = (srv = null) => {
    if (srv) {
      setServiceForm({
        id: srv.id || srv._id,
        title: srv.title || '',
        category: srv.category || 'Engineering',
        icon: srv.icon || 'Layers',
        description: srv.description || '',
        deliverables: Array.isArray(srv.deliverables) ? srv.deliverables.join(', ') : (srv.deliverables || ''),
        startingPrice: srv.startingPrice || '$500',
        deliveryTime: srv.deliveryTime || '5-7 Days',
        active: srv.active !== false
      });
      setServiceModal({ isOpen: true, mode: 'edit', data: srv });
    } else {
      setServiceForm({
        title: '',
        category: 'Engineering',
        icon: 'Layers',
        description: '',
        deliverables: 'Full Source Code, Deployment Setup, 30 Days Support',
        startingPrice: '$500',
        deliveryTime: '5-7 Days',
        active: true
      });
      setServiceModal({ isOpen: true, mode: 'create', data: null });
    }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    if (!serviceForm.title || !serviceForm.description) {
      showToast('Title and description are required', 'error');
      return;
    }

    setIsSubmitting(true);
    const deliverablesArray = typeof serviceForm.deliverables === 'string'
      ? serviceForm.deliverables.split(',').map(d => d.trim()).filter(Boolean)
      : serviceForm.deliverables;

    const payload = {
      ...serviceForm,
      deliverables: deliverablesArray
    };

    try {
      const isEdit = serviceModal.mode === 'edit';
      const url = isEdit ? `/api/services/${serviceForm.id}` : '/api/services';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({ success: false, error: 'Invalid response from server' }));

      if (res.ok && data.success && data.data) {
        const savedItem = data.data;
        if (isEdit) {
          setServices(prev => prev.map(s => (s.id === savedItem.id || s._id === savedItem._id || (serviceForm.id && (s.id === serviceForm.id || s._id === serviceForm.id))) ? savedItem : s));
        } else {
          setServices(prev => [savedItem, ...prev.filter(s => s.id !== savedItem.id)]);
          setStats(prev => ({ ...prev, totalServices: prev.totalServices + 1 }));
        }
        queryClient.invalidateQueries({ queryKey: ['services'] });
        await globalSWRMutate('/api/services');
        showToast(isEdit ? 'Service updated in database!' : 'New service created in database!');
        setServiceModal({ isOpen: false, mode: 'create', data: null });
        await fetchAllData();
      } else {
        showToast(data.error || 'Failed to save service', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Network error while saving service', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // INQUIRIES ACTIONS
  // -------------------------------------------------------------
  const toggleInquiryStatus = async (inq, newStatus) => {
    try {
      const res = await fetch(`/api/inquiries/${inq.id || inq._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inq, status: newStatus })
      });
      if (res.ok) {
        showToast(`Inquiry marked as ${newStatus}`);
        await fetchAllData();
      }
    } catch (err) {
      showToast('Failed to update status', 'error');
    }
  };

  const toggleInquiryStarred = async (inq) => {
    try {
      const res = await fetch(`/api/inquiries/${inq.id || inq._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inq, starred: !inq.starred })
      });
      if (res.ok) {
        await fetchAllData();
      }
    } catch (err) {
      showToast('Failed to star inquiry', 'error');
    }
  };

  // -------------------------------------------------------------
  // PROFILE & AVAILABILITY UPDATE
  // -------------------------------------------------------------
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile)
      });
      const data = await res.json().catch(() => ({ success: false, error: 'Invalid response from server' }));
      if (res.ok && data.success) {
        showToast('Profile and live metrics saved permanently in database!');
        await fetchAllData();
      } else {
        showToast(data.error || 'Failed to save profile', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Network error while saving profile', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------------------------------------
  // ABOUT SECTION & CREDENTIALS ACTIONS (PERMANENT STORAGE)
  // -------------------------------------------------------------
  const handleSaveAbout = async (updatedAbout) => {
    setIsSubmitting(true);
    const dataToSave = updatedAbout || about;
    try {
      const res = await fetch('/api/about', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSave)
      });
      const data = await res.json().catch(() => ({ success: false, error: 'Invalid response from server' }));
      if (res.ok && data.success) {
        setAbout(data.data);
        await globalSWRMutate('/api/about');
        showToast('About section, experience, & education saved permanently!');
        await fetchAllData();
      } else {
        showToast(data.error || 'Failed to save about section', 'error');
      }
    } catch (err) {
      showToast(err.message || 'Network error while saving about section', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Experience Handlers
  const openExperienceModal = (mode = 'create', index = -1, item = null) => {
    if (mode === 'edit' && item) {
      setExperienceForm({
        role: item.role || '',
        company: item.company || '',
        period: item.period || '',
        description: item.description || '',
        projectLink: item.projectLink || ''
      });
      setExperienceModal({ isOpen: true, mode: 'edit', index, data: item });
    } else {
      setExperienceForm({
        role: '',
        company: '',
        period: '2024 - Present',
        description: '',
        projectLink: ''
      });
      setExperienceModal({ isOpen: true, mode: 'create', index: -1, data: null });
    }
  };

  const handleSaveExperience = async (e) => {
    e.preventDefault();
    const updatedList = [...(about.experience || [])];
    if (experienceModal.mode === 'edit' && experienceModal.index >= 0) {
      updatedList[experienceModal.index] = { ...updatedList[experienceModal.index], ...experienceForm };
    } else {
      updatedList.unshift({ id: 'exp-' + Date.now(), ...experienceForm });
    }
    const updatedAbout = { ...about, experience: updatedList };
    setAbout(updatedAbout);
    setExperienceModal({ isOpen: false, mode: 'create', index: -1, data: null });
    await handleSaveAbout(updatedAbout);
  };

  const handleDeleteExperience = async (index) => {
    const updatedList = (about.experience || []).filter((_, idx) => idx !== index);
    const updatedAbout = { ...about, experience: updatedList };
    setAbout(updatedAbout);
    await handleSaveAbout(updatedAbout);
  };

  // Education Handlers
  const openEducationModal = (mode = 'create', index = -1, item = null) => {
    if (mode === 'edit' && item) {
      setEducationForm({
        degree: item.degree || '',
        institution: item.institution || '',
        period: item.period || '',
        description: item.description || '',
        certificationLink: item.certificationLink || ''
      });
      setEducationModal({ isOpen: true, mode: 'edit', index, data: item });
    } else {
      setEducationForm({
        degree: '',
        institution: '',
        period: '2025 - Present',
        description: '',
        certificationLink: ''
      });
      setEducationModal({ isOpen: true, mode: 'create', index: -1, data: null });
    }
  };

  const handleSaveEducation = async (e) => {
    e.preventDefault();
    const updatedList = [...(about.education || [])];
    if (educationModal.mode === 'edit' && educationModal.index >= 0) {
      updatedList[educationModal.index] = { ...updatedList[educationModal.index], ...educationForm };
    } else {
      updatedList.unshift({ id: 'edu-' + Date.now(), ...educationForm });
    }
    const updatedAbout = { ...about, education: updatedList };
    setAbout(updatedAbout);
    setEducationModal({ isOpen: false, mode: 'create', index: -1, data: null });
    await handleSaveAbout(updatedAbout);
  };

  const handleDeleteEducation = async (index) => {
    const updatedList = (about.education || []).filter((_, idx) => idx !== index);
    const updatedAbout = { ...about, education: updatedList };
    setAbout(updatedAbout);
    await handleSaveAbout(updatedAbout);
  };

  // Certification Handlers
  const openCertificationModal = (mode = 'create', index = -1, item = null) => {
    if (mode === 'edit' && item) {
      setCertificationForm({
        title: item.title || '',
        issuer: item.issuer || '',
        date: item.date || '',
        link: item.link || ''
      });
      setCertificationModal({ isOpen: true, mode: 'edit', index, data: item });
    } else {
      setCertificationForm({
        title: '',
        issuer: '',
        date: '2025',
        link: ''
      });
      setCertificationModal({ isOpen: true, mode: 'create', index: -1, data: null });
    }
  };

  const handleSaveCertification = async (e) => {
    e.preventDefault();
    const updatedList = [...(about.certifications || [])];
    if (certificationModal.mode === 'edit' && certificationModal.index >= 0) {
      updatedList[certificationModal.index] = { ...updatedList[certificationModal.index], ...certificationForm };
    } else {
      updatedList.unshift({ id: 'cert-' + Date.now(), ...certificationForm });
    }
    const updatedAbout = { ...about, certifications: updatedList };
    setAbout(updatedAbout);
    setCertificationModal({ isOpen: false, mode: 'create', index: -1, data: null });
    await handleSaveAbout(updatedAbout);
  };

  const handleDeleteCertification = async (index) => {
    const updatedList = (about.certifications || []).filter((_, idx) => idx !== index);
    const updatedAbout = { ...about, certifications: updatedList };
    setAbout(updatedAbout);
    await handleSaveAbout(updatedAbout);
  };

  // -------------------------------------------------------------
  // MANUAL DELETE EXECUTION (PROTECTED BY CONFIRMATION MODAL)
  // -------------------------------------------------------------
  const triggerDeleteConfirm = (type, item) => {
    setDeleteConfirm({
      isOpen: true,
      type,
      id: item.id || item._id,
      title: item.title || item.name || item.authorName || 'this item'
    });
  };

  const executeDelete = async () => {
    const { type, id } = deleteConfirm;
    if (!id || !type) return;

    setIsSubmitting(true);
    let endpoint = '';
    if (type === 'project') endpoint = `/api/projects/${id}`;
    else if (type === 'product') endpoint = `/api/products/${id}`;
    else if (type === 'inquiry') endpoint = `/api/inquiries/${id}`;
    else if (type === 'review') endpoint = `/api/reviews/${id}`;
    else if (type === 'service') endpoint = `/api/services/${id}`;

    // Optimistic UI state update
    if (type === 'project') {
      setProjects(prev => prev.filter(p => p.id !== id && p._id !== id));
      setStats(prev => ({ ...prev, totalProjects: Math.max(0, prev.totalProjects - 1) }));
    } else if (type === 'product') {
      setProducts(prev => prev.filter(p => p.id !== id && p._id !== id));
      setStats(prev => ({ ...prev, totalProducts: Math.max(0, prev.totalProducts - 1) }));
    } else if (type === 'inquiry') {
      setInquiries(prev => prev.filter(i => i.id !== id && i._id !== id));
      setStats(prev => ({ ...prev, totalInquiries: Math.max(0, prev.totalInquiries - 1) }));
    } else if (type === 'review') {
      setReviews(prev => prev.filter(r => r.id !== id && r._id !== id));
      setStats(prev => ({ ...prev, totalReviews: Math.max(0, prev.totalReviews - 1) }));
    } else if (type === 'service') {
      setServices(prev => prev.filter(s => s.id !== id && s._id !== id));
      setStats(prev => ({ ...prev, totalServices: Math.max(0, prev.totalServices - 1) }));
    }

    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json().catch(() => ({ success: false, error: 'Invalid response from server' }));

      if (res.ok && data.success) {
        if (type === 'project') {
          deleteLocalProject(id, deleteConfirm.title);
          queryClient.invalidateQueries({ queryKey: ['projects'] });
          await globalSWRMutate('/api/projects');
        } else if (type === 'product') {
          deleteLocalProduct(id, deleteConfirm.title);
          queryClient.invalidateQueries({ queryKey: ['products'] });
          await globalSWRMutate('/api/products');
        } else if (type === 'review') {
          queryClient.invalidateQueries({ queryKey: ['reviews'] });
          await globalSWRMutate('/api/reviews');
        } else if (type === 'service') {
          queryClient.invalidateQueries({ queryKey: ['services'] });
          await globalSWRMutate('/api/services');
        } else if (type === 'inquiry') {
          queryClient.invalidateQueries({ queryKey: ['inquiries'] });
          await globalSWRMutate('/api/inquiries');
        }

        showToast(data.message || `Item permanently deleted from database and storage.`);
        setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' });
        await fetchAllData();
      } else {
        const errorMsg = data.error || `Failed to delete item (HTTP ${res.status})`;
        showToast(errorMsg, 'error');
        await fetchAllData(); // Refresh to restore real state
      }
    } catch (err) {
      showToast(err.message || 'Network error while deleting item', 'error');
      await fetchAllData();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filtering helpers
  const filteredProjects = projects.filter(p => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'all' || (p.category || '').includes(filterCategory);
    return matchesSearch && matchesCat;
  });

  const filteredProducts = products.filter(p => {
    const matchesSearch = (p.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'all' || (p.category || '').toLowerCase() === filterCategory.toLowerCase();
    return matchesSearch && matchesCat;
  });

  const filteredInquiries = inquiries.filter(i => {
    const matchesSearch = (i.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (i.email || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (i.message || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = filterCategory === 'all' || i.status === filterCategory;
    return matchesSearch && matchesCat;
  });

  if (authLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '16px', backgroundColor: 'transparent' }}>
        <div style={{ width: '38px', height: '38px', border: '3px solid rgba(255, 119, 0, 0.2)', borderTopColor: '#ff7700', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
        <span style={{ color: '#94a3b8', fontSize: '14px', fontWeight: 600 }}>Loading Dashboard...</span>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#0e0c0b', color: '#f3f4f6', fontFamily: 'var(--font-sans, "Plus Jakarta Sans", sans-serif)' }}>
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          padding: '12px 20px',
          borderRadius: '8px',
          backgroundColor: toast.type === 'error' ? '#ef4444' : '#10b981',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: '14px',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          animation: 'fadeIn 0.2s ease-out'
        }}>
          <span>{toast.type === 'error' ? '⚠' : '✓'}</span>
          <span>{toast.text}</span>
        </div>
      )}

      {/* Top Header Bar */}
      <header style={{
        height: '64px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        backgroundColor: 'rgba(14, 12, 11, 0.9)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            className="md:hidden"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#ffffff',
              borderRadius: '6px',
              padding: '6px 10px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
            aria-label="Toggle navigation menu"
          >
            {mobileNavOpen ? '✕' : '☰'}
          </button>

          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
            <img src="/assets/muhammad-hasil.png" alt="iHasil" style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid #ff7700' }} />
            <span style={{ fontWeight: 800, fontSize: '18px', color: '#ffffff', letterSpacing: '-0.5px' }}>iHasil Admin</span>
          </Link>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Link href="/" style={{ fontSize: '12px', color: '#94a3b8', textDecoration: 'none', padding: '6px 10px', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
            ↗ Public Site
          </Link>
          <div style={{ fontSize: '13px', color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(255, 119, 0, 0.2)', color: '#ff7700', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px' }}>
              {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
            </span>
            <span className="hidden sm:inline" style={{ maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || 'Admin'}</span>
          </div>
          <button
            onClick={() => logout()}
            style={{
              fontSize: '12px',
              color: '#f87171',
              backgroundColor: 'transparent',
              border: '1px solid rgba(248, 113, 113, 0.2)',
              padding: '6px 12px',
              borderRadius: '6px',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        </div>
      </header>

      {/* Mobile Horizontal Quick Navigation Bar */}
      <div className="flex md:hidden overflow-x-auto gap-2 p-2 border-b border-white/10 bg-[#0e0c0b] sticky top-[64px] z-50">
        {[
          { id: 'overview', label: '📊 Overview', href: '/admin/dashboard?tab=overview' },
          { id: 'projects', label: `🚀 Projects (${projects.length})`, href: '/admin/dashboard?tab=projects' },
          { id: 'products', label: `🛍 Store (${products.length})`, href: '/admin/dashboard?tab=products' },
          { id: 'inquiries', label: `📬 Inquiries (${inquiries.length})`, unread: stats.unreadInquiries, href: '/admin/dashboard?tab=inquiries' },
          { id: 'reviews', label: `⭐ Reviews (${reviews.length})`, href: '/admin/dashboard?tab=reviews' },
          { id: 'services', label: `🛠 Services (${services.length})`, href: '/admin/dashboard?tab=services' },
          { id: 'about', label: '📖 About', href: '/admin/dashboard?tab=about' },
          { id: 'profile', label: '⚙ Profile', href: '/admin/dashboard?tab=profile' }
        ].map(item => {
          const isActive = isNavItemActive(item.id, item.href);
          return (
            <button
              key={item.id}
              onClick={() => navigateToTab(item.id)}
              role="tab"
              aria-selected={isActive}
              aria-current={isActive ? 'page' : undefined}
              style={{
                whiteSpace: 'nowrap',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 600,
                border: isActive ? '1px solid #ff7700' : '1px solid rgba(255, 255, 255, 0.08)',
                cursor: 'pointer',
                backgroundColor: isActive ? 'rgba(255, 119, 0, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                color: isActive ? '#ff8811' : '#94a3b8',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease'
              }}
            >
              <span>{item.label}</span>
              {item.unread > 0 && (
                <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '10px', backgroundColor: '#ef4444', color: '#fff', fontWeight: 800 }}>
                  {item.unread}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Main Container: Sidebar + Content */}
      <div style={{ display: 'flex', minHeight: 'calc(100vh - 64px)', position: 'relative' }}>
        {/* Navigation Sidebar (Desktop + Mobile Drawer) */}
        <aside
          className={`${mobileNavOpen ? 'block' : 'hidden'} md:flex`}
          style={{
            width: '260px',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            backgroundColor: 'rgba(16, 14, 12, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '24px 14px',
            flexDirection: 'column',
            gap: '4px',
            flexShrink: 0,
            position: mobileNavOpen ? 'fixed' : 'relative',
            top: mobileNavOpen ? '64px' : 'auto',
            left: 0,
            bottom: 0,
            zIndex: 90,
            overflowY: 'auto'
          }}
        >
          {/* Group 1: Management */}
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px', paddingLeft: '12px' }}>
            Management
          </div>

          {[
            { id: 'overview', label: 'Overview & Stats', icon: '📊', href: '/admin/dashboard?tab=overview' },
            { id: 'projects', label: 'Projects', icon: '🚀', count: projects.length, href: '/admin/dashboard?tab=projects' },
            { id: 'products', label: 'Digital Store', icon: '🛍', count: products.length, href: '/admin/dashboard?tab=products' },
            { id: 'inquiries', label: 'Inbound Inquiries', icon: '📬', count: inquiries.length, unread: stats.unreadInquiries, href: '/admin/dashboard?tab=inquiries' },
            { id: 'reviews', label: 'Testimonials', icon: '⭐', count: reviews.length, href: '/admin/dashboard?tab=reviews' },
            { id: 'services', label: 'Services Offered', icon: '🛠', count: services.length, href: '/admin/dashboard?tab=services' },
          ].map(item => {
            const isActive = isNavItemActive(item.id, item.href);
            return (
              <button
                key={item.id}
                onClick={() => navigateToTab(item.id)}
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 600,
                  border: 'none',
                  borderLeft: isActive ? '3px solid #ff7700' : '3px solid transparent',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'rgba(255, 119, 0, 0.16)' : 'transparent',
                  color: isActive ? '#ff8811' : '#94a3b8',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  {item.unread > 0 && (
                    <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '12px', backgroundColor: '#ef4444', color: '#fff', fontWeight: 700 }}>
                      {item.unread} new
                    </span>
                  )}
                  {item.count !== undefined && !item.unread && (
                    <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '10px', backgroundColor: isActive ? 'rgba(255, 119, 0, 0.25)' : 'rgba(255, 255, 255, 0.06)', color: isActive ? '#ff7700' : '#64748b', fontWeight: 600 }}>
                      {item.count}
                    </span>
                  )}
                </div>
              </button>
            );
          })}

          {/* Group 2: Site Settings */}
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '1px', textTransform: 'uppercase', marginTop: '20px', marginBottom: '8px', paddingLeft: '12px' }}>
            Site Settings
          </div>

          {[
            { id: 'about', label: 'About Us', icon: '📖', href: '/admin/dashboard?tab=about' },
            { id: 'profile', label: 'Profile & Availability', icon: '⚙', href: '/admin/dashboard?tab=profile' },
          ].map(item => {
            const isActive = isNavItemActive(item.id, item.href);
            return (
              <button
                key={item.id}
                onClick={() => navigateToTab(item.id)}
                role="tab"
                aria-selected={isActive}
                aria-current={isActive ? 'page' : undefined}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: isActive ? 700 : 600,
                  border: 'none',
                  borderLeft: isActive ? '3px solid #ff7700' : '3px solid transparent',
                  cursor: 'pointer',
                  backgroundColor: isActive ? 'rgba(255, 119, 0, 0.16)' : 'transparent',
                  color: isActive ? '#ff8811' : '#94a3b8',
                  textAlign: 'left',
                  transition: 'all 0.15s ease'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </span>
              </button>
            );
          })}
        </aside>


        {/* Content Area */}
        <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
                <div>
                  <h1 style={{ fontSize: '26px', fontWeight: 800, color: '#ffffff', margin: 0, letterSpacing: '-0.5px' }}>
                    Dashboard Overview
                  </h1>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '6px 0 0 0' }}>
                    Real-time MongoDB data metrics, store products, and client project inquiries.
                  </p>
                </div>
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => openProjectModal()}
                    style={{
                      backgroundColor: '#ff7700',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    + New Project
                  </button>
                  <button
                    onClick={() => openProductModal()}
                    style={{
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: '#ffffff',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      padding: '10px 18px',
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer'
                    }}
                  >
                    + Add Product
                  </button>
                </div>
              </div>

              {/* Metric Cards Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '36px' }}>
                <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>Total Portfolio Projects</div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>
                    {projects.length}
                  </div>
                  <div style={{ fontSize: '12px', color: '#10b981', marginTop: '6px' }}>✓ Live on website</div>
                </div>

                <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>Digital Store Products</div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>
                    {products.length}
                  </div>
                  <div style={{ fontSize: '12px', color: '#ff7700', marginTop: '6px' }}>{stats.totalSales} total downloads/sales</div>
                </div>

                <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>Client Inquiries</div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>
                    {inquiries.length}
                  </div>
                  <div style={{ fontSize: '12px', color: stats.unreadInquiries > 0 ? '#ef4444' : '#10b981', marginTop: '6px' }}>
                    {stats.unreadInquiries} pending unread
                  </div>
                </div>

                <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '20px' }}>
                  <div style={{ fontSize: '13px', color: '#94a3b8', marginBottom: '8px' }}>Client Reviews</div>
                  <div style={{ fontSize: '32px', fontWeight: 800, color: '#ffffff', fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>
                    {reviews.length}
                  </div>
                  <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '6px' }}>★★★★★ 5.0 Average Rating</div>
                </div>
              </div>

              {/* Quick Split: Recent Inquiries + Recent Projects */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '24px' }}>
                {/* Recent Inbound Leads */}
                <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: 0 }}>Recent Client Inquiries</h3>
                    <button onClick={() => navigateToTab('inquiries')} style={{ fontSize: '12px', color: '#ff7700', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
                      View all →
                    </button>
                  </div>

                  {inquiries.length === 0 ? (
                    <div style={{ padding: '30px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>
                      No inquiries yet. Submissions from the contact form will appear here in real time.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {inquiries.slice(0, 3).map((inq) => (
                        <div
                          key={inq.id || inq._id}
                          onClick={() => setInquiryModal({ isOpen: true, data: inq })}
                          style={{
                            padding: '14px',
                            backgroundColor: 'rgba(255, 255, 255, 0.03)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255, 255, 255, 0.05)',
                            cursor: 'pointer'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontWeight: 700, fontSize: '14px', color: '#ffffff' }}>{inq.name}</span>
                            <span style={{ fontSize: '11px', color: inq.status === 'new' ? '#ef4444' : '#94a3b8', textTransform: 'uppercase', fontWeight: 700 }}>
                              {inq.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#ff7700', marginBottom: '4px' }}>{inq.subject || 'Project Inquiry'}</div>
                          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {inq.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Live Availability Status */}
                <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff', margin: '0 0 16px 0' }}>Client Availability Status</h3>
                  <div style={{ padding: '16px', backgroundColor: profile.availableForHire ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${profile.availableForHire ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`, borderRadius: '8px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '14px', color: profile.availableForHire ? '#10b981' : '#ef4444' }}>
                      <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: profile.availableForHire ? '#10b981' : '#ef4444' }}></span>
                      {profile.availableForHire ? 'AVAILABLE FOR CLIENT WORK' : 'CURRENTLY BOOKED'}
                    </div>
                    <div style={{ fontSize: '13px', color: '#cbd5e1', marginTop: '6px' }}>{profile.availabilityText}</div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                      <span style={{ color: '#94a3b8' }}>Years Experience:</span>
                      <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{profile.yearsExperience} Years</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                      <span style={{ color: '#94a3b8' }}>Completed Projects:</span>
                      <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{profile.projectsCompleted}+</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.06)', paddingBottom: '8px' }}>
                      <span style={{ color: '#94a3b8' }}>Happy Clients:</span>
                      <strong style={{ color: '#fff', fontFamily: 'monospace' }}>{profile.happyClients}+</strong>
                    </div>
                  </div>

                  <button
                    onClick={() => navigateToTab('profile')}
                    style={{
                      marginTop: '20px',
                      width: '100%',
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#ffffff',
                      padding: '10px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Edit Profile & Metrics Settings
                  </button>
                </div>
              </div>

              {/* Project Metrics & Click-Through Rates Dashboard (Recharts) */}
              <AdminProjectMetrics projects={projects} />
            </div>
          )}

          {/* TAB 2: PROJECTS */}
          {activeTab === 'projects' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: 0 }}>Projects Manager</h1>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                    Manage portfolio showcase projects stored permanently in MongoDB.
                  </p>
                </div>
                <button
                  onClick={() => openProjectModal()}
                  style={{
                    backgroundColor: '#ff7700',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  + Add Project
                </button>
              </div>

              {/* Filters & Search */}
              <div style={{ display: 'flex', gap: '14px', marginBottom: '20px' }}>
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    backgroundColor: '#131110',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    color: '#fff',
                    fontSize: '14px'
                  }}
                />
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  style={{
                    backgroundColor: '#131110',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '8px',
                    padding: '10px 16px',
                    color: '#fff',
                    fontSize: '14px',
                    cursor: 'pointer'
                  }}
                >
                  <option value="all">All Categories</option>
                  <option value="fullstack">Full-Stack</option>
                  <option value="react">React / Next.js</option>
                  <option value="design">Design & UI</option>
                </select>
              </div>

              {/* Data Table */}
              <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                      <th style={{ padding: '14px 20px', fontWeight: 600 }}>Project</th>
                      <th style={{ padding: '14px 20px', fontWeight: 600 }}>Category</th>
                      <th style={{ padding: '14px 20px', fontWeight: 600 }}>Pill / Tag</th>
                      <th style={{ padding: '14px 20px', fontWeight: 600 }}>Live Link</th>
                      <th style={{ padding: '14px 20px', fontWeight: 600, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProjects.map((p) => (
                      <tr key={p.id || p._id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                        <td style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <img
                            src={p.imageUrl || '/assets/thumbnail.png'}
                            alt={p.title}
                            style={{ width: '42px', height: '32px', objectFit: 'cover', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.1)' }}
                          />
                          <div>
                            <strong style={{ color: '#ffffff', display: 'block', fontSize: '14px' }}>{p.title}</strong>
                            <span style={{ color: '#64748b', fontSize: '12px' }}>{Array.isArray(p.technologies) ? p.technologies.slice(0, 3).join(', ') : p.technologies}</span>
                          </div>
                        </td>
                        <td style={{ padding: '14px 20px', color: '#cbd5e1' }}>{p.category}</td>
                        <td style={{ padding: '14px 20px', color: '#ff7700' }}>{p.pill}</td>
                        <td style={{ padding: '14px 20px' }}>
                          {p.liveDemoUrl && p.liveDemoUrl !== '#' ? (
                            <a href={p.liveDemoUrl} target="_blank" rel="noreferrer" style={{ color: '#38bdf8', textDecoration: 'none' }}>
                              Demo ↗
                            </a>
                          ) : (
                            <span style={{ color: '#64748b' }}>None</span>
                          )}
                        </td>
                        <td style={{ padding: '14px 20px', textAlign: 'right' }}>
                          <button
                            onClick={() => openProjectModal(p)}
                            style={{
                              backgroundColor: 'transparent',
                              border: '1px solid rgba(255, 255, 255, 0.15)',
                              color: '#ffffff',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              marginRight: '8px',
                              fontSize: '12px'
                            }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => triggerDeleteConfirm('project', p)}
                            style={{
                              backgroundColor: 'transparent',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#ef4444',
                              padding: '6px 12px',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px'
                            }}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: PRODUCTS */}
          {activeTab === 'products' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: 0 }}>Digital Store Products</h1>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                    Manage software templates, UI kits, and booking components for sale.
                  </p>
                </div>
                <button
                  onClick={() => openProductModal()}
                  style={{
                    backgroundColor: '#ff7700',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  + Add Digital Product
                </button>
              </div>

              {/* Products Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {filteredProducts.map((p) => (
                  <div key={p.id || p._id} style={{ backgroundColor: '#131110', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ fontSize: '11px', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                          {p.badge || 'Featured'}
                        </span>
                        <span style={{ fontSize: '18px', fontWeight: 800, color: '#ff7700', fontFamily: 'monospace' }}>{p.price}</span>
                      </div>
                      <img src={p.imageUrl || '/assets/thumbnail.png'} alt={p.title} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '8px', marginBottom: '14px' }} />
                      <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: '0 0 8px 0' }}>{p.title}</h3>
                      <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 14px 0' }}>{p.description}</p>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>{p.category} · {p.salesCount || 0} sales</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => openProductModal(p)}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm('product', p)}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: INQUIRIES */}
          {activeTab === 'inquiries' && (
            <div style={{
              backgroundColor: '#12100e',
              border: '1px solid rgba(255, 119, 0, 0.25)',
              borderRadius: '16px',
              padding: '28px',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.85)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: 0 }}>Client Inquiries and Proposals</h1>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                    Real-time inbound inquiries submitted through the public contact form (Zero dummy data).
                  </p>
                </div>
                <button
                  onClick={() => {
                    fetch('/api/inquiries').then(r => r.json()).then(d => {
                      if (d.success) {
                        setInquiries(d.data);
                        showToast('Inquiries refreshed in real time!');
                      }
                    });
                  }}
                  style={{
                    backgroundColor: '#ff7700',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(255, 119, 0, 0.35)'
                  }}
                >
                  <span>⟳ Refresh Live Inquiries</span>
                </button>
              </div>

              {/* Inquiries List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {filteredInquiries.length === 0 ? (
                  <div style={{ padding: '60px', backgroundColor: '#181512', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>📬</div>
                    <div style={{ color: '#fff', fontSize: '16px', fontWeight: 700, marginBottom: '6px' }}>Inbox is Clean | 0 Dummy Inquiries</div>
                    <div style={{ color: '#64748b', fontSize: '13px', maxWidth: '420px', margin: '0 auto' }}>
                      Real client proposals and inquiries submitted via the live website contact form will appear here in real time.
                    </div>
                  </div>
                ) : (
                  filteredInquiries.map((inq) => (
                    <div
                      key={inq.id || inq._id}
                      style={{
                        backgroundColor: inq.status === 'new' ? '#1c1713' : '#181512',
                        border: inq.status === 'new' ? '1px solid rgba(255, 119, 0, 0.45)' : '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: '12px',
                        padding: '20px 24px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '16px',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.5)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                        <button
                          onClick={() => toggleInquiryStarred(inq)}
                          style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', color: inq.starred ? '#f59e0b' : '#475569' }}
                        >
                          {inq.starred ? '★' : '☆'}
                        </button>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                            <strong style={{ fontSize: '15px', color: '#fff' }}>{inq.name}</strong>
                            <span style={{ fontSize: '12px', color: '#38bdf8' }}>{inq.email}</span>
                            <span style={{
                              fontSize: '11px',
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: 700,
                              backgroundColor: inq.status === 'new' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                              color: inq.status === 'new' ? '#ef4444' : '#10b981'
                            }}>
                              {inq.status.toUpperCase()}
                            </span>
                          </div>
                          <div style={{ fontSize: '13px', color: '#ff7700', fontWeight: 600 }}>{inq.subject || 'Project Inquiry'}</div>
                          <p style={{ fontSize: '13px', color: '#94a3b8', margin: '4px 0 0 0', maxWidth: '600px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {inq.message}
                          </p>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <button
                          onClick={() => setInquiryModal({ isOpen: true, data: inq })}
                          style={{
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#ffffff',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          View Message
                        </button>
                        <a
                          href={`mailto:${inq.email}?subject=Re: ${encodeURIComponent(inq.subject || 'Portfolio Inquiry')}`}
                          style={{
                            backgroundColor: '#ff7700',
                            color: '#ffffff',
                            padding: '6px 14px',
                            borderRadius: '6px',
                            textDecoration: 'none',
                            fontSize: '12px',
                            fontWeight: 600
                          }}
                        >
                          Reply ↗
                        </a>
                        <button
                          onClick={() => triggerDeleteConfirm('inquiry', inq)}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 5: TESTIMONIALS */}
          {activeTab === 'reviews' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: 0 }}>Client Testimonials</h1>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                    Manage client reviews that showcase on the homepage marquee.
                  </p>
                </div>
                <button
                  onClick={() => openReviewModal()}
                  style={{
                    backgroundColor: '#ff7700',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  + Add Testimonial
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '20px' }}>
                {reviews.map((rev) => (
                  <div 
                    key={rev.id || rev._id} 
                    style={{ 
                      backgroundColor: '#131110', 
                      border: '1px solid rgba(255, 255, 255, 0.08)', 
                      borderRadius: '12px', 
                      padding: '22px', 
                      display: 'flex', 
                      flexDirection: 'column', 
                      justifyContent: 'space-between',
                      height: '240px',
                      minHeight: '240px',
                      maxHeight: '240px',
                      boxSizing: 'border-box',
                      overflow: 'hidden'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', height: '22px' }}>
                        <span style={{ color: '#f59e0b', fontSize: '14px', letterSpacing: '2px' }}>★★★★★</span>
                        <span style={{ fontSize: '11px', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)', padding: '2px 8px', borderRadius: '4px' }}>
                          {rev.badge || 'Verified Client'}
                        </span>
                      </div>
                      <p 
                        style={{ 
                          fontSize: '13px', 
                          color: '#cbd5e1', 
                          lineHeight: 1.6, 
                          fontStyle: 'italic', 
                          margin: 0,
                          display: '-webkit-box',
                          WebkitLineClamp: 3,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          height: '64px',
                          maxHeight: '64px'
                        }}
                      >
                        &ldquo;{rev.quote}&rdquo;
                      </p>
                    </div>

                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '50px', boxSizing: 'border-box' }}>
                      <div>
                        <strong style={{ color: '#ffffff', fontSize: '14px', display: 'block' }}>{rev.authorName}</strong>
                        <span style={{ color: '#94a3b8', fontSize: '12px' }}>{rev.authorRole} {rev.company && `· ${rev.company}`}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => openReviewModal(rev)}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm('review', rev)}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SERVICES */}
          {activeTab === 'services' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: 0 }}>Engineering & Design Services</h1>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                    Configure freelance offerings, deliverables, timelines, and starting rates.
                  </p>
                </div>
                <button
                  onClick={() => openServiceModal()}
                  style={{
                    backgroundColor: '#ff7700',
                    color: '#ffffff',
                    border: 'none',
                    padding: '10px 18px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '13px',
                    cursor: 'pointer'
                  }}
                >
                  + Add Service
                </button>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                {services.map((srv) => (
                  <div key={srv.id || srv._id} style={{ backgroundColor: '#131110', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '22px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '11px', color: '#38bdf8', textTransform: 'uppercase', fontWeight: 700 }}>{srv.category}</span>
                      <span style={{ fontSize: '16px', fontWeight: 800, color: '#ff7700', fontFamily: 'monospace' }}>From {srv.startingPrice}</span>
                    </div>
                    <h3 style={{ fontSize: '17px', fontWeight: 700, color: '#ffffff', margin: '0 0 8px 0' }}>{srv.title}</h3>
                    <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 16px 0' }}>{srv.description}</p>
                    <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '12px', color: '#64748b' }}>⏱ Delivery: {srv.deliveryTime}</span>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          onClick={() => openServiceModal(srv)}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#ffffff',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => triggerDeleteConfirm('service', srv)}
                          style={{
                            backgroundColor: 'transparent',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            color: '#ef4444',
                            padding: '6px 12px',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontSize: '12px'
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: PROFILE SETTINGS */}
          {activeTab === 'profile' && (
            <div style={{ maxWidth: '800px' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: '0 0 6px 0' }}>Site Profile & Live Availability</h1>
              <p style={{ fontSize: '14px', color: '#94a3b8', margin: '0 0 24px 0' }}>
                Update your public stats, availability status, and social channels stored permanently in MongoDB.
              </p>

              <form onSubmit={handleSaveProfile} style={{ backgroundColor: '#131110', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: '8px' }}>
                  <div>
                    <strong style={{ color: '#fff', fontSize: '15px', display: 'block' }}>Availability Toggle</strong>
                    <span style={{ color: '#94a3b8', fontSize: '13px' }}>Mark yourself as available for new client work</span>
                  </div>
                  <input
                    type="checkbox"
                    checked={profile.availableForHire}
                    onChange={(e) => setProfile({ ...profile, availableForHire: e.target.checked })}
                    style={{ width: '22px', height: '22px', accentColor: '#ff7700', cursor: 'pointer' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>Availability Tagline</label>
                  <input
                    type="text"
                    value={profile.availabilityText}
                    onChange={(e) => setProfile({ ...profile, availabilityText: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px 14px', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>Years Experience</label>
                    <input
                      type="number"
                      value={profile.yearsExperience}
                      onChange={(e) => setProfile({ ...profile, yearsExperience: parseInt(e.target.value) || 0 })}
                      style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px 14px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>Projects Completed</label>
                    <input
                      type="number"
                      value={profile.projectsCompleted}
                      onChange={(e) => setProfile({ ...profile, projectsCompleted: parseInt(e.target.value) || 0 })}
                      style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px 14px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>Happy Clients</label>
                    <input
                      type="number"
                      value={profile.happyClients}
                      onChange={(e) => setProfile({ ...profile, happyClients: parseInt(e.target.value) || 0 })}
                      style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px 14px', color: '#fff' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>Bio / Overview</label>
                  <textarea
                    rows={3}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px 14px', color: '#fff' }}
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>Fiverr Pro Link</label>
                    <input
                      type="text"
                      value={profile.socials?.fiverr || ''}
                      onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, fiverr: e.target.value } })}
                      style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px 14px', color: '#fff' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#e2e8f0', marginBottom: '6px' }}>LinkedIn Link</label>
                    <input
                      type="text"
                      value={profile.socials?.linkedin || ''}
                      onChange={(e) => setProfile({ ...profile, socials: { ...profile.socials, linkedin: e.target.value } })}
                      style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px 14px', color: '#fff' }}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: '#ff7700',
                    color: '#ffffff',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    fontSize: '14px',
                    cursor: 'pointer',
                    marginTop: '10px'
                  }}
                >
                  {isSubmitting ? 'Saving to MongoDB...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          )}

          {/* TAB 8: ABOUT US, WORK EXPERIENCE & EDUCATION */}
          {activeTab === 'about' && (
            <div style={{ maxWidth: '960px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
                <div>
                  <h1 style={{ fontSize: '24px', fontWeight: 800, color: '#ffffff', margin: 0 }}>
                    About Us & Credentials
                  </h1>
                  <p style={{ fontSize: '14px', color: '#94a3b8', margin: '4px 0 0 0' }}>
                    Manage public bio, education background, work experiences, and verified credentials stored permanently in MongoDB.
                  </p>
                </div>
              </div>

              {/* SECTION A: ABOUT HEADLINE & BIO */}
              <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px', marginBottom: '28px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: '0 0 16px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span>👤</span> About Headline & Biography
                </h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveAbout(about);
                  }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      Headline *
                    </label>
                    <input
                      type="text"
                      required
                      value={about.headline || ''}
                      onChange={(e) => setAbout({ ...about, headline: e.target.value })}
                      placeholder="Clean web experiences with personality and purpose."
                      style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '6px' }}>
                      About Bio / Summary *
                    </label>
                    <textarea
                      rows={4}
                      required
                      value={about.subtext || ''}
                      onChange={(e) => setAbout({ ...about, subtext: e.target.value })}
                      placeholder="I am Muhammad Hasil, a full-stack developer..."
                      style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', padding: '10px 14px', color: '#fff', fontSize: '14px', lineHeight: 1.5 }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      style={{
                        backgroundColor: '#ff7700',
                        color: '#ffffff',
                        border: 'none',
                        padding: '10px 22px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      {isSubmitting ? 'Saving...' : 'Save Bio Changes'}
                    </button>
                  </div>
                </form>
              </div>

              {/* SECTION B: WORK EXPERIENCE STACK */}
              <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>💼</span> Work Experience ({about.experience?.length || 0})
                    </h2>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Professional engineering background & roles</span>
                  </div>
                  <button
                    onClick={() => openExperienceModal('create')}
                    style={{
                      backgroundColor: 'rgba(255, 119, 0, 0.15)',
                      border: '1px solid rgba(255, 119, 0, 0.4)',
                      color: '#ff7700',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>+</span> Add Work Experience
                  </button>
                </div>

                {(!about.experience || about.experience.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', backgroundColor: '#070605', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    No work experience items yet. Click "+ Add Work Experience" to add one.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {about.experience.map((exp, idx) => (
                      <div
                        key={exp.id || idx}
                        style={{
                          backgroundColor: '#070605',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '10px',
                          padding: '16px 20px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '16px'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>{exp.role}</h3>
                            <span style={{ fontSize: '11px', color: '#ff7700', backgroundColor: 'rgba(255, 119, 0, 0.1)', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                              {exp.period || '2024 - Present'}
                            </span>
                          </div>
                          <div style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 600, marginBottom: '6px' }}>
                            {exp.company}
                          </div>
                          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                            {exp.description}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => openExperienceModal('edit', idx, exp)}
                            style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteExperience(idx)}
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION C: EDUCATION HISTORY STACK */}
              <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>🎓</span> Education ({about.education?.length || 0})
                    </h2>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Academic degrees and programs</span>
                  </div>
                  <button
                    onClick={() => openEducationModal('create')}
                    style={{
                      backgroundColor: 'rgba(255, 119, 0, 0.15)',
                      border: '1px solid rgba(255, 119, 0, 0.4)',
                      color: '#ff7700',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>+</span> Add Education
                  </button>
                </div>

                {(!about.education || about.education.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', backgroundColor: '#070605', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    No education items yet. Click "+ Add Education" to add one.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {about.education.map((edu, idx) => (
                      <div
                        key={edu.id || idx}
                        style={{
                          backgroundColor: '#070605',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '10px',
                          padding: '16px 20px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'flex-start',
                          gap: '16px'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', margin: 0 }}>{edu.degree}</h3>
                            <span style={{ fontSize: '11px', color: '#10b981', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
                              {edu.period || '2025 - Present'}
                            </span>
                          </div>
                          <div style={{ fontSize: '13px', color: '#a78bfa', fontWeight: 600, marginBottom: '6px' }}>
                            {edu.institution}
                          </div>
                          <p style={{ fontSize: '13px', color: '#94a3b8', margin: 0, lineHeight: 1.5 }}>
                            {edu.description}
                          </p>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => openEducationModal('edit', idx, edu)}
                            style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteEducation(idx)}
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '6px 12px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* SECTION D: CERTIFICATIONS STACK */}
              <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '24px', marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                  <div>
                    <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#ffffff', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>📜</span> Professional Certifications ({about.certifications?.length || 0})
                    </h2>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>Licenses, badges, and verified credentials</span>
                  </div>
                  <button
                    onClick={() => openCertificationModal('create')}
                    style={{
                      backgroundColor: 'rgba(255, 119, 0, 0.15)',
                      border: '1px solid rgba(255, 119, 0, 0.4)',
                      color: '#ff7700',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontWeight: 700,
                      fontSize: '13px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}
                  >
                    <span>+</span> Add Certification
                  </button>
                </div>

                {(!about.certifications || about.certifications.length === 0) ? (
                  <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', backgroundColor: '#070605', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                    No certifications yet. Click "+ Add Certification" to add one.
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
                    {about.certifications.map((cert, idx) => (
                      <div
                        key={cert.id || idx}
                        style={{
                          backgroundColor: '#070605',
                          border: '1px solid rgba(255, 255, 255, 0.06)',
                          borderRadius: '10px',
                          padding: '16px',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: 700, textTransform: 'uppercase' }}>
                              ✦ {cert.issuer}
                            </span>
                            <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: 600 }}>
                              {cert.date}
                            </span>
                          </div>
                          <h3 style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: '0 0 8px 0' }}>
                            {cert.title}
                          </h3>
                          {cert.link && (
                            <a href={cert.link} target="_blank" rel="noopener noreferrer" style={{ fontSize: '12px', color: '#ff7700', textDecoration: 'none' }}>
                              View Credential ↗
                            </a>
                          )}
                        </div>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '14px' }}>
                          <button
                            onClick={() => openCertificationModal('edit', idx, cert)}
                            style={{ backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#cbd5e1', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteCertification(idx)}
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', color: '#f87171', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', cursor: 'pointer' }}
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* MODAL 1: PROJECT MODAL */}
      {/* ------------------------------------------------------------- */}
      {projectModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 16px 0' }}>
              {projectModal.mode === 'edit' ? 'Edit Portfolio Project' : 'Create New Project'}
            </h2>
            <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Project Title *</label>
                <input
                  type="text"
                  required
                  value={projectForm.title}
                  onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Category *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. fullstack react"
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Badge / Tag Pill</label>
                  <input
                    type="text"
                    placeholder="e.g. Full Stack Web App"
                    value={projectForm.pill}
                    onChange={(e) => setProjectForm({ ...projectForm, pill: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Description *</label>
                <textarea
                  rows={3}
                  required
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Live Demo URL</label>
                  <input
                    type="text"
                    placeholder="https://..."
                    value={projectForm.liveDemoUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, liveDemoUrl: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Image URL</label>
                  <input
                    type="text"
                    placeholder="/assets/StayPilot.png"
                    value={projectForm.imageUrl}
                    onChange={(e) => setProjectForm({ ...projectForm, imageUrl: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Technologies (comma separated)</label>
                <input
                  type="text"
                  placeholder="React, Next.js, Node.js, MongoDB"
                  value={projectForm.technologies}
                  onChange={(e) => setProjectForm({ ...projectForm, technologies: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setProjectModal({ isOpen: false, mode: 'create', data: null })}
                  style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: '#ff7700', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isSubmitting ? 'Saving...' : 'Save to MongoDB'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 2: PRODUCT MODAL */}
      {/* ------------------------------------------------------------- */}
      {productModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto', padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 16px 0' }}>
              {productModal.mode === 'edit' ? 'Edit Digital Product' : 'Add New Digital Product'}
            </h2>
            <form onSubmit={handleSaveProduct} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Product Title *</label>
                <input
                  type="text"
                  required
                  value={productForm.title}
                  onChange={(e) => setProductForm({ ...productForm, title: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Category *</label>
                  <input
                    type="text"
                    required
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Price *</label>
                  <input
                    type="text"
                    required
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Badge</label>
                  <input
                    type="text"
                    value={productForm.badge}
                    onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Description *</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Purchase / Order URL</label>
                  <input
                    type="text"
                    value={productForm.buyUrl}
                    onChange={(e) => setProductForm({ ...productForm, buyUrl: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Live Demo URL</label>
                  <input
                    type="text"
                    value={productForm.demoUrl}
                    onChange={(e) => setProductForm({ ...productForm, demoUrl: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Features (comma separated)</label>
                <input
                  type="text"
                  value={productForm.features}
                  onChange={(e) => setProductForm({ ...productForm, features: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setProductModal({ isOpen: false, mode: 'create', data: null })}
                  style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: '#ff7700', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 3: INQUIRY DETAIL MODAL */}
      {/* ------------------------------------------------------------- */}
      {inquiryModal.isOpen && inquiryModal.data && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', width: '100%', maxWidth: '580px', padding: '28px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontSize: '11px', color: '#ff7700', textTransform: 'uppercase', fontWeight: 800 }}>Inbound Client Proposal</span>
              <button onClick={() => setInquiryModal({ isOpen: false, data: null })} style={{ background: 'none', border: 'none', color: '#94a3b8', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 4px 0' }}>{inquiryModal.data.name}</h2>
            <div style={{ fontSize: '14px', color: '#38bdf8', marginBottom: '14px' }}>{inquiryModal.data.email}</div>

            <div style={{ padding: '16px', backgroundColor: '#070605', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)', marginBottom: '16px' }}>
              <strong style={{ color: '#ff7700', fontSize: '13px', display: 'block', marginBottom: '6px' }}>Subject: {inquiryModal.data.subject}</strong>
              <p style={{ color: '#e2e8f0', fontSize: '14px', lineHeight: 1.6, margin: 0, whiteSpace: 'pre-wrap' }}>
                {inquiryModal.data.message}
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => { toggleInquiryStatus(inquiryModal.data, 'replied'); setInquiryModal({ isOpen: false, data: null }); }}
                  style={{ backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid #10b981', color: '#10b981', padding: '8px 14px', borderRadius: '6px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
                >
                  Mark Replied
                </button>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <a
                  href={`mailto:${inquiryModal.data.email}?subject=Re: ${encodeURIComponent(inquiryModal.data.subject || 'Portfolio Inquiry')}`}
                  style={{ backgroundColor: '#ff7700', color: '#fff', padding: '8px 18px', borderRadius: '6px', fontSize: '13px', fontWeight: 700, textDecoration: 'none' }}
                >
                  Reply via Email ↗
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 4: DELETE CONFIRMATION MODAL (MANUAL SAFETY SHIELD) */}
      {/* ------------------------------------------------------------- */}
      {deleteConfirm.isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 1100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#131110', border: '1px solid rgba(239, 68, 68, 0.4)', borderRadius: '12px', width: '100%', maxWidth: '440px', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '36px', marginBottom: '12px' }}>⚠️</div>
            <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '0 0 8px 0' }}>Confirm Permanent Deletion</h3>
            <p style={{ fontSize: '13px', color: '#94a3b8', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              Are you sure you want to permanently delete <strong>"{deleteConfirm.title}"</strong> from MongoDB and disk storage? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
              <button
                onClick={() => setDeleteConfirm({ isOpen: false, type: '', id: null, title: '' })}
                style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer' }}
              >
                Cancel
              </button>
              <button
                onClick={executeDelete}
                disabled={isSubmitting}
                style={{ backgroundColor: '#ef4444', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
              >
                {isSubmitting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 5: TESTIMONIAL MODAL */}
      {/* ------------------------------------------------------------- */}
      {reviewModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', width: '100%', maxWidth: '540px', padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 16px 0' }}>
              {reviewModal.mode === 'edit' ? 'Edit Testimonial' : 'Add Client Testimonial'}
            </h2>
            <form onSubmit={handleSaveReview} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Client Name *</label>
                  <input
                    type="text"
                    required
                    value={reviewForm.authorName}
                    onChange={(e) => setReviewForm({ ...reviewForm, authorName: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Role / Title</label>
                  <input
                    type="text"
                    value={reviewForm.authorRole}
                    onChange={(e) => setReviewForm({ ...reviewForm, authorRole: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Badge Category</label>
                <input
                  type="text"
                  placeholder="e.g. Next.js & React"
                  value={reviewForm.badge}
                  onChange={(e) => setReviewForm({ ...reviewForm, badge: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Client Quote / Review *</label>
                <textarea
                  rows={4}
                  required
                  value={reviewForm.quote}
                  onChange={(e) => setReviewForm({ ...reviewForm, quote: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setReviewModal({ isOpen: false, mode: 'create', data: null })}
                  style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: '#ff7700', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Review'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 6: SERVICE MODAL */}
      {/* ------------------------------------------------------------- */}
      {serviceModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', width: '100%', maxWidth: '540px', padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 16px 0' }}>
              {serviceModal.mode === 'edit' ? 'Edit Service' : 'Add Service'}
            </h2>
            <form onSubmit={handleSaveService} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Service Title *</label>
                <input
                  type="text"
                  required
                  value={serviceForm.title}
                  onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Starting Price</label>
                  <input
                    type="text"
                    value={serviceForm.startingPrice}
                    onChange={(e) => setServiceForm({ ...serviceForm, startingPrice: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Delivery Timeline</label>
                  <input
                    type="text"
                    value={serviceForm.deliveryTime}
                    onChange={(e) => setServiceForm({ ...serviceForm, deliveryTime: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Description *</label>
                <textarea
                  rows={3}
                  required
                  value={serviceForm.description}
                  onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Deliverables (comma separated)</label>
                <input
                  type="text"
                  value={serviceForm.deliverables}
                  onChange={(e) => setServiceForm({ ...serviceForm, deliverables: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setServiceModal({ isOpen: false, mode: 'create', data: null })}
                  style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: '#ff7700', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 7: WORK EXPERIENCE MODAL */}
      {/* ------------------------------------------------------------- */}
      {experienceModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', width: '100%', maxWidth: '540px', padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 16px 0' }}>
              {experienceModal.mode === 'edit' ? 'Edit Work Experience' : 'Add Work Experience'}
            </h2>
            <form onSubmit={handleSaveExperience} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Role / Job Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full Stack Developer"
                  value={experienceForm.role}
                  onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Company / Client *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Freelance & Client Systems"
                    value={experienceForm.company}
                    onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Period *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024 - Present"
                    value={experienceForm.period}
                    onChange={(e) => setExperienceForm({ ...experienceForm, period: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Experience Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your responsibilities, architectural accomplishments, and key technologies..."
                  value={experienceForm.description}
                  onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Project Link / Reference URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={experienceForm.projectLink}
                  onChange={(e) => setExperienceForm({ ...experienceForm, projectLink: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setExperienceModal({ isOpen: false, mode: 'create', index: -1, data: null })}
                  style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: '#ff7700', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Experience'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 8: EDUCATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {educationModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', width: '100%', maxWidth: '540px', padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 16px 0' }}>
              {educationModal.mode === 'edit' ? 'Edit Education' : 'Add Education'}
            </h2>
            <form onSubmit={handleSaveEducation} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Degree / Program *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. BS Business & Information Technology (BBIT)"
                  value={educationForm.degree}
                  onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Institution / University *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Virtual University of Pakistan"
                    value={educationForm.institution}
                    onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Period *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2025 - Present"
                    value={educationForm.period}
                    onChange={(e) => setEducationForm({ ...educationForm, period: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe your academic coursework, field of focus, or certifications..."
                  value={educationForm.description}
                  onChange={(e) => setEducationForm({ ...educationForm, description: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Institution / Link URL</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={educationForm.certificationLink}
                  onChange={(e) => setEducationForm({ ...educationForm, certificationLink: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setEducationModal({ isOpen: false, mode: 'create', index: -1, data: null })}
                  style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: '#ff7700', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Education'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* MODAL 9: CERTIFICATION MODAL */}
      {/* ------------------------------------------------------------- */}
      {certificationModal.isOpen && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div style={{ backgroundColor: '#131110', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', width: '100%', maxWidth: '540px', padding: '28px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, color: '#fff', margin: '0 0 16px 0' }}>
              {certificationModal.mode === 'edit' ? 'Edit Certification' : 'Add Certification'}
            </h2>
            <form onSubmit={handleSaveCertification} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Certification Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Full-Stack Software Engineering & Modern Web Architecture"
                  value={certificationForm.title}
                  onChange={(e) => setCertificationForm({ ...certificationForm, title: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Issuer / Authority *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Verified Credential"
                    value={certificationForm.issuer}
                    onChange={(e) => setCertificationForm({ ...certificationForm, issuer: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Year / Date *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2024"
                    value={certificationForm.date}
                    onChange={(e) => setCertificationForm({ ...certificationForm, date: e.target.value })}
                    style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#cbd5e1', marginBottom: '4px' }}>Verification Link</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={certificationForm.link}
                  onChange={(e) => setCertificationForm({ ...certificationForm, link: e.target.value })}
                  style={{ width: '100%', backgroundColor: '#070605', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', padding: '8px 12px', color: '#fff' }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '16px' }}>
                <button
                  type="button"
                  onClick={() => setCertificationModal({ isOpen: false, mode: 'create', index: -1, data: null })}
                  style={{ backgroundColor: 'transparent', border: '1px solid rgba(255,255,255,0.2)', color: '#fff', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{ backgroundColor: '#ff7700', border: 'none', color: '#fff', padding: '8px 20px', borderRadius: '6px', fontWeight: 700, cursor: 'pointer' }}
                >
                  {isSubmitting ? 'Saving...' : 'Save Certification'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
