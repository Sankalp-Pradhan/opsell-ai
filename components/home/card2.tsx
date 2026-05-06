import { TrendingDown, MousePointer2 } from "lucide-react";

const Card2 = () => {
  return (
    <div className="w-full">
      <article className="mx-auto flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#E2E4E8] bg-white text-[#0F1114] shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[#D1D4D9] hover:shadow-2xl">
        {/* Visual */}
        <div className="relative h-20 md:h-52 overflow-hidden bg-gradient-to-br from-[#F0F1F3] via-[#E2E4E8] to-[#F0F1F3]">
          {/* Product card */}
          <div className="absolute left-1/2 top-1/2 w-[95px] md:w-[150px] -translate-x-1/2 -translate-y-[56%] rounded-xl md:rounded-2xl border border-[#E2E4E8] bg-white p-2 md:p-3 shadow-xl">
            <div className="mb-2 md:mb-3 h-8 md:h-16 rounded-lg md:rounded-xl bg-[#F0F1F3]" />

            <div className="space-y-1 md:space-y-2">
              <div className="h-1 md:h-2 w-3/4 rounded bg-[#E2E4E8]" />
              <div className="h-1 md:h-2 w-1/2 rounded bg-[#E2E4E8]" />
            </div>

            {/* Price progression */}
            <div className="mt-2 md:mt-3 flex items-center gap-0.5 md:gap-1 text-[6px] md:text-[10px]">
              <span className="text-[#8C919A] line-through">₹999</span>
              <span className="text-[#8C919A]">→</span>
              <span className="rounded bg-[#FEF2F2] px-1 py-0.5 font-semibold text-[#EF4444] md:rounded-md md:px-1.5">
                ₹899
              </span>
              <span className="text-[#8C919A]">→</span>
              <span className="rounded bg-[#FFFBEB] px-1 py-0.5 font-semibold text-[#F59E0B] md:rounded-md md:px-1.5">
                ₹949
              </span>
            </div>

            {/* Manual price slider */}
            <div className="relative mt-2 md:mt-3">
              <div className="h-1 w-full rounded-full bg-[#F0F1F3] md:h-1.5">
                <div className="h-1 w-1/2 rounded-full bg-gradient-to-r from-[#EF4444] to-[#F59E0B] md:h-1.5" />
              </div>

              <div className="absolute -top-0.5 left-1/2 h-2.5 w-2.5 -translate-x-1/2 rounded-full border-2 border-white bg-[#0F1114] shadow-md md:-top-1 md:h-3.5 md:w-3.5" />

              <MousePointer2 className="absolute -top-1 left-[calc(50%+6px)] h-2.5 w-2.5 -rotate-12 fill-white text-[#0F1114] drop-shadow md:left-[calc(50%+10px)] md:h-4 md:w-4" />
            </div>
          </div>

          {/* Floating tags */}
          <div className="absolute right-2 top-2 md:right-3 md:top-3 flex items-center gap-1 rounded-full bg-[#EF4444] px-1.5 py-0.5 md:px-2.5 md:py-1 shadow-md rotate-[-6deg]">
            <TrendingDown className="h-2.5 w-2.5 md:h-3 md:w-3 text-white" />
            <span className="text-[7px] md:text-[10px] font-medium text-white">
              Unsure?
            </span>
          </div>

          <div className="absolute bottom-2 left-2 md:bottom-5 md:left-3 rotate-[-8deg] rounded-md md:rounded-lg border border-[#E2E4E8] bg-white px-1.5 py-0.5 md:px-2 md:py-1 shadow-md">
            <span className="text-[7px] md:text-[10px] font-semibold text-[#EF4444]">
              -10%
            </span>
          </div>

          <div className="absolute bottom-2 right-2 md:bottom-6 md:right-4 rotate-[16deg] rounded-md md:rounded-lg border border-[#E2E4E8] bg-white px-1.5 py-0.5 md:px-2 md:py-1 shadow-md">
            <span className="text-[7px] md:text-[10px] font-semibold text-[#16A34A]">
              +5%
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-2.5 md:p-4">
          <h2 className="text-[11px] md:text-sm font-semibold leading-[1.4] md:leading-5 text-[#0F1114]">
            Pricing Decisions Still Happen Manually
          </h2>
        </div>
      </article>
    </div>
  );
};

export default Card2;