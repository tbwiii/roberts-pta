import BlurFade from "./magicui/blur-fade";

const flames = [
  {
    src: "/flame-lg.png",
    top: -35,
    delay: 0.2,
  },
  {
    src: "/flame-md.png",
    top: -25,
    delay: 0.6,
  },
  {
    src: "/flame-sm.png",
    top: -8,
    delay: 0.1,
  },
];

const Flames = () => (
  <div className="relative flex items-center justify-center">
    {flames.map((f, index) => (
      <img
        className="absolute animate-flame"
        style={{
          top: `${f.top}px`,
          animationDelay: `${f.delay}s`,
        }}
        key={index}
        src={f.src}
        alt="flame"
      />
    ))}
  </div>
);

export function TitleSection() {
  return (
    <div className="flex max-sm:flex-col gap-28 -mb-4 items-center">
      <BlurFade blur="10px" xOffset={-20} duration={0.8}>
        <div className="animate-float">
          <div className="animate-wiggle">
            <img
              className="
                relative
                z-10"
              alt="Roberts Elementary Rocket"
              src="/rocket.png"
            />
            <Flames />
          </div>
        </div>
      </BlurFade>
      <BlurFade blur="10px" xOffset={20} duration={0.8}>
        <div
          className={`
            translate-x-[20px]
            text-white
            text-4xl
            lg:text-7xl
            text-left
            font-black
            flex
            flex-col
            gap-2`}
        >
          <div className="block">ROBERTS</div>
          <div className="block">ELEMENTARY</div>
          <div className="block text-roberts_red-400">PTA</div>
        </div>
      </BlurFade>
    </div>
  );
}
