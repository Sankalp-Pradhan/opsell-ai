import { useState } from 'react';
import PlatformBadge from './PlatformBadge';
import { PLATFORMS } from '../data/platforms';
import { IconChevronDown } from './Icon';
import Tip from './Tip';
import type { PlatformId } from '../engines';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ResultItem {
  platform: PlatformId;

  sellingPrice: number;

  cogs: number;

  referralFee: number;

  closingFee: number;

  weightHandlingFee: number;

  fulfillmentFee: number;

  shippingFee: number;

  collectionFee: number;

  codFee: number;

  tcs: number;

  gstOnFees: number;

  adsSpend: number;

  returnLogisticsFee: number;

  returnImpact: number;

  otherFees: number;

  totalDeductions: number;

  netPayout: number;

  netProfit: number;

  profitMargin: number;

  roi: number;

  effectiveFeePercent: number;
}

interface MiniBarProps {
  result: ResultItem;
}

interface FeeRowProps {
  label: string;
  amount: number;
  platformId: PlatformId;
  badge?: 'Reclaimable' | 'Info';
  term?:
    | 'referral'
    | 'closing'
    | 'weight'
    | 'fulfillment'
    | 'shipping'
    | 'collection'
    | 'cod'
    | 'tcs'
    | 'gstFees'
    | 'itc'
    | 'adsSpend'
    | 'returnImpact'
    | 'margin'
    | 'roi'
    | 'effectiveFee'
    | 'netPayout'
    | 'returnRate';
}

interface PlatformPanelProps {
  r: ResultItem;
}

interface FeeBreakdownCardProps {
  productName: string;
  results: ResultItem[];
}

// ---------------------------------------------------------------------------
// Currency formatter
// ---------------------------------------------------------------------------

function fmt(
  value: number,
  platformId: PlatformId
): string {
  const p = PLATFORMS[platformId];

  if (!p) {
    return value.toFixed(2);
  }

  if (p.currencySymbol === '$') {
    return `$${value.toFixed(2)}`;
  }

  if (p.currencySymbol === 'AED') {
    return `AED ${value.toFixed(2)}`;
  }

  return `₹${value.toFixed(2)}`;
}

// ---------------------------------------------------------------------------
// Mini stacked bar
// ---------------------------------------------------------------------------

function MiniBar({
  result,
}: MiniBarProps) {
  const items = [
    {
      label: 'COGS',
      value: result.cogs,
      color: 'var(--text-muted)',
    },

    {
      label: 'Referral',
      value: result.referralFee,
      color:
        'var(--accent-danger)',
    },

    {
      label: 'Shipping',
      value:
        result.shippingFee +
        result.weightHandlingFee +
        result.fulfillmentFee,
      color:
        'var(--accent-warning)',
    },

    {
      label: 'Other',
      value:
        result.closingFee +
        result.collectionFee +
        result.codFee +
        result.tcs +
        result.otherFees,
      color:
        'var(--chart-4, #a855f7)',
    },

    {
      label: 'Profit',
      value: Math.max(
        0,
        result.netProfit
      ),
      color:
        'var(--accent-success)',
    },
  ].filter(
    (i) => i.value > 0
  );

  const total = items.reduce(
    (s, i) => s + i.value,
    0
  );

  if (total === 0) {
    return null;
  }

  return (
    <div
      style={{
        marginBottom: 16,
      }}
    >
      <div
        style={{
          display: 'flex',
          borderRadius: 6,
          overflow: 'hidden',
          height: 6,
          background:
            'rgba(255,255,255,0.04)',
        }}
      >
        {items.map(
          (item, i) => (
            <div
              key={i}
              title={`${item.label}: ${(
                (item.value /
                  total) *
                100
              ).toFixed(0)}%`}
              style={{
                width: `${
                  (item.value /
                    total) *
                  100
                }%`,
                backgroundColor:
                  item.color,
                minWidth:
                  item.value > 0
                    ? 2
                    : 0,
              }}
            />
          )
        )}
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '4px 12px',
          marginTop: 8,
        }}
      >
        {items.map(
          (item, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems:
                  'center',
                gap: 5,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius:
                    '50%',
                  background:
                    item.color,
                  flexShrink: 0,
                }}
              />

              <span
                style={{
                  fontSize: 10,
                  color:
                    'var(--text-muted)',
                  fontFamily:
                    'DM Sans',
                }}
              >
                {item.label}{' '}
                {(
                  (item.value /
                    total) *
                  100
                ).toFixed(0)}
                %
              </span>
            </div>
          )
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Fee row
// ---------------------------------------------------------------------------

function FeeRow({
  label,
  amount,
  platformId,
  badge,
  term,
}: FeeRowProps) {
  const isZero = amount === 0;

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent:
          'space-between',
        padding: '7px 0',
        borderBottom:
          '1px solid rgba(255,255,255,0.03)',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 7,
        }}
      >
        <span
          style={{
            fontSize: 13,
            color: isZero
              ? 'var(--text-muted)'
              : 'var(--text-secondary)',
            fontFamily:
              'DM Sans',
            fontVariantNumeric:
              'tabular-nums',
          }}
        >
          {label}
        </span>

        {term && (
          <Tip
            term={term}
            size={13}
          />
        )}

        {badge ===
          'Reclaimable' && (
          <span
            className="badge-reclaimable"
            title="Reclaimable on your GST return"
          >
            Reclaimable
          </span>
        )}

        {badge === 'Info' && (
          <span
            className="badge-info"
            title="Input Tax Credit"
          >
            ITC
          </span>
        )}
      </div>

      <span
        style={{
          fontSize: 13,
          fontFamily:
            'DM Mono',
          fontWeight: 500,
          color: isZero
            ? 'var(--text-muted)'
            : 'var(--accent-danger)',
          opacity: isZero
            ? 0.4
            : 0.85,
        }}
      >
        {isZero
          ? '—'
          : `-${fmt(
              amount,
              platformId
            )}`}
      </span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Platform panel
// ---------------------------------------------------------------------------

function PlatformPanel({
  r,
}: PlatformPanelProps) {
  return (
    <div
      style={{
        borderRadius: 14,
        border:
          '1px solid rgba(255,255,255,0.05)',
        background:
          'rgba(255,255,255,0.015)',
        padding: '16px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent:
            'space-between',
          marginBottom: 14,
        }}
      >
        <PlatformBadge
          platformId={r.platform}
          size="md"
        />

        <div
          style={{
            textAlign: 'right',
          }}
        >
          <p
            style={{
              fontSize: 20,
              fontFamily:
                'DM Mono',
              fontWeight: 600,
              color:
                r.netProfit >= 0
                  ? 'var(--accent-success)'
                  : 'var(--accent-danger)',
            }}
          >
            {fmt(
              r.netProfit,
              r.platform
            )}
          </p>

          <p
            style={{
              fontSize: 10,
              color:
                'var(--text-muted)',
            }}
          >
            Net Profit
          </p>
        </div>
      </div>

      <MiniBar result={r} />

      <FeeRow
        label="Referral / Commission"
        amount={r.referralFee}
        platformId={r.platform}
        term="referral"
      />

      <FeeRow
        label="Closing / Fixed Fee"
        amount={r.closingFee}
        platformId={r.platform}
        term="closing"
      />

      {r.weightHandlingFee >
        0 && (
        <FeeRow
          label="Weight Handling"
          amount={
            r.weightHandlingFee
          }
          platformId={
            r.platform
          }
          term="weight"
        />
      )}

      {r.fulfillmentFee >
        0 && (
        <FeeRow
          label="Fulfillment Fee"
          amount={
            r.fulfillmentFee
          }
          platformId={
            r.platform
          }
          term="fulfillment"
        />
      )}

      {r.shippingFee > 0 && (
        <FeeRow
          label="Shipping"
          amount={r.shippingFee}
          platformId={
            r.platform
          }
          term="shipping"
        />
      )}

      {r.collectionFee >
        0 && (
        <FeeRow
          label="Collection Fee"
          amount={
            r.collectionFee
          }
          platformId={
            r.platform
          }
          term="collection"
        />
      )}

      {r.codFee > 0 && (
        <FeeRow
          label="COD Fee"
          amount={r.codFee}
          platformId={
            r.platform
          }
          term="cod"
        />
      )}

      {r.tcs > 0 && (
        <FeeRow
          label="TCS (1%)"
          amount={r.tcs}
          platformId={
            r.platform
          }
          badge="Reclaimable"
          term="tcs"
        />
      )}

      {r.gstOnFees > 0 && (
        <FeeRow
          label="GST on Fees"
          amount={r.gstOnFees}
          platformId={
            r.platform
          }
          badge="Info"
          term="gstFees"
        />
      )}

      {r.adsSpend > 0 && (
        <FeeRow
          label="Ads Spend"
          amount={r.adsSpend}
          platformId={
            r.platform
          }
          term="adsSpend"
        />
      )}

      {r.returnImpact > 0 && (
        <FeeRow
          label="Return Impact"
          amount={
            r.returnImpact
          }
          platformId={
            r.platform
          }
          term="returnImpact"
        />
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export default function FeeBreakdownCard({
  productName,
  results,
}: FeeBreakdownCardProps) {
  const [
    expanded,
    setExpanded,
  ] = useState(true);

  if (
    !results ||
    results.length === 0
  ) {
    return null;
  }

  return (
    <div className="breakdown-card">
      <button
        className="breakdown-header"
        onClick={() =>
          setExpanded(
            !expanded
          )
        }
      >
        <div
          style={{
            display: 'flex',
            alignItems:
              'center',
            gap: 12,
          }}
        >
          <span>
            {productName}
          </span>

          <span>
            {results.length}{' '}
            platforms
          </span>
        </div>

        <span
          className={`chevron${
            expanded
              ? ' open'
              : ''
          }`}
        >
          <IconChevronDown
            size={16}
          />
        </span>
      </button>

      {expanded && (
        <div
          style={{
            padding:
              '0 20px 20px',
          }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns:
                results.length ===
                1
                  ? '1fr'
                  : 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: 14,
            }}
          >
            {results.map((r) => (
              <PlatformPanel
                key={
                  r.platform
                }
                r={r}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}