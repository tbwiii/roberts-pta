import BlurFade from "./magicui/blur-fade";
import { IconMail, IconBrandFacebookFilled } from "@tabler/icons-react";

const links = [
  {
    url: "https://www.facebook.com/RobertsElementaryPTA",
    icon: (
      <IconBrandFacebookFilled
        size={24}
        className="opacity-55 hover:opacity-100 transition-colors"
      />
    ),
  },
  {
    url: "mailto:carobertselempta@gmail.com",
    icon: (
      <IconMail
        size={24}
        className="opacity-55 hover:opacity-100 transition-colors"
      />
    ),
  },
];

export default function Social() {
  return (
    <BlurFade blur="10px" yOffset={20} delay={1}>
      <div className="flex items-center gap-8">
        {links.map(({ icon, url }, index) => {
          return (
            <div key={index}>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="text-white"
              >
                {icon}
              </a>
            </div>
          );
        })}
      </div>
    </BlurFade>
  );
}
