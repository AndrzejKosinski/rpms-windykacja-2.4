import React from 'react';
import dynamic from 'next/dynamic';
import { useCMSStore } from '../store/cmsStore';

// UI Components (Dynamic for performance)
const CMSOverview = dynamic(() => import('./cms/CMSOverview').then(mod => mod.CMSOverview));
const BlogList = dynamic(() => import('./cms/BlogList').then(mod => mod.BlogList));
const ImagePickerModal = dynamic(() => import('./cms/ImagePickerModal').then(mod => mod.ImagePickerModal), { ssr: false });
const AIReviewModal = dynamic(() => import('./cms/AIReviewModal').then(mod => mod.AIReviewModal), { ssr: false });
const DeleteConfirmModal = dynamic(() => import('./cms/DeleteConfirmModal').then(mod => mod.DeleteConfirmModal), { ssr: false });
const PagesListSection = dynamic(() => import('./cms/PagesListSection').then(mod => mod.PagesListSection));
const CompanyInfoSection = dynamic(() => import('./cms/CompanyInfoSection').then(mod => mod.CompanyInfoSection));
const HomePageManager = dynamic(() => import('./cms/HomePageManager').then(mod => mod.HomePageManager));
const NavFooterManager = dynamic(() => import('./cms/NavFooterManager').then(mod => mod.NavFooterManager));
const SEOSettingsManager = dynamic(() => import('./cms/SEOSettingsManager').then(mod => mod.SEOSettingsManager));
const SEOPreview = dynamic(() => import('./cms/SEOPreview').then(mod => mod.SEOPreview));

// Dynamiczne ładowanie ciężkich edytorów dla optymalizacji panelu
const BlogPostEditor = dynamic(() => import('./cms/BlogPostEditor').then(mod => mod.BlogPostEditor), {
  loading: () => (
    <div className="h-[600px] flex flex-col items-center justify-center bg-slate-900/50 rounded-[var(--radius-brand-card)] border border-slate-800 animate-pulse">
      <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Ładowanie edytora artykułu...</p>
    </div>
  ),
  ssr: false
});

const PageEditorSection = dynamic(() => import('./cms/PageEditorSection').then(mod => mod.PageEditorSection), {
  loading: () => (
    <div className="h-[600px] flex flex-col items-center justify-center bg-slate-900/50 rounded-[var(--radius-brand-card)] border border-slate-800 animate-pulse">
      <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin mb-4"></div>
      <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Ładowanie edytora podstrony...</p>
    </div>
  ),
  ssr: false
});

const CMSManager: React.FC = () => {
  const logic = useCMSStore();
  const {
    localContent,
    activeSection,
    setActiveSection,
    activePostIdx,
    showImagePicker,
    setShowImagePicker,
    showAIReview,
    setShowAIReview,
    showDeleteConfirm,
    setShowDeleteConfirm,
    handleAddBlogPost,
    handleDeleteBlogPost,
    confirmDeleteBlogPost,
    searchUnsplash,
    selectUnsplashImage,
    applyAIChanges
  } = logic;

  // Helper for rendering Google SEO preview
  const renderSEOPreview = (title: string, description: string) => (
    <SEOPreview title={title} description={description} />
  );

  return (
    <>
      <div className="animate-in fade-in duration-500 bg-[#020617]">
        <div className="px-8 pb-12">
          <div className="w-full mx-auto space-y-10">
          {/* Overview Section */}
            {activeSection === 'overview' && (
              <CMSOverview 
                blogPosts={localContent.blog}
                setActiveSection={setActiveSection}
                setActivePostIdx={logic.setActivePostIdx}
                handleAddBlogPost={handleAddBlogPost}
              />
            )}

            {/* Company Info Section */}
            {activeSection === 'company-info' && (
              <CompanyInfoSection 
                data={localContent.companyInfo}
                onChange={(field, value, subSection) => logic.handleFieldChange('companyInfo', field, value, subSection)}
              />
            )}

            {/* Consolidated Home Page Section */}
            {activeSection === 'home-page' && (
              <HomePageManager 
                localContent={localContent}
                handleFieldChange={logic.handleFieldChange}
              />
            )}

            {/* Consolidated Nav & Footer Section */}
            {activeSection === 'nav-footer' && (
              <NavFooterManager 
                localContent={localContent}
                handleFieldChange={logic.handleFieldChange}
              />
            )}

            {/* Consolidated SEO Settings Section */}
            {activeSection === 'seo-settings' && (
              <SEOSettingsManager 
                localContent={localContent}
                handleFieldChange={logic.handleFieldChange}
              />
            )}

            {/* Blog Posts List */}
            {activeSection === 'blog-list' && (
              <BlogList 
                posts={localContent.blog}
                searchQuery={logic.blogSearchQuery}
                setSearchQuery={logic.setBlogSearchQuery}
                statusFilter={logic.blogStatusFilter}
                setStatusFilter={logic.setBlogStatusFilter}
                selectedPosts={logic.selectedPosts}
                setSelectedPosts={logic.setSelectedPosts}
                onAddPost={handleAddBlogPost}
                onEditPost={(idx) => {
                  logic.setActivePostIdx(idx);
                  logic.setActiveSection(`blog-${idx}`);
                }}
                onDeletePost={handleDeleteBlogPost}
                onBulkStatusChange={logic.handleBulkStatusChange}
                onBulkDelete={logic.handleBulkDeleteClick}
              />
            )}

            {/* Pages List */}
            {activeSection === 'pages-list' && (
              <PagesListSection 
                pages={localContent.pages || []}
                searchQuery={logic.pageSearchQuery}
                setSearchQuery={logic.setPageSearchQuery}
                statusFilter={logic.pageStatusFilter}
                setStatusFilter={logic.setPageStatusFilter}
                selectedPages={logic.selectedPages}
                setSelectedPages={logic.setSelectedPages}
                onAddPage={logic.handleAddPage}
                onEditPage={(idx) => {
                  logic.setActivePageIdx(idx);
                  logic.setActiveSection(`page-${idx}`);
                }}
                onDeletePage={logic.handleDeletePage}
                onBulkStatusChange={logic.handleBulkPageStatusChange}
                onBulkDelete={logic.handleBulkPageDeleteClick}
              />
            )}

            {/* Individual Page Editor */}
            {activeSection.startsWith('page-') && logic.activePageIdx !== null && localContent.pages && (
              <PageEditorSection 
                page={localContent.pages[logic.activePageIdx]}
                onChange={(field, value, isSeo) => logic.handlePageChange(logic.activePageIdx!, field, value, isSeo)}
                onBack={() => logic.setActiveSection('pages-list')}
              />
            )}

            {/* Individual Blog Post Editor */}
            {activeSection.startsWith('blog-') && activeSection !== 'blog-list' && activePostIdx !== null && (
              <BlogPostEditor 
                post={localContent.blog[activePostIdx]}
                index={activePostIdx}
                previewMode={logic.previewMode}
                setPreviewMode={logic.setPreviewMode}
                editorTab={logic.editorTab}
                setEditorTab={logic.setEditorTab}
                isOptimizing={logic.isOptimizing}
                onFieldChange={logic.handleBlogChange}
                onDelete={handleDeleteBlogPost}
                onAIOptimize={logic.handleAIOptimize}
                onOpenImagePicker={(idx) => {
                  logic.setActivePostIdx(idx);
                  setShowImagePicker(true);
                  searchUnsplash();
                }}
                renderSEOPreview={renderSEOPreview}
                onBack={() => logic.setActiveSection('blog-list')}
              />
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <ImagePickerModal 
        isOpen={showImagePicker}
        onClose={() => setShowImagePicker(false)}
        query={logic.unsplashQuery}
        setQuery={logic.setUnsplashQuery}
        onSearch={searchUnsplash}
        results={logic.unsplashResults}
        isSearching={logic.isSearchingImages}
        onSelect={selectUnsplashImage}
      />

      <AIReviewModal 
        isOpen={showAIReview}
        onClose={() => setShowAIReview(false)}
        data={logic.aiReviewData}
        currentPost={activePostIdx !== null ? localContent.blog[activePostIdx] : null}
        selectedFields={logic.selectedAIFields}
        setSelectedFields={logic.setSelectedAIFields}
        onApply={applyAIChanges}
      />

      <DeleteConfirmModal 
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDeleteBlogPost}
        title={
          logic.isBulkDelete ? `zaznaczone artykuły (${logic.selectedPosts.length})` :
          logic.isBulkPageDelete ? `zaznaczone podstrony (${logic.selectedPages.length})` :
          logic.postToDeleteIdx !== null ? (localContent.blog[logic.postToDeleteIdx]?.title || 'ten artykuł') :
          logic.pageToDeleteIdx !== null ? (localContent.pages?.[logic.pageToDeleteIdx]?.title || 'tę podstronę') :
          'ten element'
        }
      />
    </>
  );
};

export default CMSManager;
