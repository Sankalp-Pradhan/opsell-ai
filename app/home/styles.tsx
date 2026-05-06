// ─── Global Keyframes & CSS Variables ────────────────────────────────────────

export const KEYFRAMES = `
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes aiPulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50%       { opacity: 0.4; transform: scale(0.75); }
  }
  @keyframes pillBeam {
    0%   { left: -60%; }
    100% { left: 160%; }
  }
  :root {
    --font-display: 'Plus Jakarta Sans', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --font-mono: 'JetBrains Mono', monospace;
  }
`;