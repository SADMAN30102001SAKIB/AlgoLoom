import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                Admin Panel
              </h1>
              <div className="flex space-x-4">
                <a
                  href="/admin"
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </a>
                <a
                  href="/admin/problems"
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Problems
                </a>
                <a
                  href="/admin/users"
                  className="text-slate-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium">
                  Users
                </a>
              </div>
            </div>
            <a href="/" className="text-slate-400 hover:text-white text-sm">
              ← Back to Site
            </a>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
