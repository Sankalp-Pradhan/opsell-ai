'use client';

import Head from 'next/head';
import { usePathname } from 'next/navigation';

interface FAQItem {
  q: string;
  a: string;
}

interface SEOContentItem {
  title: string;
  description: string;
  h2: string;
  content: string;
  changelog: string;
  faq: FAQItem[];
}

type SEOContentMap = Record<string, SEOContentItem>;

const SEO_CONTENT: SEOContentMap = {
  'amazon-india-seller-fees-calculator': {
    title:
      'Amazon India Seller Fee Calculator 2026 | Profit Margin Tool',
    description:
      'Instantly calculate your true Amazon India net profit margin including referral, closing, and FBA/Easy Ship fees.',
    h2: 'Understanding Amazon India Seller Fees in 2026',
    content:
      'Selling on Amazon India requires understanding referral, closing, and shipping fees.',
    changelog:
      'April 10, 2026: Amazon restructured weight limits.',
    faq: [
      {
        q: "What is Amazon India's Referral Fee?",
        a: 'It is a category-based percentage fee.',
      },
    ],
  },
};

export default function PlatformSEOBlock() {
  const pathname = usePathname();

  const slug = pathname.replace(/^\//, '');

  const data = SEO_CONTENT[slug];

  if (!data) return null;

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'SoftwareApplication',
        name: data.title,
        applicationCategory: 'BusinessApplication',
        operatingSystem: 'Web',
        description: data.description,
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'INR',
        },
      },
      {
        '@type': 'FAQPage',
        mainEntity: data.faq.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: {
            '@type': 'Answer',
            text: f.a,
          },
        })),
      },
    ],
  };

  return (
    <>
      <Head>
        <title>{data.title}</title>

        <meta
          name="description"
          content={data.description}
        />

        <link
          rel="canonical"
          href={`https://opsell.in/${slug}`}
        />

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(schema),
          }}
        />
      </Head>

      <div
        className="animate-in"
        style={{
          marginTop: 48,
          padding: '40px 32px',
          background: 'var(--bg-surface-2)',
          border: '1px solid var(--glass-border)',
          borderRadius: 24,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fit, minmax(320px, 1fr))',
            gap: 40,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: 'Sora',
                fontSize: 22,
                fontWeight: 700,
                color: 'var(--text-primary)',
                marginBottom: 16,
              }}
            >
              {data.h2}
            </h2>

            <p
              style={{
                fontSize: 15,
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                fontFamily: 'DM Sans',
                marginBottom: 24,
              }}
            >
              {data.content}
            </p>
          </div>

          <div>
            <h3
              style={{
                fontFamily: 'Sora',
                fontSize: 18,
                fontWeight: 600,
                color: 'var(--text-primary)',
                marginBottom: 20,
              }}
            >
              Frequently Asked Questions
            </h3>

            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
              }}
            >
              {data.faq.map((f, i) => (
                <div
                  key={i}
                  style={{
                    paddingBottom: 16,
                    borderBottom:
                      '1px solid var(--glass-border)',
                  }}
                >
                  <p
                    style={{
                      fontSize: 14,
                      fontWeight: 600,
                      color: 'var(--text-primary)',
                      fontFamily: 'Sora',
                      marginBottom: 8,
                    }}
                  >
                    {f.q}
                  </p>

                  <p
                    style={{
                      fontSize: 13,
                      color: 'var(--text-secondary)',
                      fontFamily: 'DM Sans',
                      lineHeight: 1.5,
                    }}
                  >
                    {f.a}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}