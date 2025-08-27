/**
 * CommunityTopic Component
 * Shows posts filtered by a specific category
 */

import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import CategoryChips from './CategoryChips';
import SortMenu from './SortMenu';
import PostCard from './PostCard';
import NewPostComposer from './NewPostComposer';
import { useFeedFilters } from '@/lib/community.hooks';
import { usePosts, useCategories } from '@/lib/community.hooks';
import { useState } from 'react';

export default function CommunityTopic() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  
  const { data: categories } = useCategories();
  const currentCategory = categories?.find(cat => cat.slug === slug);
  
  const { filters, updateCategory, updateSort, nextPage, prevPage } = useFeedFilters(
    currentCategory?.id
  );
  
  const { data: feedData, isLoading, error } = usePosts(filters);

  const handlePostCreated = () => {
    // Refresh the feed
    window.location.reload();
  };

  const handleCategoryChange = (categoryId: number | undefined) => {
    if (categoryId) {
      const category = categories?.find(cat => cat.id === categoryId);
      if (category) {
        navigate(`/community/topic/${category.slug}`);
      }
    } else {
      navigate('/community');
    }
  };

  if (!currentCategory) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Category not found</div>
        <Button onClick={() => navigate('/community')}>Back to Community</Button>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Failed to load category posts</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            {currentCategory.name}
          </h1>
          {currentCategory.description && (
            <p className="text-slate-600">{currentCategory.description}</p>
          )}
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/community')}
          className="flex items-center gap-2"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Community
        </Button>
      </div>

      {/* Category and Sort Controls */}
      <div className="flex items-center justify-between">
        <CategoryChips
          selectedCategoryId={filters.categoryId}
          onCategoryChange={handleCategoryChange}
        />
        <SortMenu
          currentSort={filters.sort}
          onSortChange={updateSort}
        />
      </div>

      {/* New Post Composer */}
      <NewPostComposer
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onPostCreated={handlePostCreated}
      />

      {/* Posts Feed */}
      <div className="space-y-4">
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 animate-pulse">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-slate-200 rounded-full" />
                <div className="flex-1">
                  <div className="h-4 bg-slate-200 rounded w-32 mb-2" />
                  <div className="h-3 bg-slate-200 rounded w-24" />
                </div>
              </div>
              <div className="h-6 bg-slate-200 rounded w-3/4 mb-2" />
              <div className="h-4 bg-slate-200 rounded w-full" />
            </div>
          ))
        ) : feedData?.posts && feedData.posts.length > 0 ? (
          feedData.posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onCommentClick={() => {
                // TODO: Implement comment view
                console.log('Comment clicked for post:', post.id);
              }}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <div className="text-slate-500 mb-4">No posts found in this category</div>
            <Button onClick={() => setIsComposerOpen(true)}>Create the first post</Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {feedData && feedData.total > filters.limit && (
        <div className="flex items-center justify-between bg-white rounded-xl shadow-sm border border-slate-200 p-4">
          <div className="text-sm text-slate-600">
            {filters.page * filters.limit + 1}-{Math.min((filters.page + 1) * filters.limit, feedData.total)} of {feedData.total}
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={prevPage}
              disabled={filters.page === 0}
              className="flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            
            <span className="px-3 py-1 text-sm font-medium text-slate-700">
              {filters.page + 1}
            </span>
            
            <Button
              variant="outline"
              size="sm"
              onClick={nextPage}
              disabled={!feedData.hasMore}
              className="flex items-center gap-1"
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
