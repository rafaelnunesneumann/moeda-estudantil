"use client"

import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      position="top-right"
      gap={8}
      toastOptions={{
        unstyled: true,
        classNames: {
          toast:
            "flex items-center gap-3 w-full rounded-lg border border-slate-200 bg-white px-4 py-3 shadow-md shadow-black/[0.06] text-sm text-slate-800",
          title: "font-medium text-slate-900 leading-snug",
          description: "text-slate-500 text-xs leading-snug",
          icon: "flex-shrink-0 text-slate-400",
          closeButton:
            "flex-shrink-0 ml-auto text-slate-400 hover:text-slate-700 transition-colors cursor-pointer",
          success: "border-l-2 border-l-emerald-400 [&_[data-icon]]:text-emerald-500",
          error: "border-l-2 border-l-rose-400 [&_[data-icon]]:text-rose-500",
          info: "border-l-2 border-l-indigo-400 [&_[data-icon]]:text-indigo-500",
          warning: "border-l-2 border-l-amber-400 [&_[data-icon]]:text-amber-500",
        },
      }}
      style={{ "--width": "340px" } as React.CSSProperties}
      {...props}
    />
  )
}

export { Toaster }
