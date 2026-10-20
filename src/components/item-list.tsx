import { ReactNode } from "react";
import Item, { Tone } from "./item";
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
  note: string;
  icon: ReactNode;
  tone: Tone;
}

const links: Link[] = [
  {
    name: "Join the PTA",
    note: "Become a member for the year",
    tone: "yellow",
    url: "https://jointotem.com/ga/dallas/c-a-roberts-elementary-pta/join/register",
    icon: <IconUsersGroup size={26} />,
  },
  {
    name: "Volunteer info",
    note: "Sign up to lend a hand",
    tone: "red",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSeHZtwFzAcanaq3lEqVg8ic00kFt9ZAPJWNMvRyic4SR_kDgA/viewform?usp=sharing&ouid=113551781995939037739",
    icon: <IconClipboardList size={26} />,
  },
  {
    name: "Upcoming events",
    note: "See what is coming up",
    tone: "white",
    url: "https://drive.google.com/file/d/1vOLPFBTOusWi8hZV7faUPKuxGGOSCfEa/preview",
    icon: <IconCalendarEvent size={26} />,
  },
  {
    name: "Staff favorite things",
    note: "Gift ideas for teachers and staff",
    tone: "white",
    url: "/#/favorites",
    icon: <IconHearts size={26} />,
  },
  {
    name: "Spirit wear",
    note: "Shop shirts and gear",
    tone: "white",
    url: "https://roberts.givebacks.com/store?limit=21&live=true&category=Spirit%20Wear",
    icon: <IconShirtFilled size={26} />,
  },
  {
    name: "Sponsorships and donations",
    note: "Give back to our school",
    tone: "white",
    url: "https://roberts.givebacks.com/shop?category=18382",
    icon: <IconHeartHandshake size={26} />,
  },
];

const ItemList = () => {
  const [featured, ...rest] = links;
  return (
    <nav aria-label="PTA links">
      <ul className="grid gap-5 sm:grid-cols-2">
        <Item {...featured} featured index={0} />
        {rest.map((link, i) => (
          <Item
            key={link.url}
            {...link}
            index={i + 1}
            // Volunteer spans the row under Join so the two asks read as a pair.
            wide={i === 0}
          />
        ))}
      </ul>
    </nav>
  );
};

export default ItemList;
