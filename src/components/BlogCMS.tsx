import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { INITIAL_BLOGS } from '../data';
import { analytics } from '../utils/analytics';
import { 
  BookOpen, Plus, Tag, Calendar, Clock, Edit2, Trash2, Check, 
  ChevronRight, ArrowLeft, Eye, EyeOff, LayoutGrid, Sliders, AlertCircle, FileText
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'figure_out_blogs';

export default function BlogCMS() {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [selectedPostId, setSelectedPostId] = useState<string | null>(null);
  
  // Administrative Switch State
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  
  // Form Creator states
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState('Design & UX');
  const [tagsInput, setTagsInput] = useState('');
  const [readTime, setReadTime] = useState('5 min read');
  const [coverGradientId, setCoverGradientId] = useState(0);

  const [formError, setFormError] = useState<string | null>(null);

  // Active Category filter
  const [activeCategoryFilter, setActiveCategoryFilter] = useState('all');

  const coverGradients = [
    'linear-gradient(135deg, #ec4899 0%, #be185d 100%)', // Pink
    'linear-gradient(135deg, #14b8a6 0%, #0d9488 100%)', // Teal
    'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Amber
    'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)', // Purple
    'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', // Blue
  ];

  // Load initial blogs
  useEffect(() => {
    try {
      const persisted = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (persisted) {
        setBlogs(JSON.parse(persisted));
      } else {
        setBlogs(INITIAL_BLOGS);
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(INITIAL_BLOGS));
      }
    } catch {
      setBlogs(INITIAL_BLOGS);
    }
  }, []);

  const saveBlogsToStorage = (updated: BlogPost[]) => {
    setBlogs(updated);
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to storage blogs', e);
    }
  };

  const handleOpenPost = (id: string) => {
    // Prevent opening when in admin editing screens
    if (showForm || editingPost) return;
    setSelectedPostId(id);
    analytics.trackClick(`blog-view-${id}`, id);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTogglePublish = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = blogs.map((p) => {
      if (p.id === id) {
        const nextVal = !p.published;
        analytics.trackClick(`cms-toggle-publish-${id}`, nextVal ? 'Publish' : 'Unpublish');
        return { ...p, published: nextVal };
      }
      return p;
    });
    saveBlogsToStorage(updated);
  };

  const handleDeletePost = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to permanently delete this blog post from the CMS?')) return;
    
    const updated = blogs.filter((p) => p.id !== id);
    saveBlogsToStorage(updated);
    analytics.trackClick(`cms-delete-${id}`, id);
    if (selectedPostId === id) setSelectedPostId(null);
  };

  const handleEditClick = (post: BlogPost, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingPost(post);
    setTitle(post.title);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setCategory(post.category);
    setTagsInput(post.tags.join(', '));
    setReadTime(post.readTime);
    
    // Attempt to match gradient index or default
    const idx = coverGradients.indexOf(post.coverImage);
    setCoverGradientId(idx !== -1 ? idx : 0);
    
    setShowForm(true);
    analytics.trackClick(`cms-edit-open-${post.id}`, post.id);
  };

  const handleSavePost = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validation checks
    if (!title.trim() || title.trim().length < 5) {
      setFormError('Blog headers requires a title (minimum 5 characters).');
      return;
    }
    if (!excerpt.trim() || excerpt.trim().length < 15) {
      setFormError('An article summary excerpt is required (minimum 15 characters).');
      return;
    }
    if (!content.trim() || content.trim().length < 50) {
      setFormError('The main article content body needs to be thorough (minimum 50 characters).');
      return;
    }

    const cleanTags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t !== '');

    if (editingPost) {
      // Editing existing blog post
      const updated = blogs.map((p) => {
        if (p.id === editingPost.id) {
          return {
            ...p,
            title,
            excerpt,
            content,
            category,
            tags: cleanTags,
            readTime,
            coverImage: coverGradients[coverGradientId],
          };
        }
        return p;
      });
      saveBlogsToStorage(updated);
      analytics.trackClick(`cms-edit-save-${editingPost.id}`, editingPost.id);
      setEditingPost(null);
    } else {
      // Creating a new blog post
      const newPost: BlogPost = {
        id: `blog-${Date.now()}`,
        title,
        excerpt,
        content,
        category,
        date: new Date().toISOString().split('T')[0],
        readTime,
        coverImage: coverGradients[coverGradientId],
        tags: cleanTags.length > 0 ? cleanTags : ['Dev'],
        published: true,
      };
      saveBlogsToStorage([newPost, ...blogs]);
      analytics.trackClick('cms-create-save', title);
    }

    // Reset Form
    setTitle('');
    setExcerpt('');
    setContent('');
    setTagsInput('');
    setReadTime('5 min read');
    setShowForm(false);
  };

  const handleAddPostClick = () => {
    setEditingPost(null);
    setTitle('');
    setExcerpt('');
    setContent('');
    setCategory('Design & UX');
    setTagsInput('');
    setReadTime('5 min read');
    setCoverGradientId(0);
    setFormError(null);
    setShowForm(true);
    analytics.trackClick('cms-open-add-form', 'New Block');
  };

  const activePost = blogs.find((p) => p.id === selectedPostId) || null;

  // Filter criteria
  const filteredBlogs = blogs.filter((b) => {
    const isPublished = isAdminMode ? true : b.published;
    const matchesCategory = activeCategoryFilter === 'all' ? true : b.category === activeCategoryFilter;
    return isPublished && matchesCategory;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 mt-20" id="blog-section-main">
      {/* Blog and CMS Controls Action Headers Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-12 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-8">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-[#0fb58c] bg-[#0fb58c]/5 px-3 py-1 rounded-full border border-[#0fb58c]/15">
            Technical Insights
          </span>
          <h1 className="font-sans text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white mt-2.5">
            Figure Out Blog
          </h1>
          <p className="text-zinc-550 dark:text-zinc-450 text-xs mt-1">
            Browse our insights about Decoupled architecture, micro-interactions, speed diagnostics, and modular UI patterns.
          </p>
        </div>

        {/* Administration switcher */}
        <div className="flex items-center gap-3" id="cms-control-triggers">
          <button
            id="admin-mode-toggle-btn"
            onClick={() => {
              setIsAdminMode(!isAdminMode);
              setSelectedPostId(null);
              analytics.trackClick('cms-admin-mode-toggle', !isAdminMode ? 'Admin On' : 'Admin Off');
            }}
            className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-sans font-bold rounded-xl border transition-all cursor-pointer ${
              isAdminMode 
                ? 'bg-zinc-900 border-zinc-900 text-white dark:bg-white dark:border-white dark:text-zinc-950 shadow-sm' 
                : 'bg-white border-zinc-200 dark:bg-zinc-950 dark:border-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" /> 
            {isAdminMode ? 'Disable Admin Suite' : 'Enter Blog CMS'}
          </button>

          {isAdminMode && !showForm && (
            <button
              id="cms-write-post-btn"
              onClick={handleAddPostClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-sans font-bold text-white bg-[#0fb58c] hover:bg-teal-600 rounded-xl shadow-sm cursor-pointer hover:shadow"
            >
              <Plus className="h-3.5 w-3.5" /> Write Article
            </button>
          )}
        </div>
      </div>

      {activePost ? (
        /* Immersive Public Blog Reader view */
        <div className="max-w-3xl mx-auto" id="blog-reader-pane">
          <button
            id="exit-reader-btn"
            onClick={() => {
              setSelectedPostId(null);
              analytics.trackClick('exit-blog-reader', 'Back');
            }}
            className="flex items-center gap-2 mb-6 group text-xs font-semibold text-zinc-550 hover:text-zinc-950 dark:text-zinc-400 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Back to Articles
          </button>

          {/* Cover gradient */}
          <div
            className="w-full h-56 sm:h-72 rounded-2xl p-8 sm:p-12 mb-8 relative overflow-hidden flex flex-col justify-end text-white shadow-md"
            style={{ background: activePost.coverImage }}
            id="reader-cover-canvas"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
            <div className="relative z-10 space-y-2.5">
              <span className="font-mono text-[10px] uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                {activePost.category}
              </span>
              <h1 className="font-sans text-xl sm:text-3xl font-bold leading-tight">
                {activePost.title}
              </h1>
            </div>
          </div>

          {/* Sub line logs */}
          <div className="flex flex-wrap items-center gap-4 text-xs text-zinc-450 dark:text-zinc-500 mb-8 border-b border-zinc-200/50 dark:border-zinc-800/50 pb-4">
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-[#0fb58c]" /> {new Date(activePost.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#0fb58c]" /> {activePost.readTime}
            </span>
          </div>

          {/* Main paragraphs */}
          <div className="prose dark:prose-invert max-w-none text-zinc-700 dark:text-zinc-305 text-sm leading-relaxed space-y-5" id="reader-body-paragraphs">
            {activePost.content.split('\n\n').map((para, idx) => {
              if (para.startsWith('###')) {
                return (
                  <h3 key={idx} className="font-sans text-lg font-bold text-zinc-900 dark:text-white pt-3">
                    {para.replace('###', '').trim()}
                  </h3>
                );
              }
              if (para.startsWith('-')) {
                return (
                  <ul key={idx} className="list-disc pl-5 space-y-2 font-sans py-2.5">
                    {para.split('\n').map((li, lidx) => (
                      <li key={lidx}>{li.replace('-', '').trim()}</li>
                    ))}
                  </ul>
                );
              }
              const boldRegex = /\*\*(.*?)\*\*/g;
              const hasBold = boldRegex.test(para);
              if (hasBold) {
                // Re-test to process
                const formatted = para.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/`(.*?)`/g, '<code class="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 font-mono text-rose-500">$1</code>');
                return (
                  <p key={idx} className="font-sans" dangerouslySetInnerHTML={{ __html: formatted }} />
                );
              }

              return <p key={idx} className="font-sans">{para}</p>;
            })}
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-1.5 mt-10 pt-6 border-t border-zinc-250 dark:border-zinc-801/50">
            {activePost.tags.map((tag) => (
              <span
                key={tag}
                className="font-mono text-[10px] px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-800/80 text-zinc-550 dark:text-zinc-400 border border-zinc-200/50 dark:border-zinc-700/50"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      ) : showForm && isAdminMode ? (
        /* CMS Create / Edit Blog Post Screen */
        <div className="max-w-2xl mx-auto p-6 sm:p-8 bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-md" id="cms-editor-panel">
          <div className="flex items-center justify-between mb-6 border-b border-zinc-200 dark:border-zinc-800 pb-4">
            <h2 className="font-sans text-sm font-bold text-zinc-900 dark:text-white flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#0fb58c]" /> 
              {editingPost ? `Edit Article: [${editingPost.title}]` : 'Architect New Blog Post'}
            </h2>
            <button
              id="cms-cancel-write-btn"
              onClick={() => setShowForm(false)}
              className="text-xs text-zinc-400 hover:text-zinc-900 dark:hover:text-white cursor-pointer"
            >
              Cancel
            </button>
          </div>

          <form onSubmit={handleSavePost} className="space-y-4">
            {formError && (
              <div className="p-3 bg-rose-500/10 text-rose-500 text-xs font-semibold rounded-lg flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" />
                {formError}
              </div>
            )}

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                Article Title Headline
              </label>
              <input
                id="cms-form-title"
                type="text"
                placeholder="e.g. 5 Performance Strategies for React v19"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-20d dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                Short excerpt summary
              </label>
              <input
                id="cms-form-excerpt"
                type="text"
                placeholder="A compelling single sentence summaries of article contents."
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  id="cms-form-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-20d dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Design & UX">Design & UX</option>
                  <option value="SEO & Performance">SEO & Performance</option>
                  <option value="Dev Architecture">Dev Architecture</option>
                  <option value="E-Commerce">E-Commerce</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                  Read Time Metric
                </label>
                <input
                  id="cms-form-readtime"
                  type="text"
                  placeholder="e.g. 5 min read"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-202 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                  Tags (comma separated)
                </label>
                <input
                  id="cms-form-tags"
                  type="text"
                  placeholder="React, Next, SEO, WebVitals"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            {/* Backdrop Visual Gradient Selector */}
            <div>
              <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1.5">
                Backdrop theme gradient
              </label>
              <div className="flex gap-2">
                {coverGradients.map((grad, gidx) => (
                  <button
                    key={gidx}
                    id={`cms-cover-theme-${gidx}-btn`}
                    type="button"
                    onClick={() => setCoverGradientId(gidx)}
                    className={`h-10 flex-1 rounded-xl cursor-pointer transition-all border ${
                      coverGradientId === gidx ? 'scale-105 border-[#0fb58c] ring-2 ring-[#0fb58c]/25' : 'border-transparent'
                    }`}
                    style={{ background: grad }}
                  />
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider mb-1">
                Article content body (Supports double-return spacing)
              </label>
              <textarea
                id="cms-form-content"
                rows={12}
                placeholder="Write paragraphs. Use Double-enter break to space items. Prefix lines with ### to create a sectional header, or - to start a bulletin list."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl px-3.5 py-2.5 text-xs text-zinc-900 dark:text-white font-sans focus:outline-none focus:border-emerald-500 resize-none"
              />
            </div>

            <button
              id="cms-save-post-btn"
              type="submit"
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 font-sans font-bold text-xs text-white rounded-xl shadow-md transition-all cursor-pointer"
            >
              {editingPost ? 'Publish Edited Content updates' : 'Publish Article Live'}
            </button>
          </form>
        </div>
      ) : isAdminMode ? (
        /* CMS Administrative Post Management Grid */
        <div className="space-y-4" id="cms-admin-posts-table">
          <div className="p-3.5 bg-zinc-50 dark:bg-zinc-900 border border-amber-500/20 text-sky-500 rounded-xl text-xs flex items-center justify-between">
            <span className="font-sans font-semibold text-zinc-650 dark:text-zinc-300">
              Logged in: Figure Out Content Manager Panel
            </span>
            <span className="font-mono text-[10px] font-bold bg-[#0fb58c]/10 text-[#0fb58c] px-2 py-0.5 rounded">
              Total logs: {blogs.length} articles
            </span>
          </div>

          <div className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden bg-zinc-50 dark:bg-zinc-900 divide-y divide-zinc-200 dark:divide-zinc-800">
            {blogs.map((b) => (
              <div
                key={b.id}
                id={`cms-post-row-${b.id}`}
                className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-100/50 dark:hover:bg-zinc-950/20"
              >
                <div className="flex items-center gap-4">
                  {/* Miniature Cover Thumbnail */}
                  <div className="w-12 h-12 rounded-lg shrink-0" style={{ background: b.coverImage }} />
                  <div>
                    <h3 className="font-sans text-sm font-bold text-zinc-900 dark:text-white">
                      {b.title}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-[10px] text-zinc-450 dark:text-zinc-500 mt-1">
                      <span>{b.category}</span>
                      <span>•</span>
                      <span>{b.date}</span>
                      <span>•</span>
                      <span className="inline-flex items-center gap-0.5 text-[#0fb58c]">
                        {b.published ? (
                          <>
                            <Eye className="h-3 w-3" /> Live
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3 w-3 text-zinc-400" /> Draft
                          </>
                        )}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 justify-end">
                  <button
                    id={`cms-edit-${b.id}-btn`}
                    onClick={(e) => handleEditClick(b, e)}
                    className="p-2 border border-zinc-200 dark:border-zinc-800 text-zinc-600 hover:text-emerald-500 hover:border-emerald-500/40 dark:text-zinc-400 rounded-lg bg-white dark:bg-zinc-950 cursor-pointer"
                    title="Edit Post"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </button>
                  <button
                    id={`cms-toggle-publish-${b.id}-btn`}
                    onClick={(e) => handleTogglePublish(b, e)}
                    className={`p-2 border rounded-lg cursor-pointer ${
                      b.published 
                        ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500' 
                        : 'border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 text-zinc-450'
                    }`}
                    title={b.published ? 'Take Offline (Unpublish)' : 'Publish Live'}
                  >
                    <Check className="h-3.5 w-3.5" />
                  </button>
                  <button
                    id={`cms-delete-${b.id}-btn`}
                    onClick={(e) => handleDeletePost(b, e)}
                    className="p-2 border border-zinc-200 dark:border-zinc-800 text-rose-500 hover:bg-rose-500/10 rounded-lg bg-white dark:bg-zinc-950 cursor-pointer"
                    title="Delete Post"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        /* Regular Interactive Blog Stream Feed view */
        <div className="space-y-8" id="blog-regular-feed">
          {/* Quick categories navigation switches */}
          <div className="flex items-center justify-between p-3.5 bg-zinc-50 dark:bg-zinc-950 border border-zinc-205 dark:border-zinc-805 rounded-2xl">
            <div className="flex items-center gap-2">
              <LayoutGrid className="h-4 w-4 text-zinc-400" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-400 font-bold">
                Insight filters
              </span>
            </div>

            <div className="flex flex-wrap gap-1">
              {['all', 'Design & UX', 'SEO & Performance', 'Dev Architecture'].map((cat) => (
                <button
                  key={cat}
                  id={`blog-category-${cat.toLowerCase().replace(/[^a-z0-9]/g, '-')}-btn`}
                  onClick={() => {
                    setActiveCategoryFilter(cat);
                    analytics.trackClick(`blog-filter-${cat}`, cat);
                  }}
                  className={`px-3 py-1.5 rounded-xl font-sans text-xs font-semibold cursor-pointer transition-all ${
                    activeCategoryFilter === cat
                      ? 'bg-zinc-955 dark:bg-white text-white dark:text-zinc-950 shadow-sm'
                      : 'text-zinc-550 hover:text-zinc-950 hover:bg-zinc-100 dark:hover:bg-zinc-900'
                  }`}
                >
                  {cat === 'all' ? 'All Insights' : cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8" id="blog-cards-grid">
            {filteredBlogs.length === 0 ? (
              <div className="p-12 text-center col-span-3 bg-zinc-50 dark:bg-zinc-905 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
                <p className="text-zinc-450 font-sans text-xs">
                  No published articles found matching this selector. Enter CMS mode to draft new content.
                </p>
              </div>
            ) : (
              filteredBlogs.map((post) => (
                <article
                  key={post.id}
                  id={`blog-card-${post.id}`}
                  onClick={() => handleOpenPost(post.id)}
                  className="group bg-zinc-50 dark:bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 hover:border-emerald-500/30 shadow-none hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
                >
                  {/* Header visual gradient */}
                  <div
                    className="h-40 relative flex flex-col justify-between p-5 text-white"
                    style={{ background: post.coverImage }}
                  >
                    <div className="absolute inset-0 bg-black/10 mix-blend-overlay" />
                    <div>
                      <span className="relative z-10 font-mono text-[9px] uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                        {post.category}
                      </span>
                    </div>

                    <div className="relative z-10 font-mono text-[9px] text-white/90">
                      Published • {new Date(post.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    </div>
                  </div>

                  {/* Body textual information */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <div>
                      <h3 className="font-sans text-base font-bold text-zinc-900 dark:text-white group-hover:text-emerald-500 transition-colors line-clamp-2 leading-tight mb-2.5">
                        {post.title}
                      </h3>
                      <p className="text-zinc-550 dark:text-zinc-400 text-xs line-clamp-3 leading-relaxed mb-4">
                        {post.excerpt}
                      </p>
                    </div>

                    {/* Bottom stats line */}
                    <div className="pt-3.5 border-t border-zinc-100 dark:border-zinc-800 flex items-center justify-between text-[11px] text-zinc-400">
                      <span className="flex items-center gap-1 font-mono">
                        <Clock className="h-3 w-3 text-emerald-500" /> {post.readTime}
                      </span>
                      <span className="font-sans font-semibold text-zinc-905 dark:text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                        Read Story <ChevronRight className="h-3.5 w-3.5 text-[#f9a007]" />
                      </span>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
