import  { useEffect, useState } from "react";
import "./css/HeroPowerForm.css";

export default function HeroPowerForm() {
  const [heroes, setHeroes] = useState([]);
  const [powers, setPowers] = useState([]);
  const [heroId, setHeroId] = useState("");
  const [powerId, setPowerId] = useState("");
  const [strength, setStrength] = useState("");
  const [formErrors, setFormErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetch("/api/heroes")
      .then((r) => r.json())
      .then(setHeroes);

    fetch("/api/powers")
      .then((r) => r.json())
      .then(setPowers);
  }, []);
  
  function handleSubmit(e) {
    e.preventDefault();
    setFormErrors([]);
    setSuccessMessage("");

    const formData = {
      hero_id: heroId,
      power_id: powerId,
      strength,
    };

    fetch("/api/hero_powers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    }).then((r) => {
      if (r.ok) {
        setSuccessMessage("Hero Power added successfully!");
        // Reset form fields
        setHeroId("");
        setPowerId("");
        setStrength("");
      } else {
        r.json().then((err) => setFormErrors(err.errors));
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="power_id">Power:</label>
        <select
          id="power_id"
          name="power_id"
          value={powerId}
          onChange={(e) => setPowerId(e.target.value)}
        >
          <option value="">Select a power</option>
          {powers.map((power) => (
            <option key={power.id} value={power.id}>
              {power.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="hero_id">Hero:</label>
        <select
          id="hero_id"
          name="hero_id"
          value={heroId}
          onChange={(e) => setHeroId(e.target.value)}
        >
          <option value="">Select a hero</option>
          {heroes.map((hero) => (
            <option key={hero.id} value={hero.id}>
              {hero.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="strength">Strength:</label>
        <input
          type="text"
          id="strength"
          name="strength"
          value={strength}
          onChange={(e) => setStrength(e.target.value)}
        />
      </div>

      {formErrors.length > 0 && (
        <div className="error-messages">
          {formErrors.map((err, index) => (
            <p key={index} className="error-message">
              {err}
            </p>
          ))}
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

      <button type="submit">Add Hero Power</button>
    </form>
  );
}