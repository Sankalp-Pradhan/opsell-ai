import { ArrowDownRight, Clock3, TrendingDown } from "lucide-react";

const Card3 = () => {
  return (
    <div className="w-full">
      <article className="mx-auto flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#E2E4E8] bg-white text-[#0F1114] shadow-xl transition-all duration-300 ease-in-out hover:-translate-y-1 hover:border-[#D1D4D9] hover:shadow-2xl">
        {/* Visual */}
        <div className="relative h-20 md:h-52 overflow-hidden bg-gradient-to-br from-[#F0F1F3] via-[#E2E4E8] to-[#F0F1F3]">
          {/* Competitor side */}
          <div className="absolute left-2 top-5 w-[58px] rounded-lg border border-[#FEF2F2] bg-white p-1.5 shadow-md md:left-3 md:top-5 md:w-[82px] md:rounded-xl md:p-2.5 sm:left-5 sm:w-[88px]">
            <div className="mb-1.5 h-5 rounded bg-[#F0F1F3] md:mb-2 md:h-9 md:rounded-md" />

            <div className="space-y-0.5 md:space-y-1">
              <div className="h-1 w-3/4 rounded bg-[#E2E4E8] md:h-1.5" />
              <div className="h-1 w-1/2 rounded bg-[#E2E4E8] md:h-1.5" />
            </div>

            <div className="mt-1.5 flex items-end gap-0.5 md:mt-3 md:gap-1">
              <span className="text-[6px] text-[#8C919A] line-through md:text-[9px]">
                ₹999
              </span>
              <span className="text-[8px] font-bold text-[#EF4444] md:text-xs">
                ₹849
              </span>
            </div>

            <div className="mt-1 flex items-center gap-0.5 rounded bg-[#FEF2F2] px-1 py-0.5 md:mt-2 md:gap-1 md:rounded-md md:px-1.5 md:py-1">
              <ArrowDownRight className="h-2 w-2 text-[#EF4444] md:h-3 md:w-3" />
              <span className="text-[6px] font-medium text-[#EF4444] md:text-[9px]">
                Dropped
              </span>
            </div>
          </div>

          {/* Your side */}
          <div className="absolute right-2 top-5 w-[58px] rounded-lg border border-[#FFFBEB] bg-white p-1.5 shadow-md md:right-3 md:top-5 md:w-[82px] md:rounded-xl md:p-2.5 sm:right-5 sm:w-[88px]">
            <div className="mb-1.5 h-5 rounded bg-[#F0F1F3] md:mb-2 md:h-9 md:rounded-md" />

            <div className="space-y-0.5 md:space-y-1">
              <div className="h-1 w-3/4 rounded bg-[#E2E4E8] md:h-1.5" />
              <div className="h-1 w-1/2 rounded bg-[#E2E4E8] md:h-1.5" />
            </div>

            <div className="mt-1.5 md:mt-3">
              <span className="text-[8px] font-bold text-[#0F1114] md:text-xs">
                ₹999
              </span>
            </div>

            <div className="mt-1 rounded border border-[#FFFBEB] bg-[#FFFBEB] px-1 py-0.5 text-center md:mt-2 md:rounded-md md:px-1.5 md:py-1">
              <span className="text-[6px] font-medium text-[#F59E0B] md:text-[9px]">
                No change
              </span>
            </div>
          </div>

          {/* Time delay chip */}
          <div className="absolute left-1/2 top-2 -translate-x-1/2 md:top-4">
            <div className="flex items-center gap-0.5 rounded-full border border-[#E2E4E8] bg-white px-1.5 py-0.5 shadow-sm md:gap-1 md:px-2 md:py-1">
              <Clock3 className="h-2 w-2 text-[#6B707A] md:h-3 md:w-3" />
              <span className="text-[6px] font-medium text-[#6B707A] md:text-[10px] sm:text-[11px]">
                2 days later
              </span>
            </div>
          </div>

          {/* Dashed comparison line */}
          <div className="absolute left-1/2 top-[42px] w-[42px] -translate-x-1/2 border-t border-dashed border-[#EF4444] opacity-40 md:top-[92px] md:w-[68px] sm:w-[84px]" />

          {/* Revenue impact badge */}
          <div className="absolute bottom-2 left-1/2 w-[110px] -translate-x-1/2 rounded-md border border-[#FEF2F2] bg-[#FEF2F2] px-1.5 py-1 shadow-sm backdrop-blur-sm md:bottom-3 md:w-[150px] md:rounded-lg md:px-2 md:py-2 sm:w-[165px]">
            <div className="flex items-center gap-1 md:gap-2">
              <div className="flex h-4 w-4 items-center justify-center rounded-full bg-white md:h-6 md:w-6">
                <TrendingDown className="h-2.5 w-2.5 text-[#EF4444] md:h-3.5 md:w-3.5" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-[6px] font-semibold text-[#EF4444] md:text-[9px]">
                  Late reactions cost revenue
                </p>
                <p className="text-[6px] text-[#EF4444] opacity-70 md:text-[9px]">
                  -12% sales impact
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex flex-1 flex-col p-2.5 md:p-4">
          <h2 className="text-[11px] md:text-sm font-semibold leading-[1.4] md:leading-5 text-[#]">
            Competitors Change Faster Than You Can React
          </h2>
        </div>
      </article>
    </div>
  );
};

export default Card3;