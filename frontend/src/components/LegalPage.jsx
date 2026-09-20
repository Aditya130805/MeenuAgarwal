import Navbar from './Navbar';
import Footer from './Footer';
import PageHero from './PageHero';

const LegalPage = ({ title, introduction, children }) => (
  <div className="min-h-screen bg-[#f7fafb]">
    <Navbar />
    <main>
      <PageHero title={title} description={introduction} />

      <section className="relative z-10 mx-auto -mt-20 max-w-4xl px-4 pb-16 md:-mt-24 md:px-8 md:pb-24">
        <article className="rounded-[28px] bg-white px-6 py-8 text-slate-700 shadow-[0_18px_55px_rgba(28,84,109,0.18)] sm:px-10 md:py-12">
          <p className="mb-8 text-sm font-semibold text-slate-500">
            Last updated: 20 September 2026
          </p>
          <div className="space-y-8 [&_a]:font-semibold [&_a]:text-[var(--dark-blue-color)] [&_a]:underline [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-[var(--dark-blue-color)] [&_li]:leading-relaxed [&_p]:leading-relaxed [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2">
            {children}
          </div>
        </article>
      </section>
    </main>
    <Footer />
  </div>
);

export default LegalPage;
