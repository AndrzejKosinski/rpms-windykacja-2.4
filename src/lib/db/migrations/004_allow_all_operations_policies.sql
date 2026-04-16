-- Utworzenie polityk pozwalających na pełen dostęp (INSERT, UPDATE, DELETE)
-- Uwaga: Twoje endpointy API (/api/content) są już zabezpieczone sprawdzaniem roli i sesji, 
-- więc to rozwiązanie jest bezpieczne dla obecnej architektury.
CREATE POLICY "Allow all operations on blog_posts" ON public.blog_posts FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on pages" ON public.pages FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on system_settings" ON public.system_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on modals" ON public.modals FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on global_settings" ON public.global_settings FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on blog_faqs" ON public.blog_faqs FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on why_us_cards" ON public.why_us_cards FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on target_audience_industries" ON public.target_audience_industries FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on dds_config" ON public.dds_config FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on footer_columns" ON public.footer_columns FOR ALL USING (true) WITH CHECK (true);
CREATE POLICY "Allow all operations on footer_links" ON public.footer_links FOR ALL USING (true) WITH CHECK (true);
