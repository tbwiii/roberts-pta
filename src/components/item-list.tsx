import { ReactNode } from "react";
import Item from "./item";
import BlurFade from "./magicui/blur-fade";
import ShimmerButton from "./magicui/shimmer-button";
import {
  IconUsersGroup,
  IconCalendar,
  // IconRocket,
  IconShirtFilled,
  IconHeartHandshake,
  IconHearts,
  IconClipboard,
  // IconInfoSquareRoundedFilled,
  // IconMusic,
  IconGiftFilled,
  // IconLeaf2,
} from "@tabler/icons-react";

interface Link {
  name: string;
  url: string;
  icon: ReactNode;
}

const links: Link[] = [
  {
    name: "Volunteer Signup",
    url: " https://www.signupgenius.com/go/10C0A4CA4AA2AA1FFC07-59178340-2025#/",
    icon: <IconClipboard size={24} />,
  },
  {
    name: "Upcoming Events",
    url: "https://ryanashleyw.my.canva.site/upcoming-events",
    icon: <IconCalendar size={24} />,
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
  {
    name: "Staff Favorite Things",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSc247UoCztzO26dfOyM3X1IamlyUFvIENOmGdBNpcTJ01HlQw/viewform",
    icon: <IconHearts size={24} />,
  },
];

const ItemList = () => {
  return (
    <ul className="max-w-lg mx-auto grid gap-6 mb-6 w-full">
      <li>
        <BlurFade xOffset={-10} duration={0.35} delay={8 * 0.1}>
          <ShimmerButton
            className="shadow-2xl"
            href="https://www.signupgenius.com/go/10C0A4CA4AA2AA1FFC07-58420639-kindergarten"
          >
            <IconGiftFilled size={24} />
            Raffle Basket Donations
          </ShimmerButton>
        </BlurFade>
      </li>
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
