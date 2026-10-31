"use client";

import { useEffect, useRef, type ComponentPropsWithoutRef } from "react";

type Props = Omit<ComponentPropsWithoutRef<"dialog">, "onClose"> & {
  onClose: () => void;
};

/** Le dialogue natif rend l’arrière-plan inerte et gère le retour du focus. */
export function AccessibleDialog({ onClose, className, children, ...props }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const overflow = document.body.style.overflow;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = overflow;
    };
  }, []);
  return (
    <dialog
      {...props}
      ref={ref}
      aria-modal="true"
      className={`m-0 h-dvh max-h-none w-screen max-w-none border-0 bg-transparent p-0 text-inherit outline-none [&:not([open])]:hidden ${className ?? ""}`}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
    >
      {children}
    </dialog>
  );
}
