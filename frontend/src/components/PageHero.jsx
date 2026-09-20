const PageHero = ({ title, description }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[var(--light-blue-color)] to-[var(--dark-blue-color)] px-4 pb-28 pt-14 text-center md:pb-36 md:pt-20">
      <div
        className="pointer-events-none absolute -left-24 top-8 h-64 w-64 rounded-full border border-white/10"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-24 bottom-[-5rem] h-72 w-72 rounded-full border border-white/10"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-3xl">
        <h1 className="text-3xl font-extrabold leading-tight text-white sm:text-4xl md:text-5xl">
          {title}
        </h1>
        <div className="mx-auto my-5 h-1 w-24 bg-[var(--coral-color)]" />
        <p className="mx-auto max-w-2xl text-base leading-relaxed text-white/90 sm:text-lg">
          {description}
        </p>
      </div>
    </section>
  );
};

export default PageHero;
