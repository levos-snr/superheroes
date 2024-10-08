import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function PowerEditForm() {
  const [{ data: power, errors, status }, setPower] = useState({
    data: null,
    errors: [],
    status: "pending",
  });
  const [description, setDescription] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetch(`/api/powers/${id}`).then((r) => {
      if (r.ok) {
        r.json().then((power) => {
          setPower({ data: power, errors: [], status: "resolved" });
          setDescription(power.description);
        });
      } else {
        r.json().then((err) =>
          setPower({ data: null, errors: [err.error], status: "rejected" })
        );
      }
    });
  }, [id]);

  if (status === "pending") return <p>Loading...</p>;

  function handleSubmit(e) {
    e.preventDefault();
    fetch(`/api/powers/${power.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        description,
      }),
    }).then((r) => {
      if (r.ok) {
        navigate(`/powers/${power.id}`);
      } else {
        r.json().then((err) =>
          setPower({ data: power, errors: err.errors, status: "rejected" })
        );
      }
    });
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Editing {power.name}</h2>
      <label htmlFor="description">Description:</label>
      <textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      {errors.length > 0
        ? errors.map((err) => (
            <p key={err} style={{ color: "red" }}>
              {err}
            </p>
          ))
        : null}
      <button type="submit">Update Power</button>
    </form>
  );
}

export default PowerEditForm;
