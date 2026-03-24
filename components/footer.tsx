export function Footer() {
  return (
    <footer className="border-t border-white/10 py-10">
      <div className="container-shell flex flex-col gap-6 text-sm text-zinc-400 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="font-semibold text-zinc-200">Fitfluence Pro</p>
          <p>Helping clients build confidence through fitness.</p>
        </div>
        <div className="flex gap-4">
          <a href="https://instagram.com" target="_blank">Instagram</a>
          <a href="https://tiktok.com" target="_blank">TikTok</a>
          <a href="mailto:coach@fitfluencepro.com">coach@fitfluencepro.com</a>
        </div>
        <p>© 2026 Fitfluence Pro. All rights reserved.</p>
      </div>
    </footer>
  );
}
