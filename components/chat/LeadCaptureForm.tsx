"use client"

// import { motion } from "framer-motion";
// import { useState } from "react";
// import { Loader2, Calendar, User, Mail, Phone } from "lucide-react";

// export function LeadCaptureForm({ onSubmit }: { onSubmit: (data: FormData) => void }) {
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState({ name: "", email: "", phone: "", date: "" });

//   const handle = (e: React.FormEvent) => {
//     e.preventDefault();
//     setLoading(true);
//     const fd = new FormData();
//     Object.entries(data).forEach(([k, v]) => fd.append(k, v));
//     setTimeout(() => onSubmit(fd), 900);
//   };

//   const inputs = [
//     { key: "name", placeholder: "Your name", type: "text", icon: User },
//     { key: "email", placeholder: "Email address", type: "email", icon: Mail },
//     { key: "phone", placeholder: "Phone number", type: "tel", icon: Phone },
//     { key: "date", placeholder: "Preferred date", type: "date", icon: Calendar },
//   ] as const;

//   return (
//     <motion.form
//       initial={{ opacity: 0, y: 10 }}
//       animate={{ opacity: 1, y: 0 }}
//       onSubmit={handle}
//       className="ml-9 glass rounded-2xl p-3.5 space-y-2.5"
//     >
//       {inputs.map(({ key, placeholder, type, icon: Icon }, i) => (
//         <motion.div
//           key={key}
//           initial={{ opacity: 0, x: -6 }}
//           animate={{ opacity: 1, x: 0 }}
//           transition={{ delay: 0.05 * i }}
//           className="relative group"
//         >
//           <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-brand transition-colors" />
//           <input
//             required
//             type={type}
//             placeholder={placeholder}
//             value={data[key as keyof typeof data]}
//             onChange={(e) => setData({ ...data, [key]: e.target.value })}
//             className="w-full pl-9 pr-3 py-2 text-sm bg-input/60 rounded-xl border border-border focus:border-brand focus:ring-2 focus:ring-brand/30 outline-none transition-all placeholder:text-muted-foreground/70"
//           />
//         </motion.div>
//       ))}
//       <motion.button
//         whileHover={{ scale: 1.01 }}
//         whileTap={{ scale: 0.98 }}
//         disabled={loading}
//         className="w-full py-2.5 mt-1 rounded-xl brand-gradient text-brand-foreground text-sm font-semibold shadow-glow flex items-center justify-center gap-2 disabled:opacity-70"
//       >
//         {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Schedule my call"}
//       </motion.button>
//     </motion.form>
//   );
// }

import emailjs from "@emailjs/browser";
import { motion } from "framer-motion";
import { useState } from "react";
import { Loader2, Calendar, User, Mail, Phone, CheckCircle } from "lucide-react";

// ✅ Reading actual env variables (not using them as strings)
const EMAILJS_SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!;
const EMAILJS_TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!;
const EMAILJS_PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!;

export function LeadCaptureForm({ onSubmit }: { onSubmit?: (data: FormData) => void }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({ name: "", email: "", phone: "", date: "" });

  const handle = async (e: React.FormEvent) => {
    console.log("Service ID:", EMAILJS_SERVICE_ID);
    console.log("Template ID:", EMAILJS_TEMPLATE_ID);
    console.log("Public Key:", EMAILJS_PUBLIC_KEY);
    console.log("FORM SUBMITTED")
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await emailjs.send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: data.name,
          email: data.email,
          phone: data.phone,
          date: data.date,
        },
        EMAILJS_PUBLIC_KEY
      );

      setSuccess(true);

      if (onSubmit) {
        const fd = new FormData();
        Object.entries(data).forEach(([k, v]) => fd.append(k, v));
        onSubmit(fd);
      }
    } catch (err) {
      console.error("EmailJS error:", err);
      setError("Failed to send. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputs = [
    { key: "name", placeholder: "Your name", type: "text", icon: User },
    { key: "email", placeholder: "Email address", type: "email", icon: Mail },
    { key: "phone", placeholder: "Phone number", type: "tel", icon: Phone },
    { key: "date", placeholder: "Preferred date", type: "date", icon: Calendar },
  ] as const;

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="ml-9 glass rounded-2xl p-6 flex flex-col items-center gap-3 text-center"
      >
        <CheckCircle className="w-8 h-8 text-green-500" />
        <p className="text-sm font-semibold">We got your details!</p>
        <p className="text-xs text-muted-foreground">
          We'll reach out to <span className="font-medium">{data.email}</span> shortly.
        </p>
      </motion.div>
    );
  }

  return (
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handle}
      className="ml-9 glass rounded-2xl p-3.5 space-y-2.5"
    >
      {inputs.map(({ key, placeholder, type, icon: Icon }, i) => (
        <motion.div
          key={key}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.05 * i }}
          className="relative group"
        >
          <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground group-focus-within:text-brand transition-colors" />
          <input
            required
            type={type}
            placeholder={placeholder}
            value={data[key as keyof typeof data]}
            onChange={(e) => setData({ ...data, [key]: e.target.value })}
            className="w-full pl-9 pr-3 py-2 text-sm bg-input/60 rounded-xl border border-border focus:border-brand focus:ring-2 focus:ring-brand/30 outline-none transition-all placeholder:text-muted-foreground/70"
          />
        </motion.div>
      ))}

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-xs text-red-500 text-center"
        >
          {error}
        </motion.p>
      )}

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        disabled={loading}
        className="w-full py-2.5 mt-1 rounded-xl brand-gradient text-brand-foreground text-sm font-semibold shadow-glow flex items-center justify-center gap-2 disabled:opacity-70"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Schedule my call"}
      </motion.button>
    </motion.form>
  );
}