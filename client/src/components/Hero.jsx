import  { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function Hero() {
  const [{ data: hero, error, status }, setHero] = useState({
    data: null,
    error: null,
    status: "pending",
  });
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/heroes/${id}`).then((r) => {
      if (r.ok) {
        r.json().then((hero) =>
          setHero({ data: hero, error: null, status: "resolved" })
        );
      } else {
        r.json().then((err) =>
          setHero({ data: null, error: err.error, status: "rejected" })
        );
      }
    });
  }, [id]);

  if (status === "pending") return <h1>Loading...</h1>;
  if (status === "rejected") return <h1>Error: {error}</h1>;

  return (
    <section>
      <h2>{hero.super_name}</h2>
      <h2>AKA {hero.name}</h2>
      <h3>Powers:</h3>
      <ul>
        {hero.hero_powers.map((hero_power) => (
          <li key={hero_power.id}>
            <Link to={`/powers/${hero_power.power.id}`}>
              {hero_power.power.name}
            </Link>
            {" - Strength: "}{hero_power.strength}
          </li>
        ))}
      </ul>
      <Link to="/hero_powers/new">Add Hero Power</Link>
    </section>
  );
}