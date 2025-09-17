import Chat from "./Chat";
import SideBar from "./SideBar";

export default function Home() {
  return (
    <div className="flex h-screen">
      <SideBar />
      <div className="flex-1 flex flex-col">
        <Chat />
      </div>
    </div>
  );
}
