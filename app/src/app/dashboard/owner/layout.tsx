import SideBar from "./Sidebar";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen">
      <SideBar />
      <div className="flex-1">{children}</div>
    </main>
  );
}
