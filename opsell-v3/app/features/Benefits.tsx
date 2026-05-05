import { Smile, Clock, TrendingUp, GraduationCap, Plug, Eye } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type Benefit = {
  Icon: LucideIcon;
  title: string;
  text: string;
};

const benefits: Benefit[] = [
  { Icon: Smile,        title: "Easy to Use",               text: "Designed so anyone can get started in minutes — no manual needed."         },
  { Icon: Clock,        title: "Saves Time",                text: "Automate the repetitive tasks you used to do every single morning."        },
  { Icon: TrendingUp,   title: "Improves Revenue",          text: "Smarter prices and clear suggestions help you sell more, every week."      },
  { Icon: GraduationCap,title: "No Technical Skills Needed",text: "If you can use a phone, you can run your entire pricing with Opsell."     },
  { Icon: Plug,         title: "Works with Your Store",     text: "Connects with Shopify, WooCommerce and more in just a few clicks."        },
  { Icon: Eye,          title: "Gives Clear Insights",      text: "Plain-language reports tell you exactly what to do next."                 },
];

const BenefitCard = ({ Icon, title, text }: Benefit) => (
  <div className="group relative overflow-hidden rounded-xl bg-n-900 p-5 shadow-elev-3 transition-all duration-300 hover:-translate-y-1 sm:p-6 lg:p-7">
    {/* Glow blobs */}
    <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-brand/20 blur-2xl" />
    <div className="pointer-events-none absolute -bottom-8 -left-8 h-32 w-32 rounded-full bg-brand-mid/20 blur-2xl" />

    {/* Icon */}
    {/* <div className="relative mb-5 flex h-11 w-11 items-center justify-center rounded-lg bg-brand/20 transition-colors duration-300 group-hover:bg-brand">
      <Icon className="h-5 w-5 text-brand-mid transition-colors duration-300 group-hover:text-white" />
    </div> */}

    {/* Text */}
    <h3 className="relative font-display text-ds-h3 font-semibold text-white">
      {title}
    </h3>
    <p className="relative mt-2 font-body text-ds-body-sm leading-relaxed text-n-400">
      {text}
    </p>
  </div>
);

const Benefits = () => (
  <section id="benefits" className="bg-n-50 py-16 sm:py-20 lg:py-24">
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-14">
        <p className="font-display mb-3 text-ds-caption font-bold uppercase tracking-[0.12em] text-brand">
          Why Opsell
        </p>
        <div className="mx-auto mb-5 h-1 w-10 rounded-sm bg-brand" />
        <h2 className="font-display text-ds-h1 font-bold tracking-[-0.01em] text-n-900 sm:text-4xl">
          Why Businesses Choose Opsell
        </h2>
        <p className="font-body mt-4 text-ds-body leading-relaxed text-n-500">
          Six reasons store owners love it from day one.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {benefits.map((b) => (
          <BenefitCard key={b.title} {...b} />
        ))}
      </div>
    </div>
  </section>



);

export default Benefits;