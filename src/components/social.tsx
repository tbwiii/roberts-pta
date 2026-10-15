import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { springs, timeline } from "../lib/motion";
import {
  IconCode,
  IconMail,
  IconBrandFacebookFilled,
} from "@tabler/icons-react";
import LeadModal from "./lead-modal";

const links = [
  {
    label: "Find us on Facebook",
    url: "https://www.facebook.com/carobertspta/",
    icon: <IconBrandFacebookFilled size={22} />,
    external: true,
  },
  {
    label: "Email the PTA",
    url: "mailto:carobertselempta@gmail.com",
    icon: <IconMail size={22} />,
    external: false,
  },
];

export default function Social() {
  const reduce = useReducedMotion();
  const [leadOpen, setLeadOpen] = useState(false);
  return (
    <footer className="flex flex-wrap gap-3 border-t-2 border-dashed border-roberts_blue-600 pt-6">
      {links.map(({ icon, url, label, external }, i) => (
        <motion.a
          initial={reduce ? false : { opacity: 0, y: 14 }}
          animate={{
            opacity: 1,
            y: 0,
            transition: { ...springs.pop, delay: timeline.footer + i * 0.08 },
          }}
          key={url}
          href={url}
          {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
          className="flex items-center gap-2 rounded-full border-2 border-roberts_blue-200 px-4 py-2.5 font-semibold text-roberts_blue-50 outline-none transition-colors hover:bg-roberts_blue-50 hover:text-roberts_blue-900 focus-visible:ring-4 focus-visible:ring-[#ffc94a]"
        >
          {icon}
          {label}
        </motion.a>
      ))}
      <motion.button
        type="button"
        onClick={() => setLeadOpen(true)}
        initial={reduce ? false : { opacity: 0, y: 14 }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            ...springs.pop,
            delay: timeline.footer + links.length * 0.08,
          },
        }}
        className="flex items-center gap-2 rounded-full bg-[#ffc94a] px-4 py-2.5 font-bold text-roberts_blue-900 outline-none transition-opacity hover:opacity-90 focus-visible:ring-4 focus-visible:ring-roberts_blue-50"
      >
        <IconCode size={22} />
        Need a website?
      </motion.button>
      <p className="basis-full text-sm text-roberts_blue-200">
        Built and maintained for free by Ted.
      </p>
      <LeadModal open={leadOpen} onClose={() => setLeadOpen(false)} />
    </footer>
  );
}
