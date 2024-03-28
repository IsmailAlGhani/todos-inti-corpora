import BackGround from "./components/Background";
import MainContainer from "./components/MainContainer";
import Navbar from "./components/Navbar";
import { Toaster } from "./components/ui/toaster";

function App() {
  return (
    <div className="h-screen overflow-hidden">
      <BackGround />
      <Toaster />
      <main className="z-1 flex h-full flex-grow flex-col justify-between bg-gray-500 bg-opacity-60 backdrop-filter dark:bg-gray-900 dark:bg-opacity-60">
        <section className="h-[10vh] border-b">
          <Navbar />
        </section>
        <section className="flex flex-grow flex-col items-center px-[2vh] sm:px-[9vh]">
          <MainContainer />
        </section>
      </main>
    </div>
  );
}

export default App;
