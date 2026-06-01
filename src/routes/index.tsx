import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { PhoneFrame } from "@/components/PhoneFrame";
import logo from "@/assets/logo.jpeg";
import mountain from "@/assets/mountain-hero.jpg";

function Splash() {
  const navigate = useNavigate();
  useEffect(() => {
    const t = setTimeout(() => navigate("/onboarding"), 2600);
    return () => clearTimeout(t);
  }, [navigate]);

  return (
    <PhoneFrame>
      <div className="relative h-full w-full flex-1 grain overflow-hidden">
        <img src={mountain} alt="" className="absolute inset-0 h-full w-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/70 to-background" />

        <div className="relative h-full flex flex-col items-center justify-center px-8 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0, filter: "blur(20px)" }}
            animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
            transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <div className="absolute -inset-12 rounded-full blur-3xl opacity-50"
              style={{ background: "radial-gradient(circle, var(--gold) 0%, transparent 65%)" }} />
            <div className="relative h-32 w-32 rounded-[2rem] overflow-hidden ring-1 ring-white/15 shadow-2xl">
              <img src={logo} alt="" className="h-full w-full object-cover" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="mt-8 text-4xl font-bold text-gradient-gold tracking-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ذاكرة الجبل
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 1 }}
            className="mt-2 text-sm text-white/60 tracking-wide"
          >
            حكايات الأمس بتقنيات اليوم
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.8 }}
            className="absolute bottom-16 left-0 right-0 flex flex-col items-center gap-3"
          >
            <div className="h-1 w-32 rounded-full bg-white/10 overflow-hidden">
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="h-full w-1/2"
                style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)" }}
              />
            </div>
            <Link to="/onboarding" className="text-[11px] text-white/40 tracking-widest">تخطي</Link>
          </motion.div>
        </div>
      </div>
    </PhoneFrame>
  );
}

export default Splash;
