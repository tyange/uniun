import Header from "@/components/header";

export default function Home() {
  return (
    <div className="w-screen h-screen">
      <div className="flex flex-col w-full max-w-3xl m-auto">
        <Header />
        <main className="flex-1">
          <p className="text-red-300">HIROO</p>
        </main>
      </div>
    </div>
  );
}
