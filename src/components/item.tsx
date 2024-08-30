"use client";
import { ReactNode, useEffect, useRef } from "react";
import ClipboardJS from "clipboard";
import { Tooltip } from "react-tooltip";
import { IconCopy } from "@tabler/icons-react";

export default function Item({
  name,
  url,
  icon,
}: {
  name: string;
  url: string;
  icon: ReactNode;
}) {
  // Reference for the copy button
  const copyButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    // Initialize ClipboardJS when the component mounts
    const clipboard = new ClipboardJS(copyButtonRef.current!, {
      text: () => url, // Function to get the text to copy
    });

    clipboard.on("success", (e: ClipboardJS.Event) => {
      e.clearSelection();
    });

    clipboard.on("error", (e: ClipboardJS.Event) => {
      console.error("Failed to copy text:", e);
    });

    return () => clipboard.destroy();
  }, [url]);

  return (
    <li
      className={`
        grid
        grid-cols-8
        rounded-md
        overflow-hidden
        font-light
        w-full`}
    >
      <a
        className="
          flex
          items-center
          gap-4
          p-4
          transition-all
          bg-slate-300
          hover:bg-slate-200
          text-roberts_blue-700
          group
          shadow-md
          md:text-xl
          uppercase
          col-span-6
          md:col-span-7"
        href={url}
      >
        <span className="group-hover:text-roberts_red-400">{icon}</span>
        <span className="font-roberts">{name}</span>
      </a>
      <button
        ref={copyButtonRef}
        data-tooltip-id="copyTooltip"
        data-tooltip-content="Copy Link"
        data-tooltip-place="left"
        className="
          rounded-l-none;
          flex
          transition-all
          bg-roberts_red-400
          text-white
          hover:bg-roberts-500
          items-center
          justify-center
          col-span-2
          md:col-span-1
          "
        data-clipboard-text={url}
      >
        <IconCopy stroke={2} />
      </button>
      <Tooltip opacity={0.2} id="copyTooltip" />
    </li>
  );
}
