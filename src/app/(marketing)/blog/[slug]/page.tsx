import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPostBySlug, getAllPostSlugs, getRelatedPosts } from '../../../../services/cmsRepository';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, User, ChevronRight, FileText } from 'lucide-react';
import { TableOfContents } from './TableOfContents';
import { SidebarBanners } from './SidebarBanners';

const extractText = (children: any): string => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(extractText).join('');
  if (children && typeof children === 'object' && children.props && children.props.children) {
    return extractText(children.props.children);
  }
  return '';
};

const generateId = (text: string) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-a-ząćęłńóśźż]/g, '');
};

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs();
  return slugs;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  
  if (!post) return { title: 'Post nie znaleziony' };

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
    alternates: {
      canonical: `/blog/${slug}`,
    },
    openGraph: {
      title: post.seo?.title || post.title,
      description: post.seo?.description || post.excerpt,
      images: [post.image],
      type: 'article',
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const relatedPosts = await getRelatedPosts(slug, post.category);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      "headline": post.title,
      "image": [post.image],
      "datePublished": post.publishedAt || post.date,
      "author": [{
        "@type": "Person",
        "name": post.author
      }],
      "description": post.seo?.description || post.excerpt
    },
    ...(post.faqs ? [{
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": post.faqs.map((faq: any) => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    }] : []),
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Strona główna",
          "item": "https://rpms.pl"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Blog",
          "item": "https://rpms.pl/blog"
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": post.title,
          "item": `https://rpms.pl/blog/${post.slug || post.id}`
        }
      ]
    }
  ];

  const headings = Array.from(post.content.matchAll(/^(#{2,3})\s+(.+)$/gm)).map((match: any) => ({
    level: match[1].length,
    text: match[2].replace(/[*_~`]/g, ''),
    id: generateId(match[2].replace(/[*_~`]/g, ''))
  }));

  return (
    <main className="min-h-screen pt-32 pb-24 bg-white animate-in fade-in duration-500">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-7xl mx-auto px-6">
        {/* Back Link */}
        <Link 
          href="/blog" 
          className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-12 hover:text-brand-blue transition-colors group"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
          Powrót do Bazy Wiedzy
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
          {/* Left Column */}
          <div className="lg:col-span-8">
            <article>
              <header className="mb-12">
                {post.category && (
                  <span className="inline-block px-3 py-1 bg-brand-light-blue text-brand-blue text-[11px] font-black rounded-full mb-6 uppercase tracking-widest">
                    {post.category}
                  </span>
                )}
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-brand-navy mb-8 leading-tight tracking-tight">
                  {post.title}
                </h1>
                
                <div className="flex flex-wrap items-center gap-6 text-slate-400 font-bold text-sm border-y border-slate-100 py-6 mb-12">
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-brand-blue" /> 
                    {post.author}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} /> 
                    {post.date}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} /> 
                    {post.readTime} czytania
                  </div>
                </div>

                <div className="relative h-[400px] md:h-[500px] w-full rounded-[var(--radius-brand-card)] overflow-hidden shadow-2xl mb-12 bg-slate-100 flex items-center justify-center">
                  {(post.image || post.imageUrl) ? (
                    <Image 
                      src={post.image || post.imageUrl || ""} 
                      alt={post.imageAlt || post.title} 
                      fill
                      sizes="(max-width: 1200px) 100vw, 800px"
                      className="object-cover"
                      referrerPolicy="no-referrer"
                      priority
                    />
                  ) : (
                    <FileText size={64} className="text-slate-300" />
                  )}
                </div>
              </header>

              <div className="prose prose-lg md:prose-xl prose-slate max-w-none mb-20">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkBreaks]}
                  components={{
                    h1: 'h2',
                    h2: ({node, ...props}) => {
                      const text = extractText(props.children);
                      const id = generateId(text);
                      return <h2 id={id} {...props} />;
                    },
                    h3: ({node, ...props}) => {
                      const text = extractText(props.children);
                      const id = generateId(text);
                      return <h3 id={id} {...props} />;
                    }
                  }}
                >
                  {post.content}
                </ReactMarkdown>
              </div>

              {/* Sekcja FAQ */}
              {post.faqs && post.faqs.length > 0 && (
                <div className="mb-20 animate-in slide-in-from-bottom-10 duration-700">
                  <h2 className="text-3xl font-black text-brand-navy mb-8 flex items-center gap-3">
                    <span className="w-8 h-8 bg-brand-blue/10 text-brand-blue rounded-[var(--radius-brand-input)] flex items-center justify-center text-sm">?</span>
                    Często zadawane pytania
                  </h2>
                  <div className="space-y-4">
                    {post.faqs.map((faq: any, idx: number) => (
                      <div key={idx} className="bg-slate-50 rounded-[var(--radius-brand-button)] p-6 border border-slate-100 hover:border-brand-blue/30 transition-colors">
                        <h4 className="text-lg font-black text-brand-navy mb-3">{faq.question}</h4>
                        <p className="text-slate-500 font-medium leading-relaxed">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mobile Banners */}
              <div className="lg:hidden mb-12">
                <SidebarBanners />
              </div>
            </article>
          </div>

          {/* Right Column - Sidebar */}
          <aside className="lg:col-span-4 hidden lg:block sticky top-32 self-start z-20">
            <div className="flex flex-col gap-12">
              <SidebarBanners />
              <TableOfContents headings={headings} />
            </div>
          </aside>
        </div>

        {/* Powiązane artykuły */}
        {relatedPosts.length > 0 && (
          <div className="mt-24 pt-24 border-t border-slate-100">
            <h2 className="text-3xl font-black text-brand-navy mb-12">Powiązane artykuły</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost: any) => (
                <Link 
                  key={relatedPost.id} 
                  href={`/blog/${relatedPost.slug || relatedPost.id}`}
                  className="group bg-white rounded-[var(--radius-brand-card)] overflow-hidden border border-slate-100 hover:border-brand-blue/30 transition-all hover:shadow-xl"
                >
                  <div className="relative h-48 w-full bg-slate-100 flex items-center justify-center">
                    {(relatedPost.image || relatedPost.imageUrl) ? (
                      <Image 
                        src={relatedPost.image || relatedPost.imageUrl} 
                        alt={relatedPost.title} 
                        fill 
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <FileText size={48} className="text-slate-300" />
                    )}
                  </div>
                  <div className="p-6">
                    <span className="text-[10px] font-black text-brand-blue uppercase tracking-widest mb-3 block">
                      {relatedPost.category}
                    </span>
                    <h3 className="text-lg font-black text-brand-navy group-hover:text-brand-blue transition-colors line-clamp-2">
                      {relatedPost.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Sekcja CTA */}
        <div className="bg-slate-50 rounded-[var(--radius-brand-card)] p-8 md:p-12 border border-slate-100 flex flex-col md:flex-row items-center justify-between gap-8 mt-12">
          <div className="max-w-xl text-center md:text-left">
            <h3 className="text-2xl font-black text-brand-navy mb-4">Potrzebujesz pomocy w podobnej sprawie?</h3>
            <p className="text-slate-500 font-medium">Nasi eksperci prawni pomogli już tysiącom firm odzyskać należności w sprawach takich jak ta.</p>
          </div>
          <Link 
            href="/#contact"
            className="px-10 py-5 bg-brand-blue text-white rounded-[var(--radius-brand-button)] font-black shadow-xl shadow-brand-blue/20 hover:bg-brand-blue/90 transition-all whitespace-nowrap flex items-center gap-2 group"
          >
            Darmowa analiza Twojej faktury
            <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>
    </main>
  );
}
