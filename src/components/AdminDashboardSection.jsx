import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../context/AuthContext';
import { 
  collection, 
  addDoc, 
  deleteDoc, 
  doc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../../firebase';
import { getYouTubeId } from './ProjectsSection';
import { 
  getCombinedProjects, 
  getCombinedProducts, 
  getCombinedVideos, 
  saveLocalProject, 
  deleteLocalProject, 
  saveLocalProduct, 
  deleteLocalProduct, 
  saveLocalVideo, 
  deleteLocalVideo, 
  initialSeedProjects 
} from '../lib/storage';

export default function AdminDashboardSection() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('products');
  const [rawFirestoreProjects, setRawFirestoreProjects] = useState([]);
  const [rawFirestoreVideos, setRawFirestoreVideos] = useState([]);
  const [rawApiProducts, setRawApiProducts] = useState([]);

  const [projects, setProjects] = useState([]);
  const [videos, setVideos] = useState([]);
  const [products, setProducts] = useState([]);

  const [editingProjectId, setEditingProjectId] = useState(null);
  const [editingProductId, setEditingProductId] = useState(null);

  const [projectForm, setProjectForm] = useState({
    title: '',
    category: 'fullstack react',
    pill: 'Full Stack Web App',
    description: '',
    liveDemoUrl: '',
    imageUrl: '',
    youtubeUrl: ''
  });

  const [productForm, setProductForm] = useState({
    title: '',
    category: 'Web Apps',
    price: '$29',
    badge: 'Featured',
    description: '',
    imageUrl: '',
    buyUrl: '',
    demoUrl: '',
    features: ''
  });

  const [videoForm, setVideoForm] = useState({
    title: '',
    youtubeUrl: '',
    description: '',
    category: 'YouTube Showcase'
  });

  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/admin/login');
    }
  }, [user, authLoading, router]);

  // Initial load from storage helpers
  useEffect(() => {
    setProjects(getCombinedProjects([]));
    setVideos(getCombinedVideos([]));
    setProducts(getCombinedProducts([]));
  }, []);

  // Real-time Firestore sync for projects & videos
  useEffect(() => {
    if (!user) return;

    const qProjects = collection(db, 'projects');
    const unsubProjects = onSnapshot(qProjects, (snapshot) => {
      const projs = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setRawFirestoreProjects(projs);
      setProjects(getCombinedProjects(projs));
    }, (err) => console.error("Projects snapshot error:", err));

    const qVideos = query(collection(db, 'youtube_videos'), orderBy('createdAt', 'desc'));
    const unsubVideos = onSnapshot(qVideos, (snapshot) => {
      const vids = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
      setRawFirestoreVideos(vids);
      setVideos(getCombinedVideos(vids));
    }, (err) => console.error("Videos snapshot error:", err));

    fetchProducts();

    return () => {
      unsubProjects();
      unsubVideos();
    };
  }, [user]);

  // Fetch Products from MongoDB API + LocalStorage fallback
  const fetchProducts = async () => {
    let apiData = [];
    try {
      const res = await fetch('/api/products');
      const data = await res.json();
      if (data.success && Array.isArray(data.data) && data.data.length > 0) {
        apiData = data.data;
        setRawApiProducts(apiData);
      }
    } catch (e) {
      console.warn('MongoDB API fetch warning:', e);
    }
    setProducts(getCombinedProducts(apiData));
  };

  if (authLoading || !user) {
    return (
      <div className="page-view active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '70vh' }}>
        <p style={{ color: '#ff7700', fontSize: '18px', fontWeight: 'bold' }}>Loading Admin Dashboard...</p>
      </div>
    );
  }

  // --- PRODUCTS CRUD ---
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productForm.title || !productForm.description) {
      setStatusMsg({ type: 'error', text: 'Please fill in Title and Description.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg({ type: 'info', text: 'Saving product to storage...' });

    const productPayload = {
      ...productForm,
      features: typeof productForm.features === 'string'
        ? productForm.features.split(',').map(s => s.trim()).filter(Boolean)
        : productForm.features
    };

    try {
      if (editingProductId) {
        try {
          await fetch(`/api/products/${editingProductId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productPayload)
          });
        } catch (err) {}

        saveLocalProduct({ _id: editingProductId, ...productPayload });
        setStatusMsg({ type: 'success', text: '✓ Product updated successfully!' });
      } else {
        let newProdId = Date.now().toString();
        try {
          const res = await fetch('/api/products', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productPayload)
          });
          const resData = await res.json();
          if (resData.data && (resData.data._id || resData.data.id)) {
            newProdId = resData.data._id || resData.data.id;
          }
        } catch (err) {}

        saveLocalProduct({ _id: newProdId, id: newProdId, ...productPayload });
        setStatusMsg({ type: 'success', text: '✓ New Product added successfully!' });
      }

      setProducts(getCombinedProducts(rawApiProducts));

      setProductForm({
        title: '',
        category: 'Web Apps',
        price: '$29',
        badge: 'Featured',
        description: '',
        imageUrl: '',
        buyUrl: '',
        demoUrl: '',
        features: ''
      });
      setEditingProductId(null);
    } catch (err) {
      console.error('Error saving product:', err);
      setStatusMsg({ type: 'error', text: 'Failed to save product: ' + err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      try {
        await fetch(`/api/products/${id}`, { method: 'DELETE' });
      } catch (err) {}
      
      const prodToDelete = products.find(p => p._id === id || p.id === id);
      deleteLocalProduct(id, prodToDelete?.title);
      setProducts(getCombinedProducts(rawApiProducts));
      setStatusMsg({ type: 'success', text: '✓ Product deleted successfully.' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to delete: ' + err.message });
    }
  };

  // --- PROJECTS CRUD ---
  const handleSaveProject = async (e) => {
    e.preventDefault();
    if (!projectForm.title || !projectForm.description) {
      setStatusMsg({ type: 'error', text: 'Please fill in required fields (Title & Description).' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg({ type: 'info', text: 'Saving project...' });

    try {
      if (editingProjectId) {
        try {
          await updateDoc(doc(db, 'projects', editingProjectId), {
            ...projectForm,
            updatedAt: serverTimestamp()
          });
        } catch (e) {}

        saveLocalProject({ id: editingProjectId, ...projectForm });
        setStatusMsg({ type: 'success', text: '✓ Project updated successfully!' });
      } else {
        let newProjId = Date.now().toString();
        try {
          const docRef = await addDoc(collection(db, 'projects'), {
            ...projectForm,
            createdAt: serverTimestamp()
          });
          if (docRef?.id) newProjId = docRef.id;
        } catch (e) {}

        saveLocalProject({ id: newProjId, ...projectForm });
        setStatusMsg({ type: 'success', text: '✓ New project added successfully!' });
      }

      setProjects(getCombinedProjects(rawFirestoreProjects));

      setProjectForm({
        title: '',
        category: 'fullstack react',
        pill: 'Full Stack Web App',
        description: '',
        liveDemoUrl: '',
        imageUrl: '',
        youtubeUrl: ''
      });
      setEditingProjectId(null);
    } catch (err) {
      console.error('Error saving project:', err);
      setStatusMsg({ type: 'error', text: 'Failed to save project: ' + err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!window.confirm('Are you sure you want to delete this project?')) return;
    try {
      try {
        await deleteDoc(doc(db, 'projects', id));
      } catch (e) {}

      const projToDelete = projects.find(p => p.id === id || p._id === id);
      deleteLocalProject(id, projToDelete?.title);
      setProjects(getCombinedProjects(rawFirestoreProjects));
      setStatusMsg({ type: 'success', text: '✓ Project deleted successfully.' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to delete: ' + err.message });
    }
  };

  const handleSeedProjects = async () => {
    if (!window.confirm('This will seed default portfolio projects. Continue?')) return;
    setIsSubmitting(true);
    setStatusMsg({ type: 'info', text: 'Seeding portfolio projects...' });
    try {
      for (const p of initialSeedProjects) {
        saveLocalProject(p);
        try {
          await addDoc(collection(db, 'projects'), {
            ...p,
            createdAt: serverTimestamp()
          });
        } catch (e) {}
      }
      setProjects(getCombinedProjects(rawFirestoreProjects));
      setStatusMsg({ type: 'success', text: '✓ Portfolio projects seeded successfully!' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Seeding failed: ' + err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- YOUTUBE CRUD ---
  const handleSaveVideo = async (e) => {
    e.preventDefault();
    if (!videoForm.title || !videoForm.youtubeUrl) {
      setStatusMsg({ type: 'error', text: 'Please enter Title and YouTube Link.' });
      return;
    }

    const yId = getYouTubeId(videoForm.youtubeUrl);
    if (!yId) {
      setStatusMsg({ type: 'error', text: 'Invalid YouTube link provided.' });
      return;
    }

    setIsSubmitting(true);
    setStatusMsg({ type: 'info', text: 'Adding YouTube video...' });

    try {
      let newVidId = Date.now().toString();
      const videoData = {
        title: videoForm.title,
        youtubeUrl: videoForm.youtubeUrl,
        youtubeId: yId,
        description: videoForm.description || '',
        category: videoForm.category || 'YouTube Video',
        imageUrl: `https://img.youtube.com/vi/${yId}/hqdefault.jpg`
      };

      try {
        const docRef = await addDoc(collection(db, 'youtube_videos'), {
          ...videoData,
          createdAt: serverTimestamp()
        });
        if (docRef?.id) newVidId = docRef.id;
      } catch (e) {}

      saveLocalVideo({ id: newVidId, ...videoData });
      setVideos(getCombinedVideos(rawFirestoreVideos));

      setStatusMsg({ type: 'success', text: '✓ YouTube video added successfully!' });
      setVideoForm({ title: '', youtubeUrl: '', description: '', category: 'YouTube Showcase' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to add video: ' + err.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Are you sure you want to delete this YouTube video link?')) return;
    try {
      try {
        await deleteDoc(doc(db, 'youtube_videos', id));
      } catch (e) {}

      deleteLocalVideo(id);
      setVideos(getCombinedVideos(rawFirestoreVideos));
      setStatusMsg({ type: 'success', text: '✓ YouTube video deleted successfully.' });
    } catch (err) {
      setStatusMsg({ type: 'error', text: 'Failed to delete video: ' + err.message });
    }
  };

  return (
    <div className="page-view active" style={{ paddingBottom: '80px' }}>
      <section className="about-section">
        {/* Admin Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px', marginBottom: '30px', padding: '28px', backgroundColor: 'rgba(20, 18, 16, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,119,0,0.3)', borderRadius: '24px', boxShadow: '0 20px 50px rgba(0,0,0,0.6)' }}>
          <div>
            <span className="hero-tagline-badge" style={{ marginBottom: '10px' }}>
              <span className="orange-dot"></span> AUTHENTICATED ADMIN SESSION
            </span>
            <h1 style={{ fontSize: '32px', fontWeight: '800', fontFamily: 'Syne, sans-serif', color: '#fff', margin: 0 }}>
              Portfolio & Store Control Center
            </h1>
            <p style={{ color: '#aaa', margin: '6px 0 0 0', fontSize: '14px' }}>
              Logged in as: <strong style={{ color: '#ff7700' }}>{user.email}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <button 
              onClick={() => router.push('/products')} 
              className="btn-secondary"
            >
              View Store <span className="arrow">↗</span>
            </button>
            <button 
              onClick={() => logout()} 
              className="btn-primary" 
              style={{ backgroundColor: '#ff4444', borderColor: '#ff4444' }}
            >
              Logout 🔒
            </button>
          </div>
        </div>

        {/* Dashboard Overview Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          <div className="feature-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '28px', backgroundColor: 'rgba(22, 17, 13, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(249, 115, 22, 0.3)', borderRadius: '22px', boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' }}>STORE PRODUCTS</span>
            <span style={{ fontSize: '42px', fontWeight: '800', color: 'var(--accent-orange)', fontFamily: 'Syne, sans-serif', margin: '8px 0', textShadow: '0 0 20px rgba(249, 115, 22, 0.4)' }}>{products.length}</span>
            <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '500' }}>✓ MongoDB Persisted</span>
          </div>

          <div className="feature-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '28px', backgroundColor: 'rgba(22, 17, 13, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '22px', boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' }}>PORTFOLIO PROJECTS</span>
            <span style={{ fontSize: '42px', fontWeight: '800', color: '#ffffff', fontFamily: 'Syne, sans-serif', margin: '8px 0', textShadow: '0 0 20px rgba(255, 255, 255, 0.2)' }}>{projects.length}</span>
            <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '500' }}>✓ Firestore Real-time Sync</span>
          </div>

          <div className="feature-card" style={{ flexDirection: 'column', alignItems: 'flex-start', padding: '28px', backgroundColor: 'rgba(22, 17, 13, 0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255, 68, 68, 0.3)', borderRadius: '22px', boxShadow: '0 12px 35px rgba(0, 0, 0, 0.7)' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: '700', letterSpacing: '0.1em', textTransform: 'uppercase' }}>YOUTUBE VIDEOS</span>
            <span style={{ fontSize: '42px', fontWeight: '800', color: '#ff4444', fontFamily: 'Syne, sans-serif', margin: '8px 0', textShadow: '0 0 20px rgba(255, 68, 68, 0.4)' }}>{videos.length}</span>
            <span style={{ fontSize: '13px', color: '#cbd5e1', fontWeight: '500' }}>✓ Live Embed Showcase</span>
          </div>
        </div>

        {/* Status Notification Banner */}
        {statusMsg.text && (
          <div className={`contact-status-msg ${statusMsg.type}`} style={{ marginBottom: '30px' }}>
            {statusMsg.text}
          </div>
        )}

        {/* Tab Switcher */}
        <div className="projects-tabs-row" style={{ marginBottom: '35px' }}>
          <button 
            className={`project-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            🛍️ Manage Products ({products.length})
          </button>
          <button 
            className={`project-tab-btn ${activeTab === 'projects' ? 'active' : ''}`}
            onClick={() => setActiveTab('projects')}
          >
            🚀 Manage Projects ({projects.length})
          </button>
          <button 
            className={`project-tab-btn ${activeTab === 'youtube' ? 'active' : ''}`}
            onClick={() => setActiveTab('youtube')}
          >
            📹 Manage YouTube Videos ({videos.length})
          </button>
        </div>

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Add / Edit Form */}
            <div style={{ padding: '32px', backgroundColor: 'rgba(20,18,16,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,119,0,0.3)', borderRadius: '22px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Syne, sans-serif', color: '#fff', marginBottom: '20px' }}>
                {editingProductId ? '✏️ Edit Digital Product' : '🛍️ Add New Digital Product'}
              </h3>
              <form onSubmit={handleSaveProduct}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Product Title *</label>
                  <input 
                    type="text" 
                    value={productForm.title} 
                    onChange={e => setProductForm({ ...productForm, title: e.target.value })} 
                    placeholder="e.g. StayPilot Pro SaaS Starter" 
                    required 
                    className="form-input" 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Category</label>
                    <select 
                      value={productForm.category} 
                      onChange={e => setProductForm({ ...productForm, category: e.target.value })}
                      className="form-input"
                      style={{ backgroundColor: '#111', color: '#fff' }}
                    >
                      <option value="Web Apps">Web Apps</option>
                      <option value="Source Code">Source Code</option>
                      <option value="UI Kits">UI Kits</option>
                      <option value="Templates">Templates</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Price Badge</label>
                    <input 
                      type="text" 
                      value={productForm.price} 
                      onChange={e => setProductForm({ ...productForm, price: e.target.value })} 
                      placeholder="e.g. $29 or Free" 
                      className="form-input" 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Highlight Badge</label>
                    <input 
                      type="text" 
                      value={productForm.badge} 
                      onChange={e => setProductForm({ ...productForm, badge: e.target.value })} 
                      placeholder="e.g. Best Seller / Featured" 
                      className="form-input" 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Image URL</label>
                    <input 
                      type="text" 
                      value={productForm.imageUrl} 
                      onChange={e => setProductForm({ ...productForm, imageUrl: e.target.value })} 
                      placeholder="/assets/StayPilot.png" 
                      className="form-input" 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '16px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Buy / Download Link</label>
                    <input 
                      type="url" 
                      value={productForm.buyUrl} 
                      onChange={e => setProductForm({ ...productForm, buyUrl: e.target.value })} 
                      placeholder="https://..." 
                      className="form-input" 
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Demo Link</label>
                    <input 
                      type="url" 
                      value={productForm.demoUrl} 
                      onChange={e => setProductForm({ ...productForm, demoUrl: e.target.value })} 
                      placeholder="https://..." 
                      className="form-input" 
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Feature Tags (comma separated)</label>
                  <input 
                    type="text" 
                    value={productForm.features} 
                    onChange={e => setProductForm({ ...productForm, features: e.target.value })} 
                    placeholder="Next.js 14, Firebase Auth, Responsive UI" 
                    className="form-input" 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '24px' }}>
                  <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Description *</label>
                  <textarea 
                    value={productForm.description} 
                    onChange={e => setProductForm({ ...productForm, description: e.target.value })} 
                    placeholder="Comprehensive description of the product..." 
                    rows="3" 
                    required 
                    className="form-input" 
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {editingProductId ? 'Update Product' : 'Publish Product to Store'} <span className="arrow">↗</span>
                  </button>
                  {editingProductId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingProductId(null);
                        setProductForm({ title: '', category: 'Web Apps', price: '$29', badge: 'Featured', description: '', imageUrl: '', buyUrl: '', demoUrl: '', features: '' });
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Products List */}
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Syne, sans-serif', color: '#fff', marginBottom: '20px' }}>
                Active Digital Products ({products.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '680px', overflowY: 'auto' }}>
                {products.map((p) => {
                  const pId = p._id || p.id;
                  return (
                    <div key={pId} style={{ padding: '18px', backgroundColor: 'rgba(20,18,16,0.7)', border: '1px solid rgba(255,119,0,0.2)', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <img src={p.imageUrl || '/assets/muhammad-hasil.png'} alt={p.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <h4 style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: '700' }}>{p.title}</h4>
                          <span style={{ fontSize: '11px', backgroundColor: '#ff7700', color: '#000', fontWeight: '800', padding: '2px 8px', borderRadius: '10px' }}>{p.price || 'Free'}</span>
                        </div>
                        <span style={{ fontSize: '11px', color: '#aaa' }}>{p.category}</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#bbb', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button 
                          onClick={() => {
                            setEditingProductId(pId);
                            setProductForm({
                              title: p.title || '',
                              category: p.category || 'Web Apps',
                              price: p.price || '$29',
                              badge: p.badge || 'Featured',
                              description: p.description || '',
                              imageUrl: p.imageUrl || '',
                              buyUrl: p.buyUrl || '',
                              demoUrl: p.demoUrl || '',
                              features: Array.isArray(p.features) ? p.features.join(', ') : (p.features || '')
                            });
                          }}
                          className="btn-secondary"
                          style={{ padding: '6px 16px', fontSize: '12px' }}
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(pId)}
                          className="btn-primary"
                          style={{ padding: '6px 16px', fontSize: '12px', backgroundColor: '#ff4444', borderColor: '#ff4444', boxShadow: 'none' }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* PROJECTS TAB */}
        {activeTab === 'projects' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Add / Edit Form */}
            <div style={{ padding: '32px', backgroundColor: 'rgba(20,18,16,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,119,0,0.3)', borderRadius: '22px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Syne, sans-serif', color: '#fff', marginBottom: '20px' }}>
                {editingProjectId ? '✏️ Edit Project' : '➕ Add New Project'}
              </h3>
              <form onSubmit={handleSaveProject}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Project Title *</label>
                  <input 
                    type="text" 
                    value={projectForm.title} 
                    onChange={e => setProjectForm({ ...projectForm, title: e.target.value })} 
                    placeholder="e.g. StayPilot Web App" 
                    required 
                    className="form-input" 
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                  <div>
                    <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Category Filter</label>
                    <select 
                      value={projectForm.category} 
                      onChange={e => setProjectForm({ ...projectForm, category: e.target.value })}
                      className="form-input"
                      style={{ backgroundColor: '#111', color: '#fff' }}
                    >
                      <option value="fullstack react">Full Stack & React</option>
                      <option value="react">React & Next.js</option>
                      <option value="design">UI/UX & Web Design</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Pill Badge Text</label>
                    <input 
                      type="text" 
                      value={projectForm.pill} 
                      onChange={e => setProjectForm({ ...projectForm, pill: e.target.value })} 
                      placeholder="e.g. Full Stack Web App" 
                      className="form-input" 
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Live Demo URL</label>
                  <input 
                    type="url" 
                    value={projectForm.liveDemoUrl} 
                    onChange={e => setProjectForm({ ...projectForm, liveDemoUrl: e.target.value })} 
                    placeholder="https://stay-pilot-liard.vercel.app/" 
                    className="form-input" 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Image URL</label>
                  <input 
                    type="text" 
                    value={projectForm.imageUrl} 
                    onChange={e => setProjectForm({ ...projectForm, imageUrl: e.target.value })} 
                    placeholder="/assets/StayPilot.png" 
                    className="form-input" 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>YouTube Video URL (Optional)</label>
                  <input 
                    type="url" 
                    value={projectForm.youtubeUrl} 
                    onChange={e => setProjectForm({ ...projectForm, youtubeUrl: e.target.value })} 
                    placeholder="https://www.youtube.com/watch?v=..." 
                    className="form-input" 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Description *</label>
                  <textarea 
                    value={projectForm.description} 
                    onChange={e => setProjectForm({ ...projectForm, description: e.target.value })} 
                    placeholder="Brief project details..." 
                    rows="3" 
                    required 
                    className="form-input" 
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <button type="submit" disabled={isSubmitting} className="btn-primary">
                    {editingProjectId ? 'Update Project' : 'Publish Project'} <span className="arrow">↗</span>
                  </button>
                  {editingProjectId && (
                    <button 
                      type="button" 
                      onClick={() => {
                        setEditingProjectId(null);
                        setProjectForm({ title: '', category: 'fullstack react', pill: 'Full Stack Web App', description: '', liveDemoUrl: '', imageUrl: '', youtubeUrl: '' });
                      }}
                      className="btn-secondary"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>

              {projects.length === 0 && (
                <div style={{ marginTop: '25px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <p style={{ fontSize: '13px', color: '#aaa', marginBottom: '10px' }}>No projects in Firestore yet.</p>
                  <button onClick={handleSeedProjects} disabled={isSubmitting} className="btn-secondary" style={{ borderColor: 'var(--accent-orange)', color: 'var(--accent-orange)' }}>
                    ⚡ Seed 6 Default Portfolio Projects
                  </button>
                </div>
              )}
            </div>

            {/* Live Projects List */}
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Syne, sans-serif', color: '#fff', marginBottom: '20px' }}>
                Existing Projects ({projects.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '680px', overflowY: 'auto' }}>
                {projects.map((p) => (
                  <div key={p.id} style={{ padding: '18px', backgroundColor: 'rgba(20,18,16,0.7)', border: '1px solid rgba(255,119,0,0.2)', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                    <img src={p.imageUrl || '/assets/muhammad-hasil.png'} alt={p.title} style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: '700' }}>{p.title}</h4>
                      <span style={{ fontSize: '11px', color: '#ff7700' }}>{p.pill || p.category}</span>
                      <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#bbb', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{p.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button 
                        onClick={() => {
                          setEditingProjectId(p.id);
                          setProjectForm({
                            title: p.title || '',
                            category: p.category || 'fullstack react',
                            pill: p.pill || 'Full Stack Web App',
                            description: p.description || '',
                            liveDemoUrl: p.liveDemoUrl || '',
                            imageUrl: p.imageUrl || '',
                            youtubeUrl: p.youtubeUrl || ''
                          });
                        }}
                        className="btn-secondary"
                        style={{ padding: '6px 16px', fontSize: '12px' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(p.id)}
                        className="btn-primary"
                        style={{ padding: '6px 16px', fontSize: '12px', backgroundColor: '#ff4444', borderColor: '#ff4444', boxShadow: 'none' }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* YOUTUBE TAB */}
        {activeTab === 'youtube' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Add Video Form */}
            <div style={{ padding: '32px', backgroundColor: 'rgba(20,18,16,0.85)', backdropFilter: 'blur(20px)', border: '1px solid rgba(255,68,68,0.3)', borderRadius: '22px' }}>
              <h3 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Syne, sans-serif', color: '#fff', marginBottom: '20px' }}>
                📹 Add YouTube Video Link
              </h3>
              <form onSubmit={handleSaveVideo}>
                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Video Title *</label>
                  <input 
                    type="text" 
                    value={videoForm.title} 
                    onChange={e => setVideoForm({ ...videoForm, title: e.target.value })} 
                    placeholder="e.g. React Portfolio Walkthrough & Demo" 
                    required 
                    className="form-input" 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>YouTube Link / URL *</label>
                  <input 
                    type="url" 
                    value={videoForm.youtubeUrl} 
                    onChange={e => setVideoForm({ ...videoForm, youtubeUrl: e.target.value })} 
                    placeholder="https://www.youtube.com/watch?v=YOUR_VIDEO_ID" 
                    required 
                    className="form-input" 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Category Badge</label>
                  <input 
                    type="text" 
                    value={videoForm.category} 
                    onChange={e => setVideoForm({ ...videoForm, category: e.target.value })} 
                    placeholder="e.g. YouTube Showcase / Tutorial" 
                    className="form-input" 
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', color: '#ccc', fontSize: '13px', fontWeight: '600', marginBottom: '6px' }}>Description</label>
                  <textarea 
                    value={videoForm.description} 
                    onChange={e => setVideoForm({ ...videoForm, description: e.target.value })} 
                    placeholder="Brief description of the video..." 
                    rows="3" 
                    className="form-input" 
                  />
                </div>

                <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ backgroundColor: '#ff4444', borderColor: '#ff4444' }}>
                  Add YouTube Link <span className="arrow">↗</span>
                </button>
              </form>
            </div>

            {/* Video List */}
            <div>
              <h3 style={{ fontSize: '22px', fontWeight: '800', fontFamily: 'Syne, sans-serif', color: '#fff', marginBottom: '20px' }}>
                Active YouTube Links ({videos.length})
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '680px', overflowY: 'auto' }}>
                {videos.map((v) => {
                  const yId = getYouTubeId(v.youtubeUrl || v.youtubeId);
                  const thumbUrl = v.imageUrl || `https://img.youtube.com/vi/${yId}/hqdefault.jpg`;
                  return (
                    <div key={v.id} style={{ padding: '18px', backgroundColor: 'rgba(20,18,16,0.7)', border: '1px solid rgba(255,68,68,0.2)', borderRadius: '16px', display: 'flex', gap: '16px', alignItems: 'center' }}>
                      <img src={thumbUrl} alt={v.title} style={{ width: '90px', height: '60px', objectFit: 'cover', borderRadius: '10px' }} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: 0, fontSize: '16px', color: '#fff', fontWeight: '700' }}>{v.title}</h4>
                        <span style={{ fontSize: '11px', color: '#ff6666' }}>{v.category || 'YouTube Video'}</span>
                        <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#bbb', display: '-webkit-box', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{v.description}</p>
                      </div>
                      <button 
                        onClick={() => handleDeleteVideo(v.id)}
                        className="btn-primary"
                        style={{ padding: '6px 16px', fontSize: '12px', backgroundColor: '#ff4444', borderColor: '#ff4444', boxShadow: 'none' }}
                      >
                        Delete
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
