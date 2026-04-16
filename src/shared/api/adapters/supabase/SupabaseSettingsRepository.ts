import { supabase } from '../../supabaseClient';
import { CMSContent } from '../../../../views/dashboard/types/cms';

export class SupabaseSettingsRepository {
  async getSettings() {
    const [
      { data: globalSettings },
      { data: modals },
      { data: whyUsCards },
      { data: taIndustries },
      { data: footerColumns },
      { data: footerLinks },
      { data: ddsConfig }
    ] = await Promise.all([
      supabase.from('global_settings').select('config').eq('id', 1).single(),
      supabase.from('modals').select('*'),
      supabase.from('why_us_cards').select('*'),
      supabase.from('target_audience_industries').select('*'),
      supabase.from('footer_columns').select('*'),
      supabase.from('footer_links').select('*'),
      supabase.from('dds_config').select('theme_data').eq('id', '1').single()
    ]);

    const baseConfig = globalSettings?.config || {};

    const mappedModals = (modals || []).map(m => ({
      id: m.id,
      internalName: m.internal_name,
      title: m.title,
      subtitle: m.subtitle,
      icon: m.icon,
      imageUrl: m.image_url,
      benefit: m.benefit,
      standard: m.standard,
      points: m.points,
      isVisibleInCarousel: m.is_visible_in_carousel,
      sectionType: m.section_type
    }));

    const whyUsModals = mappedModals.filter(m => m.sectionType === 'why_us');
    const targetAudienceModals = mappedModals.filter(m => m.sectionType === 'target_audience');

    const whyUs = {
      header: baseConfig.whyUs?.header || { title: '', description: '' },
      cards: (whyUsCards || []).map(c => ({
        id: c.id,
        icon: c.icon,
        title: c.title,
        desc: c.description,
        assignedModalId: c.assigned_modal_id
      })),
      modals: whyUsModals
    };

    const targetAudience = {
      header: baseConfig.targetAudience?.header || { title: '', description: '' },
      industries: (taIndustries || []).map(ind => ({
        id: ind.id,
        icon: ind.icon,
        title: ind.title,
        desc: ind.description,
        assignedModalId: ind.assigned_modal_id
      })),
      modals: targetAudienceModals
    };

    const footer = {
      ...baseConfig.footer,
      columns: (footerColumns || []).map(col => ({
        id: col.id,
        title: col.title,
        links: (footerLinks || []).filter(l => l.column_id === col.id).map(l => ({
          id: l.id,
          label: l.label,
          url: l.url,
          isExternal: l.is_external
        }))
      }))
    };

    return {
      baseConfig,
      whyUs,
      targetAudience,
      footer,
      pageLayout: ddsConfig?.theme_data || baseConfig.pageLayout
    };
  }

  async updateSettings(content: CMSContent) {
    // Modals
    const allModals = [];
    if (content.whyUs?.modals) {
      allModals.push(...content.whyUs.modals.map((m: any) => ({ ...m, sectionType: m.sectionType || 'why_us' })));
    }
    if (content.targetAudience?.modals) {
      allModals.push(...content.targetAudience.modals.map((m: any) => ({ ...m, sectionType: m.sectionType || 'target_audience' })));
    }
    
    const uniqueModals = Array.from(new Map(allModals.map(m => [m.id, m])).values());
    for (const m of uniqueModals) {
      const { error } = await supabase.from('modals').upsert({
        id: m.id,
        section_type: m.sectionType,
        internal_name: m.internalName || m.id,
        title: m.title,
        subtitle: m.subtitle,
        icon: m.icon,
        image_url: m.imageUrl,
        benefit: m.benefit,
        standard: m.standard,
        points: m.points,
        is_visible_in_carousel: m.isVisibleInCarousel
      }, { onConflict: 'id' });
      if (error) console.error('Error saving modal:', error);
    }

    // Why Us Cards
    if (content.whyUs?.cards) {
      for (const c of content.whyUs.cards) {
        const { error } = await supabase.from('why_us_cards').upsert({
          id: c.id,
          icon: c.icon,
          title: c.title,
          description: c.desc,
          assigned_modal_id: c.assignedModalId || null
        }, { onConflict: 'id' });
        if (error) console.error('Error saving why us card:', error);
      }
    }

    // Target Audience Industries
    if (content.targetAudience?.industries) {
      for (const ind of content.targetAudience.industries) {
        const { error } = await supabase.from('target_audience_industries').upsert({
          id: ind.id,
          icon: ind.icon,
          title: ind.title,
          description: ind.desc,
          assigned_modal_id: ind.assignedModalId || null
        }, { onConflict: 'id' });
        if (error) console.error('Error saving industry:', error);
      }
    }

    // Footer
    if (content.footer?.columns) {
      for (const col of content.footer.columns) {
        const { error: colError } = await supabase.from('footer_columns').upsert({
          id: col.id,
          title: col.title
        }, { onConflict: 'id' });
        if (colError) console.error('Error saving footer column:', colError);

        if (col.links) {
          for (const link of col.links) {
            const { error: linkError } = await supabase.from('footer_links').upsert({
              id: link.id,
              column_id: col.id,
              label: link.label,
              url: link.url,
              is_external: link.isExternal
            }, { onConflict: 'id' });
            if (linkError) console.error('Error saving footer link:', linkError);
          }
        }
      }
    }

    // DDS Config
    if (content.pageLayout) {
      const { error: ddsError } = await supabase.from('dds_config').upsert({
        id: '1',
        version: 1,
        theme_data: content.pageLayout,
        is_active: true
      }, { onConflict: 'id' });
      if (ddsError) console.error('Error saving DDS config:', ddsError);
    }

    // Global Settings
    const { blog, pages, whyUs, targetAudience, footer, pageLayout, modals, faq, ...restConfig } = content;
    
    const configToSave = {
      ...restConfig,
      whyUs: { header: content.whyUs?.header },
      targetAudience: { header: content.targetAudience?.header },
      footer: { 
        socialMedia: content.footer?.socialMedia,
        brandDescription: content.footer?.brandDescription,
        copyrightText: content.footer?.copyrightText,
        address: content.footer?.address,
        bottomBarLinks: content.footer?.bottomBarLinks
      }
    };

    const { error: globalError } = await supabase.from('global_settings').upsert({
      id: 1,
      config: configToSave
    }, { onConflict: 'id' });
    if (globalError) console.error('Error saving global settings:', globalError);
  }
}
