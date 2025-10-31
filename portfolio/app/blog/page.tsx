// Blog page

import { getBlogPosts } from '@/lib/mdx';
import { BlogClient } from '@/components/pages/BlogClient';

export const metadata = {
  title: 'Blog',
  description: 'Articles about web development, programming, and software engineering.',
};

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="mb-4">Blog</h1>
          <p className="text-body-large text-foreground/80 max-w-3xl">
            Technical insights, lessons learned, and deep dives into web development,
            programming best practices, and software engineering.
          </p>
        </div>

        {/* Client-side filtering and search */}
        {posts.length > 0 ? (
          <BlogClient posts={posts} />
        ) : (
          <div className="text-center py-12 text-foreground/70">
            No blog posts yet. Check back soon!
          </div>
        )}
      </div>
    </div>
  );
}
