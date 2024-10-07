import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const [heros, setHeros] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch("/api/heroes")
      .then(async (r) => {
        if (!r.ok) {
          const errorText = await r.text();
          throw new Error(`HTTP error! status: ${r.status}, body: ${errorText}`);
        }
        return r.json();
      })
      .then(setHeros)
      .catch((e) => {
        console.error("There was a problem fetching the heroes:", e);
        setError(`Unable to load heroes. Error: ${e.message}`);
      });
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <section>
      <h2>All Heroes</h2>
      {heros.length === 0 ? (
        <p>Loading heroes...</p>
      ) : (
        <ul>
          {heros.map((hero) => (
            <li key={hero.id}>
              <Link to={`/heroes/${hero.id}`}>{hero.super_name}</Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export default Home;