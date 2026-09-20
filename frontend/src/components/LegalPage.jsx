import Navbar from './Navbar';
import Footer from './Footer';

const LegalPage = ({ title, introduction, children }) => (
  <div className="min-h-screen bg-[#f7fafb]">
    <Navbar />
    <main>
      <section className="bg-gradient-to-r from-[var(--light-blue-color)] to-[var(--dark-blue-color)] px-4 py-14 text-center md:py-20">
        <h1 className="text-3xl font-extrabold text-white sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <div className="mx-auto my-5 h-1 w-24 bg-[var(--coral-color)]" />
        <p className="mx-auto max-w-2xl text-white/90">{introduction}</p>
      </section>

      <article className="mx-auto my-10 max-w-4xl rounded-[24px] bg-white px-6 py-8 text-slate-700 shadow-[0_8px_24px_rgba(35,105,138,0.12)] sm:px-10 md:my-14 md:py-12">
        <p className="mb-8 text-sm font-semibold text-slate-500">
          Last updated: 20 September 2026
        </p>
        <div className="space-y-8 [&_a]:font-semibold [&_a]:text-[var(--dark-blue-color)] [&_a]:underline [&_h2]:text-xl [&_h2]:font-extrabold [&_h2]:text-[var(--dark-blue-color)] [&_li]:leading-relaxed [&_p]:leading-relaxed [&_ul]:ml-5 [&_ul]:list-disc [&_ul]:space-y-2">
          {children}
        </div>
      </article>
    </main>
    <Footer />
  </div>
);

export default LegalPage;
