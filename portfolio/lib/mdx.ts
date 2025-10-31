// MDX processing utilities

import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import readingTime from 'reading-time';
import rehypePrettyCode from 'rehype-pretty-code';
import { BlogPost } from '@/types/blog';
import { Project } from '@/types/project';
import { slugSchema } from '@/lib/validation';

const contentDirectory = path.join(process.cwd(), 'content');

// Get all blog posts
export async function getBlogPosts(): Promise<BlogPost[]> {
  const postsDir = path.join(contentDirectory, 'blog');

  // Create directory if it doesn't exist
  if (!fs.existsSync(postsDir)) {
    return [];
  }

  const filenames = fs.readdirSync(postsDir);

  const posts = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith('.mdx'))
      .map(async (filename) => {
        const filePath = path.join(postsDir, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          ...data,
          content,
          readingTime: Math.ceil(readingTime(content).minutes),
        } as BlogPost;
      })
  );

  // Sort by date descending
  return posts.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Get single blog post with serialized MDX
export async function getBlogPost(slug: string): Promise<any | null> {
  try {
    // Validate slug format to prevent path traversal
    slugSchema.parse(slug);

    // Secure path construction
    const blogDir = path.resolve(contentDirectory, 'blog');
    const filePath = path.resolve(blogDir, `${slug}.mdx`);

    // Ensure the resolved path is within the blog directory
    if (!filePath.startsWith(blogDir)) {
      console.error('Path traversal attempt detected in getBlogPost');
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Serialize MDX for rendering
    const mdxSource = await serialize(content, {
      mdxOptions: {
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: 'github-dark',
              onVisitLine(node: any) {
                if (node.children.length === 0) {
                  node.children = [{ type: 'text', value: ' ' }];
                }
              },
            },
          ],
        ],
      },
    });

    return {
      ...data,
      slug,
      content: mdxSource,
      readingTime: Math.ceil(readingTime(content).minutes),
    };
  } catch {
    return null;
  }
}

// Get all projects
export async function getProjects(): Promise<Project[]> {
  const projectsDir = path.join(contentDirectory, 'projects');

  // Create directory if it doesn't exist
  if (!fs.existsSync(projectsDir)) {
    return [];
  }

  const filenames = fs.readdirSync(projectsDir);

  const projects = await Promise.all(
    filenames
      .filter((filename) => filename.endsWith('.mdx'))
      .map(async (filename) => {
        const filePath = path.join(projectsDir, filename);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const { data, content } = matter(fileContents);

        return {
          ...data,
          slug: filename.replace(/\.mdx$/, ''),
          content,
        } as any;
      })
  );

  // Sort by date descending
  return projects.sort((a, b) =>
    new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

// Get single project with serialized MDX
export async function getProject(slug: string): Promise<any | null> {
  try {
    // Validate slug format to prevent path traversal
    slugSchema.parse(slug);

    // Secure path construction
    const projectsDir = path.resolve(contentDirectory, 'projects');
    const filePath = path.resolve(projectsDir, `${slug}.mdx`);

    // Ensure the resolved path is within the projects directory
    if (!filePath.startsWith(projectsDir)) {
      console.error('Path traversal attempt detected in getProject');
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Serialize MDX for rendering
    const mdxSource = await serialize(content, {
      mdxOptions: {
        rehypePlugins: [
          [
            rehypePrettyCode,
            {
              theme: 'github-dark',
            },
          ],
        ],
      },
    });

    return {
      ...data,
      slug,
      content: mdxSource,
    };
  } catch {
    return null;
  }
}

// Get featured projects
export async function getFeaturedProjects(): Promise<Project[]> {
  const projects = await getProjects();
  return projects.filter((project) => project.featured);
}

// Get blog posts by tag
export async function getBlogPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await getBlogPosts();
  return posts.filter((post) => post.tags.includes(tag));
}

// Get experience data
export function getExperience() {
  const experiencePath = path.join(contentDirectory, 'data', 'experience.json');
  const fileContents = fs.readFileSync(experiencePath, 'utf8');
  return JSON.parse(fileContents);
}

// Get skills data
export function getSkills() {
  const skillsPath = path.join(contentDirectory, 'data', 'skills.json');
  const fileContents = fs.readFileSync(skillsPath, 'utf8');
  return JSON.parse(fileContents);
}
