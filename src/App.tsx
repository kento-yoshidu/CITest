import "./App.css";
import { useQuery } from "@tanstack/react-query";
import { fetchClient } from "./lib/fetchClient";

type Unit = {
  id: string;
  title: string;
  description: string;
};

function App() {
  const { data, isPending } = useQuery<Unit[]>({
    queryKey: ["units"],
    queryFn: () => fetchClient("/api/units"),
  });

  if (isPending) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <section id="center">
        {data && data.map((d) => (
          <>
            <p>{d.id}</p>
            <p>{d.title}</p>
            <p>{d.description}</p>
          </>
        ))}
      </section>
    </>
  );
}

export default App;
