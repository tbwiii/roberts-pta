import Item from "./item";
import BlurFade from "./magicui/blur-fade";

interface Link {
  name: string;
  url: string;
}

const links: Link[] = [
  {
    name: "Join the PTA",
    url: "https://jointotem.com/ga/dallas/c-a-roberts-elementary-pta/join/register",
  },
  {
    name: "Spirit Wear",
    url: "https://roberts.givebacks.com/store?limit=21&live=true&category=Spirit%20Wear",
  },
  {
    name: "Spirit Nights",
    url: "https://ryanashleyw.my.canva.site/roberts-spirit-nights",
  },
  {
    name: "Volunteer",
    url: "https://forms.gle/gi3NQf2qR4WFXBUo9",
  },
  {
    name: "Teacher Grant Requests",
    url: "https://docs.google.com/forms/d/e/1FAIpQLSequC9TlZ9t_OOtEoaabCvcv8RV8lMOKtk-zilm0KELqg8l-A/viewform?usp=sf_link",
  },
  {
    name: "Sponsorships & Donations",
    url: "https://roberts.givebacks.com/store?limit=21&live=true&category=Donations",
  },
];

const ItemList = () => (
  <ul className="max-w-lg mx-auto grid gap-6 mb-6 w-full">
    {links.map((link: Link, index: number) => (
      <BlurFade
        key={index}
        xOffset={-10}
        duration={0.35}
        delay={(index + 9) * 0.1}
      >
        <Item key={index} name={link.name} url={link.url} />
      </BlurFade>
    ))}
  </ul>
);

export default ItemList;
