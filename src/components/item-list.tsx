import { ReactNode } from "react";
import Item from "./item";
import BlurFade from "./magicui/blur-fade";
import ShimmerButton from "./magicui/shimmer-button";
import {
  IconUsersGroup,
  IconShirtFilled,
  IconHeartHandshake,
  IconHearts,
  IconBackpack,
} from "@tabler/icons-react";

interface Link {
  name: string;
  url: string;
  icon: ReactNode;
}

const links: Link[] = [
  {
    name: "Staff Favorite Things",
    url: "https://docs.google.com/spreadsheets/d/19K9Up1PPd7JNx4KElfIJ3UyNqCtGmI91fiasncCg4eI/edit?usp=sharing",
    icon: <IconHearts size={24} />,
  },
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
    name: "Sponsorships & Donations",
    url: "https://roberts.givebacks.com/shop?category=18382",
    icon: <IconHeartHandshake size={24} />,
  },
];

const ItemList = () => {
  return (
    <ul className="max-w-lg mx-auto grid gap-6 mb-6 w-full">
      <li>
        <BlurFade xOffset={-10} duration={0.35} delay={8 * 0.1}>
          <ShimmerButton
            className="shadow-2xl"
            href="https://1stdayschoolsupplies.com/gs/27082"
          >
            <IconBackpack size={24} />
            1st Day School Supplies
          </ShimmerButton>
        </BlurFade>
      </li>
      {/* <li>
        <BlurFade xOffset={-10} duration={0.35} delay={8 * 0.1}>
          <ShimmerButton
            className="shadow-2xl"
            href="https://roberts.givebacks.com/shop?category=617945fb-35d7-4490-8aaf-f664f39b5fd3"
          >
            Bingo Night
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
