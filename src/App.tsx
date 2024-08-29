import { TitleSection } from "./components/title-section";
import "./App.css";
import Social from "./components/social";
import ItemList from "./components/item-list";

function App() {
  return (
    <div
      className="
      font-roberts
      bg-gradient-to-b
      from-roberts_blue-900
      to-roberts_blue-700
      flex
      flex-col
      min-h-screen
      justify-center
      items-center
      gap-10"
    >
      <TitleSection />
      <Social />
      <ItemList />
    </div>
  );
}

export default App;
