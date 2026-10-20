"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/i18n/context";

const MIN_MS = 1600;
const MAX_MS = 3200;
const SESSION_KEY = "opale-splash-done";

export function LoadingScreen() {
  const { t } = useI18n();
  // null = pas encore monté (évite mismatch SSR / sessionStorage)
  const [show, setShow] = useState<boolean | null>(null);
  const [progress, setProgress] = useState(8);
  const done = useRef(false);

  useEffect(() => {
    try {
      if (sessionStorage.getItem(SESSION_KEY) === "1") {
        setShow(false);
        return;
      }
    } catch {
      // private mode — show splash
    }

    setShow(true);
    document.body.classList.add("splash-lock");

    const started = performance.now();
    let raf = 0;

    const tick = () => {
      const elapsed = performance.now() - started;
      const target = Math.min(90, 18 + elapsed / 22);
      setProgress((p) => (p < target ? target : p));
      raf = window.requestAnimationFrame(tick);
    };
    raf = window.requestAnimationFrame(tick);

    const finish = () => {
      if (done.current) return;
      done.current = true;

      const elapsed = performance.now() - started;
      const wait = Math.max(0, MIN_MS - elapsed);

      window.setTimeout(() => {
        setProgress(100);
        window.setTimeout(() => {
          setShow(false);
          document.body.classList.remove("splash-lock");
          try {
            sessionStorage.setItem(SESSION_KEY, "1");
          } catch {
            // ignore
          }
        }, 420);
      }, wait);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    const maxTimer = window.setTimeout(finish, MAX_MS);

    return () => {
      window.cancelAnimationFrame(raf);
      window.clearTimeout(maxTimer);
      window.removeEventListener("load", finish);
      document.body.classList.remove("splash-lock");
    };
  }, []);

  return (
    <AnimatePresence>
      {show === true && (
        <motion.div
          className="splash"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          aria-busy="true"
          aria-live="polite"
          role="status"
        >
          <div className="splash__bg" aria-hidden />
          <div className="splash__grain" aria-hidden />
          <div className="splash__ember splash__ember--a" aria-hidden />
          <div className="splash__ember splash__ember--b" aria-hidden />

          <div className="splash__inner">
            <motion.p
              className="splash__since"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45, delay: 0.05 }}
            >
              {t("hero.since")} · Neufchâteau
            </motion.p>

            <motion.h1
              className="splash__brand"
              initial={{ opacity: 0, y: 28, letterSpacing: "0.2em" }}
              animate={{ opacity: 1, y: 0, letterSpacing: "0.06em" }}
              transition={{
                duration: 0.7,
                delay: 0.12,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              OPALE
            </motion.h1>

            <motion.p
              className="splash__hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.35 }}
            >
              {t("loading.hint")}
            </motion.p>

            <motion.div
              className="splash__progress"
              initial={{ opacity: 0, scaleX: 0.6 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: 0.4, delay: 0.28 }}
              aria-hidden
            >
              <div
                className="splash__progress-fill"
                style={{ width: `${progress}%` }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
