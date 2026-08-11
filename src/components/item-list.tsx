import { ReactNode } from "react";
import Item from "./item";
import BlurFade from "./magicui/blur-fade";
import ShimmerButton from "./magicui/shimmer-button";
import {
  IconUsersGroup,
  IconShirtFilled,
  IconHeartHandshake,
  IconHearts,
  IconClipboardList,
  IconCalendarEvent,
} from "@tabler/icons-react";

interface Link {
  name: string;
  url: string;
  icon: ReactNode;
}

const links: Link[] = [
  {
    name: "Upcoming Events",
    url: "https://drive.google.com/file/d/1vOLPFBTOusWi8hZV7faUPKuxGGOSCfEa/preview",
    icon: <IconCalendarEvent size={24} />,
  },
  {
    name: "Staff: Favorite Things Survey",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSc247UoCztzO26dfOyM3X1IamlyUFvIENOmGdBNpcTJ01HlQw/viewform?usp=sharing&ouid=113551781995939037739",
    icon: <IconHearts size={24} />,
  },
  {
    name: "Volunteer Info",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSeHZtwFzAcanaq3lEqVg8ic00kFt9ZAPJWNMvRyic4SR_kDgA/viewform?usp=sharing&ouid=113551781995939037739",
    icon: <IconClipboardList size={24} />,
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
            href="https://jointotem.com/ga/dallas/c-a-roberts-elementary-pta/join/register"
          >
            <IconUsersGroup size={24} />
            Join the PTA
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
