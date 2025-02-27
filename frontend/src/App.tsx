import { HashRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Characters from "./pages/Characters";
import Classes from "./pages/Classes";
import Items from "./pages/Items";
import Quests from "./pages/Quests";
import Chests from "./pages/Chests";
import CharacterHasItems from "./pages/CharacterHasItems";
import ChestHasItems from "./pages/ChestHasItems";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="characters" element={<Characters />} />
          <Route path="classes" element={<Classes />} />
          <Route path="items" element={<Items />} />
          <Route path="quests" element={<Quests />} />
          <Route path="chests" element={<Chests />} />
          <Route path="character_has_items" element={<CharacterHasItems />} />
          <Route path="chest_has_items" element={<ChestHasItems />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
