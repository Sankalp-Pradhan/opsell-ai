import GLOSSARY from '../data/glossary';

interface TipProps {
  term?: keyof typeof GLOSSARY;
  text?: string;
  size?: number;
}

/**
 * Inline help tooltip. Pass either `term` (glossary key) or `text` (custom string).
 * Renders a small "?" chip; on hover/focus shows a styled popover (.tooltip-box).
 *
 * <Tip term="referral" />
 * <Tip text="Selling price × 1.18 if GST included" />
 */
export default function Tip({ term, text, size = 14 }: TipProps) {
  const copy = text ?? (term && GLOSSARY[term]?.text) ?? '';
  if (!copy) return null;

  return (
    <span className="tooltip-wrap" style={{ marginLeft: 4, verticalAlign: 'middle' }}>
      <button
        type="button"
        aria-label={`Help: ${copy}`}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: size,
          height: size,
          padding: 0,
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.08)',
          color: 'var(--text-muted)',
          fontSize: Math.max(9, Math.round(size * 0.65)),
          fontWeight: 700,
          cursor: 'help',
          fontFamily: 'DM Sans',
          lineHeight: 1,
          userSelect: 'none',
        }}
      >
        ?
      </button>
      <span className="tooltip-box" role="tooltip">{copy}</span>
    </span>
  );
}