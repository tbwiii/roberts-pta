import { ReactNode } from "react";
import Item from "./item";
import BlurFade from "./magicui/blur-fade";
// import ShimmerButton from "./magicui/shimmer-button";
import {
  IconUsersGroup,
  IconClipboard,
  IconRocket,
  IconShirtFilled,
  IconHeartHandshake,
  IconInfoSquareRoundedFilled,
} from "@tabler/icons-react";

interface Link {
  name: string;
  url: string;
  icon: ReactNode;
}

const links: Link[] = [
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
    name: "Spirit Nights",
    url: "https://ryanashleyw.my.canva.site/roberts-spirit-nights",
    icon: <IconRocket size={24} />,
  },
  {
    name: "Volunteer",
    url: "https://forms.gle/gi3NQf2qR4WFXBUo9",
    icon: <IconClipboard size={24} />,
  },
  {
    name: "Teacher Grant Requests",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSequC9TlZ9t_OOtEoaabCvcv8RV8lMOKtk-zilm0KELqg8l-A/viewform?usp=sf_link",
    icon: <IconInfoSquareRoundedFilled size={24} />,
  },
  {
    name: "Sponsorships & Donations",
    url: "https://roberts.givebacks.com/store?limit=21&live=true&category=Donations",
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
            href="https://www.signupgenius.com/go/10C0A4CA4AA2AA1FFC07-52293212-roberts#/"
          >
            <IconBuildingStore size={24} />
            Holiday Shop Volunteers
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
