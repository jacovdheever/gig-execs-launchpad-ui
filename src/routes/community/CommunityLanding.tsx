/**
 * CommunityLanding Component
 * Main community feed view with "All" posts
 */

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import CategoryChips from './CategoryChips';
import SortMenu from './SortMenu';
import PostCard from './PostCard';
import NewPostComposer from './NewPostComposer';
import { useFeedFilters } from '@/lib/community.hooks';
import { usePosts } from '@/lib/community.hooks';
import { getCurrentUser } from '@/lib/getCurrentUser';

export default function CommunityLanding() {
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const { filters, updateCategory, updateSort, nextPage, prevPage } = useFeedFilters();
  const { data: feedData, isLoading, error } = usePosts(filters);

  useEffect(() => {
    // Load current user for profile picture
    getCurrentUser().then(setUser => setCurrentUser(setUser));
  }, []);

  const handlePostCreated = () => {
    // Refresh the feed
    window.location.reload();
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-4">Failed to load community posts</div>
        <Button onClick={() => window.location.reload()}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Write Something Input */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center gap-3">
          <Avatar className="w-10 h-10">
            <AvatarImage 
              src={currentUser?.profilePhotoUrl} 
              alt={`${currentUser?.firstName} ${currentUser?.lastName}`}
            />
            <AvatarFallback className="bg-slate-100 text-slate-600 text-sm font-medium">
              {currentUser ? getInitials(currentUser.firstName, currentUser.lastName) : 'U'}
            </AvatarFallback>
          </Avatar>
          <Input
            placeholder="Write something"
            className="flex-1 placeholder:opacity-20"
            onClick={() => setIsComposerOpen(true)}
            readOnly
          />
        </div>
      </div>

      {/* Category and Sort Controls */}
      <div className="flex items-center justify-between">
        <CategoryChips
          selectedCategoryId={filters.categoryId}
          onCategoryChange={updateCategory}
        />
        <SortMenu
          currentSort={filters.sort}
          onSortChange={updateSort}
        />
      </div>

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
            <div className="text-slate-500 mb-4">No posts found</div>
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

      {/* New Post Composer Modal */}
      <NewPostComposer
        isOpen={isComposerOpen}
        onClose={() => setIsComposerOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </div>
  );
}
