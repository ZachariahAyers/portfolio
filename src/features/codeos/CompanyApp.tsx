export function CompanyApp() {
  return (
    <article className="space-y-5 bg-white p-6 text-sm text-gray-900 dark:bg-gray-900 dark:text-white">
      <header>
        <h2 className="text-xl font-bold">Ayers Software Repair</h2>
        <p className="mt-2">Software Services &amp; AI Development</p>
      </header>
      <p>
        We build custom software, develop AI tools, and repair and modernize the systems businesses
        depend on.
      </p>
      <nav
        aria-label="Company links"
        className="flex flex-wrap gap-5 text-blue-700 underline dark:text-blue-300"
      >
        <a href="https://ayers.repair/services.html" target="_blank" rel="noopener noreferrer">
          Services
        </a>
        <a href="https://ayers.repair/products.html" target="_blank" rel="noopener noreferrer">
          Products
        </a>
        <a href="https://ayers.repair/contact.html" target="_blank" rel="noopener noreferrer">
          Contact us
        </a>
      </nav>
      <p>
        <a href="mailto:info@ayers.repair" className="text-blue-700 underline dark:text-blue-300">
          info@ayers.repair
        </a>
      </p>
      <p className="text-xs">Ayers Electronics Inc.</p>
    </article>
  );
}
