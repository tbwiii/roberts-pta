import "./App.css";
import { TitleSection } from "./components/title-section";
import ItemList from "./components/item-list";
import Social from "./components/social";
import Starfield from "./components/starfield";
import InstallBanner from "./components/install-banner";

function App() {
  return (
    <div className="font-roberts relative min-h-screen overflow-hidden bg-roberts_blue-900">
      <Starfield />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[34rem] bg-gradient-to-b from-roberts_blue-700/70 to-transparent"
      />
      <main className="relative mx-auto flex w-full max-w-2xl flex-col gap-8 px-4 pb-12 pt-8 sm:px-6 sm:pt-14">
        <TitleSection />
        <ItemList />
        <Social />
      </main>
      <InstallBanner />
    </div>
  );
}

export default App;
