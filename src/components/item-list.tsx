import { ReactNode } from "react";
import Item from "./item";
import BlurFade from "./magicui/blur-fade";
// import ShimmerButton from "./magicui/shimmer-button";
import {
  IconUsersGroup,
  IconClipboard,
  // IconRocket,
  IconShirtFilled,
  IconHeartHandshake,
  // IconHearts,
  // IconInfoSquareRoundedFilled,
} from "@tabler/icons-react";

interface Link {
  name: string;
  url: string;
  icon: ReactNode;
}

const links: Link[] = [
  // {
  //   name: "Spirit Nights",
  //   url: "https://ryanashleyw.my.canva.site/roberts-spirit-nights",
  //   icon: <IconRocket size={24} />,
  // },
  {
    name: "Join the PTA",
    url: "https://jointotem.com/ga/dallas/c-a-roberts-elementary-pta/join/register",
    icon: <IconUsersGroup size={24} />,
  },
  {
    name: "Spirit Wear",
    url: "https://roberts.givebacks.com/store?limit=21&live=true&category=Spirit%20Wear",
    icon: <IconShirtFilled size={24} />,
  },
  {
    name: "Volunteer",
    url: "https://forms.gle/gi3NQf2qR4WFXBUo9",
    icon: <IconClipboard size={24} />,
  },
  {
    name: "Sponsorships & Donations",
    url: "https://roberts.givebacks.com/shop?category=18382",
    icon: <IconHeartHandshake size={24} />,
  },
];

const ItemList = () => {
  return (
    <ul className="max-w-lg mx-auto grid gap-6 mb-6 w-full">
      {/* <li>
        <BlurFade xOffset={-10} duration={0.35} delay={8 * 0.1}>
          <ShimmerButton
            className="shadow-2xl"
            href="https://roberts.givebacks.com/store?limit=21&live=true&category=Valentine's%20Day%20Grams"
          >
            <IconHearts size={24} />
            VALENTINES GRAMS
          </ShimmerButton>
        </BlurFade>
      </li> */}
      {links.map((link: Link, index: number) => (
        <BlurFade
          key={index}
          xOffset={-10}
          duration={0.35}
          delay={(index + 9) * 0.1}
        >
          <Item key={index} name={link.name} url={link.url} icon={link.icon} />
        </BlurFade>
      ))}
    </ul>
  );
};

export default ItemList;
