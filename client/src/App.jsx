import { Routes, Route } from "react-router-dom";
import Header from "./components/Header"
import Hero from "./components/Hero"
import Home from "./components/Home"
import HeroPowerForm from "./components/HeroPowerForm"
import Power from "./components/Power"
import PowerEditForm from "./components/PowerEditForm"

function App() {
  return (
    <div>
      <Header />
      <main>
        <Routes>
          <Route path="/hero_powers/new" element={<HeroPowerForm />} />
          <Route path="/powers/:id/edit" element={<PowerEditForm />} />
          <Route path="/powers/:id" element={<Power />} />
          <Route path="/heroes/:id" element={<Hero />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;