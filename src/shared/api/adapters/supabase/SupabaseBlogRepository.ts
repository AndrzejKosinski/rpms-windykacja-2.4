import { supabase } from '../../supabaseClient';
import { BlogPost } from '../../../../views/dashboard/types/cms';

export class SupabaseBlogRepository {
  async getBlogPosts() {
    const [{ data: blogPosts }, { data: blogFaqs }] = await Promise.all([
      supabase.from('blog_posts').select('*'),
      supabase.from('blog_faqs').select('*')
    ]);

    return (blogPosts || []).map(post => {
      const postFaqs = (blogFaqs || []).filter(f => f.id.startsWith(post.slug + '-faq-')).map(f => ({
        question: f.question,
        answer: f.answer
      }));
      return {
        id: post.slug,
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        content: post.content,
        image: post.image_url || '',
        imageUrl: post.image_url,
        imageAlt: post.image_alt || '',
        category: post.category || '',
        date: post.published_at,
        publishedAt: post.published_at,
        author: post.author || 'Administrator',
        status: post.status || 'draft',
        seo: {
          title: post.seo_title || '',
          description: post.seo_description || '',
          keywords: post.seo_keywords || ''
        },
        faqs: postFaqs
      };
    });
  }

  async updateBlogPosts(blog: BlogPost[]) {
    for (const p of blog) {
      let parsedDate = p.date;
      if (p.date && !p.date.includes('-')) {
        const months: Record<string, string> = {
          'Sty': '01', 'Lut': '02', 'Mar': '03', 'Kwi': '04', 'Maj': '05', 'Cze': '06',
          'Lip': '07', 'Sie': '08', 'Wrz': '09', 'Paź': '10', 'Lis': '11', 'Gru': '12'
        };
        const parts = p.date.split(' ');
        if (parts.length === 3) {
          const day = parts[0].padStart(2, '0');
          const month = months[parts[1]] || '01';
          const year = parts[2];
          parsedDate = `${year}-${month}-${day}T00:00:00Z`;
        }
      }

      const { error: blogError } = await supabase.from('blog_posts').upsert({
        slug: p.slug || p.id,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        image_url: p.imageUrl || p.image,
        published_at: parsedDate,
        author: p.author
      }, { onConflict: 'slug' });
      
      if (blogError) console.error('Error saving blog post:', blogError);

      if (p.faqs) {
        for (let i = 0; i < p.faqs.length; i++) {
          const { error: faqError } = await supabase.from('blog_faqs').upsert({
            id: `${p.slug || p.id}-faq-${i}`,
            question: p.faqs[i].question,
            answer: p.faqs[i].answer
          }, { onConflict: 'id' });
          if (faqError) console.error('Error saving FAQ:', faqError);
        }
      }
    }
  }
}
