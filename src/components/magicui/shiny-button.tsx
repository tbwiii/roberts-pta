"use client";
import { ReactNode } from "react";
import { motion, type AnimationProps } from "framer-motion";

import { cn } from "../../../src/lib/utils";

const animationProps = {
  initial: { "--x": "100%", scale: 0.8 },
  animate: { "--x": "-100%", scale: 1 },
  whileTap: { scale: 0.95 },
  transition: {
    repeat: Infinity,
    repeatType: "loop",
    repeatDelay: 1,
    type: "spring",
    stiffness: 20,
    damping: 15,
    mass: 2,
    scale: {
      type: "spring",
      stiffness: 200,
      damping: 5,
      mass: 0.5,
    },
  },
} as AnimationProps;
interface ShinyButtonProps {
  icon?: ReactNode;
  text: string;
  className?: string;
}
const ShinyButton = ({
  icon,
  text = "shiny-button",
  className,
}: ShinyButtonProps) => {
  return (
    <motion.button
      {...animationProps}
      className={cn(
        "relative rounded-lg overflow-hidden w-full font-medium backdrop-blur-xl transition-[box-shadow] duration-300 ease-in-out hover:shadow bg-[radial-gradient(circle_at_50%_0%,hsl(var(--primary)/10%)_0%,transparent_60%)]]",
        className
      )}
    >
      <span
        className="relative flex items-center px-6 py-5 bg-[rgba(255,255,255,.8)] text-roberts_blue-700 text-xl gap-4 h-full w-full text-sm uppercase tracking-wide]"
        style={{
          maskImage:
            "linear-gradient(-75deg,hsl(var(--primary)) calc(var(--x) + 20%),transparent calc(var(--x) + 30%),hsl(var(--primary)) calc(var(--x) + 100%))",
        }}
      >
        {icon}
        {text}
      </span>
      <span
        style={{
          mask: "linear-gradient(rgb(200,200,200), rgb(200,200,200)) content-box,linear-gradient(rgb(200,200,200), rgb(200,200,200)",
          maskComposite: "exclude",
        }}
        className="absolute inset-0 z-10 block rounded-[inherit] bg-[linear-gradient(-75deg,hsl(var(--primary)/10%)_calc(var(--x)+20%),hsl(var(--primary)/50%)_calc(var(--x)+25%),hsl(var(--primary)/10%)_calc(var(--x)+100%))] p-px"
      ></span>
    </motion.button>
  );
};

export default ShinyButton;
