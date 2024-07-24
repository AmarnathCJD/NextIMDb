import Image from "next/image";
import ImdbComponent from "./components/ImdbComponent";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen py-2">
      <ImdbComponent />
    </main>
  );
}
