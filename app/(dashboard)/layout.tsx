import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Problems - AlgoLoom",
  description: "Practice coding problems and improve your skills",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
