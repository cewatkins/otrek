import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bridge } from "@/components/mtrek/Bridge";
import { Shipyard } from "@/components/mtrek/Shipyard";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const [flight, setFlight] = useState<{
    name: string;
    classId: string;
    id: number;
    room: string | null;
  } | null>(null);

  if (!flight) {
    return (
      <Shipyard
        onStart={(name, classId, room) => setFlight({ name, classId, id: Date.now(), room })}
      />
    );
  }

  return (
    <Bridge
      key={flight.id}
      name={flight.name}
      classId={flight.classId}
      room={flight.room}
      onLeave={() => setFlight(null)}
    />
  );
}
