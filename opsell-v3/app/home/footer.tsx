const NAV_LINKS = [
  { label: "Privacy", href: "#" },
  { label: "Terms", href: "#" },
  { label: "Security", href: "#" },
  { label: "Contact", href: "https://opsell.neetocal.com/meeting-with-shaurya-gupta" },
];

export default function Footer() {
  return (
    <footer className="bg-white border-t border-n-border px-6 md:px-12 lg:px-20">
      <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
        <span className="font-body text-xs text-n-400">
          © 2026 Opsell AI · AI-led commerce execution for consumer brands
        </span>
        <nav className="flex flex-wrap items-center justify-center gap-6">
          {NAV_LINKS.map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="font-body text-xs text-n-500 transition-colors hover:text-n-900"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
