import { Globe, ShoppingBag, ShoppingCart, Store } from "lucide-react";

const Card1 = () => {
  return (
    <div className="w-full">
      <article style={{
        display: "flex", flexDirection: "column", width: "100%", height: "100%",
        overflow: "hidden", borderRadius: 16,
        border: "1px solid #E2E4E8",
        background: "#FFFFFF",
        boxShadow: "0 4px 24px rgba(15,17,20,0.08)",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
      }}
        onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = "translateY(-4px)"; (e.currentTarget as HTMLElement).style.boxShadow = "0 8px 32px rgba(15,17,20,0.12)"; }}
        onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = ""; (e.currentTarget as HTMLElement).style.boxShadow = "0 4px 24px rgba(15,17,20,0.08)"; }}
      >
        {/* Visual */}
        <div style={{
          position: "relative", height: 208, overflow: "hidden",
          background: "linear-gradient(135deg, #F0F1F3 0%, #E2E4E8 50%, #F0F1F3 100%)",
        }}>
          {/* Overlapping browser windows */}
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {/* Window 1 - back */}
            <div style={{
              position: "absolute", height: 112, width: 176,
              transform: "translate(-48px, -24px) rotate(-8deg)",
              borderRadius: 8, border: "1px solid #E2E4E8",
              background: "rgba(255,255,255,0.9)", boxShadow: "0 2px 12px rgba(15,17,20,0.08)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #E2E4E8", padding: "6px 8px" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", opacity: 0.6, display: "block" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B", opacity: 0.6, display: "block" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16A34A", opacity: 0.6, display: "block" }} />
              </div>
              <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ height: 8, width: "75%", borderRadius: 4, background: "#E2E4E8" }} />
                <div style={{ height: 8, width: "50%", borderRadius: 4, background: "#E2E4E8" }} />
                <div style={{ height: 24, width: "100%", borderRadius: 4, background: "#F0F1F3" }} />
              </div>
            </div>
            {/* Window 2 - middle */}
            <div style={{
              position: "absolute", height: 112, width: 176,
              transform: "translate(8px, 4px) rotate(3deg)",
              borderRadius: 8, border: "1px solid #E2E4E8",
              background: "#FFFFFF", boxShadow: "0 4px 16px rgba(15,17,20,0.1)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #E2E4E8", padding: "6px 8px" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", opacity: 0.6, display: "block" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B", opacity: 0.6, display: "block" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16A34A", opacity: 0.6, display: "block" }} />
              </div>
              <div style={{ padding: 8, display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
                <div style={{ height: 20, borderRadius: 4, background: "#E2E4E8" }} />
                <div style={{ height: 20, borderRadius: 4, background: "#E2E4E8" }} />
                <div style={{ height: 20, borderRadius: 4, background: "#E2E4E8" }} />
                <div style={{ gridColumn: "1 / -1", height: 8, borderRadius: 4, background: "#E2E4E8" }} />
                <div style={{ gridColumn: "span 2", height: 8, borderRadius: 4, background: "#E2E4E8" }} />
              </div>
            </div>
            {/* Window 3 - front */}
            <div style={{
              position: "absolute", height: 112, width: 176,
              transform: "translate(56px, 32px) rotate(10deg)",
              borderRadius: 8, border: "1px solid #E2E4E8",
              background: "#FFFFFF", boxShadow: "0 4px 16px rgba(15,17,20,0.1)",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #E2E4E8", padding: "6px 8px" }}>
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#EF4444", opacity: 0.6, display: "block" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#F59E0B", opacity: 0.6, display: "block" }} />
                <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#16A34A", opacity: 0.6, display: "block" }} />
              </div>
              <div style={{ padding: 8, display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{ height: 8, width: "66%", borderRadius: 4, background: "#E2E4E8" }} />
                <div style={{ height: 28, width: "100%", borderRadius: 4, background: "#F0F1F3" }} />
                <div style={{ height: 8, width: "50%", borderRadius: 4, background: "#E2E4E8" }} />
              </div>
            </div>
          </div>

          {/* Floating icons */}
          <div style={{ position: "absolute", right: 12, top: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "1px solid #E2E4E8", background: "#FFFFFF", boxShadow: "0 2px 8px rgba(15,17,20,0.08)", transform: "rotate(-6deg)" }}>
            <ShoppingCart size={16} color="#0F1114" />
          </div>
          <div style={{ position: "absolute", bottom: 12, left: 12, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "1px solid #E2E4E8", background: "#FFFFFF", boxShadow: "0 2px 8px rgba(15,17,20,0.08)", transform: "rotate(8deg)" }}>
            <ShoppingBag size={16} color="#0F1114" />
          </div>
          <div style={{ position: "absolute", left: 8, top: "50%", transform: "translateY(-50%) rotate(-12deg)", width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "1px solid #E2E4E8", background: "#FFFFFF", boxShadow: "0 2px 8px rgba(15,17,20,0.08)" }}>
            <Store size={16} color="#0F1114" />
          </div>
          <div style={{ position: "absolute", bottom: 16, right: 16, width: 36, height: 36, display: "flex", alignItems: "center", justifyContent: "center", borderRadius: 8, border: "1px solid #E2E4E8", background: "#FFFFFF", boxShadow: "0 2px 8px rgba(15,17,20,0.08)", transform: "rotate(14deg)" }}>
            <Globe size={16} color="#0F1114" />
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: 16, flex: 1, display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: 14, fontWeight: 600, lineHeight: 1.4, color: "#0F1114" }}>
            Your Team Is Working Across 6 Different Tools
          </h2>
        </div>
      </article>
    </div>
  );
};

export default Card1;