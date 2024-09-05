import React, { CSSProperties } from "react";

import { cn } from "../../../src/lib/utils";

export interface ShimmerButtonProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
  href?: string;
}

const ShimmerButton = React.forwardRef<HTMLAnchorElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "white",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "7px",
      background = "rgba(220, 87, 70,1)",
      className,
      children,
      href,
      ...props
    },
    ref
  ) => {
    return (
      <a
        href={href}
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as CSSProperties
        }
        className={cn(
          `w-full
          group
          relative
          z-0
          flex
          cursor-pointer
          items-center
          justify-center
          overflow-hidden
          whitespace-nowrap
          border
          border-white/10
          px-6
          py-4
          text-xl
          [border-radius:var(--radius)]`,
          "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-[1px]",
          className
        )}
        {...props}
        ref={ref}
      >
        {/* spark container */}
        <div
          className={cn(
            "-z-30 blur-[2px]",
            "absolute inset-0 overflow-visible [container-type:size]"
          )}
        >
          {/* spark */}
          <div className="absolute inset-0 h-[100cqh] animate-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
            {/* spark before */}
            <div
              className="
              animate-spin-around
              absolute
              inset-[-100%]
              w-auto
              rotate-0
              [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))]
              [translate:0_0]"
            />
          </div>
        </div>
        <span
          className="
          flex
          gap-4
          items-center
          text-roberts_red-800
          group-hover:text-white
          transition-colors"
        >
          {children}
        </span>

        {/* Highlight */}
        <div
          className={cn(
            "insert-0 absolute h-full w-full",

            "rounded-2xl px-4 py-1.5 text-sm font-medium shadow-[inset_0_-8px_10px_#ffffff1f]",

            // transition
            "transform-gpu transition-all duration-300 ease-in-out",

            // on hover
            "group-hover:shadow-[inset_0_-6px_10px_#ffffff3f]",

            // on click
            "group-active:shadow-[inset_0_-10px_10px_#ffffff3f]"
          )}
        />

        {/* backdrop */}
        <div
          className={cn(
            "absolute -z-20 [background:var(--bg)] [border-radius:var(--radius)] [inset:var(--cut)]"
          )}
        />
      </a>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";

export default ShimmerButton;
