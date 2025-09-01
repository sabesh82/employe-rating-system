import EmployeeSidebar from "./EmployeeSidebar";

export default function EmployeeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex min-h-screen">
      <EmployeeSidebar />
      <div className="flex-1">{children}</div>
    </main>
  );
}
