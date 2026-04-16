import React from 'react';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPageBySlug, getAllPageSlugs } from '../../../services/cmsRepository';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs();
  return slugs;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  
  if (!page || !page.isPublished) return { title: 'Strona nie znaleziona' };

  return {
    title: page.seo?.title || page.title,
    description: page.seo?.description || '',
    alternates: {
      canonical: `/${slug}`,
    },
    openGraph: {
      title: page.seo?.title || page.title,
      description: page.seo?.description || '',
      type: 'website',
    },
  };
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getPageBySlug(slug);

  if (!page || !page.isPublished) {
    notFound();
  }

  // Split title to highlight the last word in blue (like in FAQ)
  const titleWords = page.title.split(' ');
  const lastWord = titleWords.pop();
  const titleStart = titleWords.join(' ');

  return (
    <main className="bg-white min-h-screen animate-in fade-in duration-500">
      {/* Hero Section - Inspired by FAQ */}
      <div className="pt-32 pb-16 bg-white border-b border-slate-50">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-8 hover:text-brand-blue transition-colors group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
            Powrót do strony głównej
          </Link>

          <div className="max-w-4xl">
            <h1 className="text-5xl lg:text-7xl font-black text-brand-navy leading-[1.1] tracking-tighter mb-6">
              {titleStart} <span className="text-brand-blue">{lastWord}</span>
            </h1>
            {page.seo?.description && (
              <p className="text-slate-500 text-xl font-medium leading-relaxed max-w-2xl">
                {page.seo.description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Main Content - Grid Layout with Sidebar */}
      <div className="py-24 bg-slate-50/30">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* Left Column: Content Card */}
            <div className="lg:col-span-8">
              <div className="bg-white rounded-[var(--radius-brand-card)] p-8 md:p-12 border border-slate-100 shadow-sm">
                <article className="prose prose-lg md:prose-xl prose-slate max-w-none
                  prose-headings:font-black prose-headings:text-brand-navy prose-headings:tracking-tight
                  prose-p:text-slate-600 prose-p:leading-relaxed
                  prose-a:text-brand-blue prose-a:font-bold hover:prose-a:underline 
                  prose-img:rounded-2xl prose-img:shadow-xl
                  prose-strong:text-brand-navy prose-strong:font-bold
                  prose-ul:list-disc prose-ul:pl-6
                  prose-li:text-slate-600">
                  <ReactMarkdown 
                    remarkPlugins={[remarkGfm, remarkBreaks]}
                  >
                    {page.content}
                  </ReactMarkdown>
                </article>
              </div>
            </div>

            {/* Right Column: Sidebar (Inspired by FAQ) */}
            <aside className="lg:col-span-4 space-y-12 sticky top-32 self-start">
              
              {/* Need Help Box */}
              <div className="bg-brand-navy rounded-[var(--radius-brand-card)] p-8 text-white relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 rounded-full blur-2xl -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
                <div className="relative z-10">
                  <h3 className="text-xl font-black mb-4 text-white">Potrzebujesz pomocy?</h3>
                  <p className="text-brand-light-blue/70 text-sm font-medium mb-8 leading-relaxed">
                    Nasi eksperci są dostępni, aby odpowiedzieć na Twoje pytania bezpośrednio.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <a href="tel:+48612224444" className="flex items-center gap-3 text-sm font-bold hover:text-brand-blue transition-colors">
                      <div className="w-8 h-8 bg-white/10 rounded-[var(--radius-brand-input)] flex items-center justify-center">
                        <ArrowLeft size={14} className="rotate-180" />
                      </div>
                      +48 61 222 44 44
                    </a>
                    <a href="mailto:biuro@rpms.pl" className="flex items-center gap-3 text-sm font-bold hover:text-brand-blue transition-colors">
                      <div className="w-8 h-8 bg-white/10 rounded-[var(--radius-brand-input)] flex items-center justify-center">
                        <ArrowLeft size={14} className="rotate-45" />
                      </div>
                      biuro@rpms.pl
                    </a>
                  </div>

                  <Link 
                    href="/#lead_form"
                    className="w-full py-4 bg-brand-blue hover:bg-brand-blue/90 text-white rounded-[var(--radius-brand-button)] font-black text-xs uppercase tracking-widest transition-all flex items-center justify-center gap-2"
                  >
                    Napisz do nas
                    <ArrowLeft size={16} className="rotate-180" />
                  </Link>
                </div>
              </div>

              {/* Client Panel Banner */}
              <div className="bg-white rounded-[var(--radius-brand-card)] p-8 border border-slate-100 shadow-sm group">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-brand-blue/5 rounded-[var(--radius-brand-button)] flex items-center justify-center transition-colors group-hover:bg-brand-blue/10">
                    <ArrowLeft className="text-brand-blue rotate-180" size={20} />
                  </div>
                  <h3 className="text-base font-black text-brand-navy leading-tight">Twoje sprawy pod kontrolą 24/7</h3>
                </div>
                <p className="text-slate-500 text-sm font-medium mb-5 leading-relaxed">
                  Monitoruj postępy windykacji w czasie rzeczywistym dzięki Panelowi Klienta.
                </p>
                <Link 
                  href="/panel"
                  className="inline-flex items-center gap-2 text-brand-blue font-black text-sm group-hover:gap-3 transition-all"
                >
                  Sprawdź Panel Klienta
                  <ArrowLeft size={18} className="rotate-180" />
                </Link>
              </div>

            </aside>
          </div>
        </div>
      </div>
    </main>
  );
}
