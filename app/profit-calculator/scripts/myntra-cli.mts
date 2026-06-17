// ============================================================================
// Myntra calculator — local preview (CLI)
// ----------------------------------------------------------------------------
// Runs the REAL config-driven engine with no UI/Next.js dependencies.
//
//   npx tsx scripts/myntra-cli.mts                         # demo scenarios
//   npx tsx scripts/myntra-cli.mts --price 999 --cogs 300 --category Apparel \
//        --weight 400 --zone Zonal --cod --returnRate 25
//
// Flags: --price --cogs --shipCost --category --articleType --weight --zone
//        --returnRate --ads --cod (COD order) --platformFulfil --noGst
// ============================================================================

import { calculateMyntra } from '../engines/calculateMyntra';
import { MYNTRA_MASTER_CATEGORIES, MYNTRA_CONFIG_VERSION } from '../config/myntra';

type Args = Record<string, string | boolean>;
function parseArgs(argv: string[]): Args {
  const a: Args = {};
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (!t.startsWith('--')) continue;
    const key = t.slice(2);
    const next = argv[i + 1];
    if (next === undefined || next.startsWith('--')) a[key] = true;
    else ((a[key] = next), i++);
  }
  return a;
}

const inr = (n: number) => '₹' + n.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
const padAmt = (s: string) => s.padStart(13);
const line = (label: string, amount: number, extra = '') =>
  `  ${label.padEnd(36)}${padAmt(inr(amount))}${extra ? '   ' + extra : ''}`;
const rule = (c = '─') => '  ' + c.repeat(49);

function render(
  product: Parameters<typeof calculateMyntra>[0],
  settings: Parameters<typeof calculateMyntra>[1]
) {
  const r = calculateMyntra(product, settings);
  const cat = product?.category ?? '—';
  const at = product?.articleType ? ` / ${product.articleType}` : '';
  const order = settings?.orderType ?? 'Prepaid';
  const zone = settings?.shippingZone ?? 'National';

  console.log('');
  console.log(`  ▌ Myntra — ${cat}${at} @ ${inr(r.sellingPrice)}  (${order}, ${zone}, ${product?.weight ?? 500}g)`);
  console.log(`  ▌ config: ${MYNTRA_CONFIG_VERSION}`);
  console.log(rule('═'));
  console.log(line('Selling price', r.sellingPrice));
  console.log(line(`− Commission (${r.commissionPercent}%, ${r.commissionSource})`, -r.referralFee));
  console.log(line('− Fixed fee', -r.closingFee));
  console.log(line('− Shipping (forward)', -r.shippingFee));
  if (r.fulfillmentFee) console.log(line('− Fulfillment (pick/pack/storage)', -r.fulfillmentFee));
  console.log(line('− Collection fee', -r.collectionFee));
  if (r.codFee) console.log(line('− COD fee', -r.codFee));
  console.log(line('− GST on fees (18%, ex-commission)', -r.gstOnFees));
  console.log(line('− TCS (1%)', -r.tcs));
  if (r.adsSpend) console.log(line('− Ads spend', -r.adsSpend));
  console.log(rule());
  console.log(line('Total deductions', -r.totalDeductions, `${r.effectiveFeePercent}% of price`));
  console.log(line('Net payout (settlement)', r.netPayout));
  console.log(rule('═'));
  console.log(line('− COGS', -(product?.cogs ?? 0)));
  if (product?.shippingCostToBuyer) console.log(line('− Other seller cost', -product.shippingCostToBuyer));
  if (r.returnImpact) console.log(line(`− Return provision (${product?.returnRate ?? 0}%)`, -r.returnImpact));
  console.log(rule());
  const tag = r.netProfit >= 0 ? '✓ PROFIT' : '✗ LOSS';
  console.log(line(`Net profit  ${tag}`, r.netProfit));
  console.log(`  Margin ${r.profitMargin}%   ROI ${r.roi}%   Contribution ${r.contributionMargin}%   Break-even ${inr(r.breakEvenPrice)}`);
  if (r.warnings?.length) {
    console.log('  ⚠ ' + r.warnings.join('\n  ⚠ '));
  }
}

const args = parseArgs(process.argv.slice(2));

if (Object.keys(args).length === 0) {
  console.log('\n  No flags given — showing demo scenarios.');
  console.log('  Categories:', MYNTRA_MASTER_CATEGORIES.join(', '));
  render(
    { sellingPrice: 999, cogs: 300, category: 'Apparel', weight: 400, returnRate: 25 },
    { orderType: 'COD', shippingZone: 'Zonal' }
  );
  render(
    { sellingPrice: 1499, cogs: 500, category: 'Footwear', weight: 700, returnRate: 30 },
    { orderType: 'Prepaid', shippingZone: 'National' }
  );
  render(
    { sellingPrice: 2000, cogs: 1500, category: 'Accessories', articleType: 'Gold Coin', weight: 200 },
    { orderType: 'COD', shippingZone: 'Local' }
  );
  console.log('\n  Try your own:  npx tsx scripts/myntra-cli.mts --price 1299 --cogs 450 --category Apparel --weight 500 --cod --returnRate 20\n');
} else {
  const product = {
    sellingPrice: Number(args.price) || 0,
    cogs: Number(args.cogs) || 0,
    shippingCostToBuyer: Number(args.shipCost) || 0,
    category: typeof args.category === 'string' ? args.category : undefined,
    articleType: typeof args.articleType === 'string' ? args.articleType : undefined,
    weight: Number(args.weight) || 500,
    adsSpend: Number(args.ads) || 0,
    returnRate: Number(args.returnRate) || 0,
  };
  const settings = {
    orderType: (args.cod ? 'COD' : 'Prepaid') as 'COD' | 'Prepaid',
    shippingZone: (typeof args.zone === 'string' ? args.zone : 'National') as 'Local' | 'Zonal' | 'National',
    fulfillmentMethod: (args.platformFulfil ? 'Platform Fulfillment' : 'Self-Ship') as
      | 'Platform Fulfillment'
      | 'Self-Ship',
    includeGSTAsFee: !args.noGst,
  };
  render(product, settings);
  console.log('');
}
