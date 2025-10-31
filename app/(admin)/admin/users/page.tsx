import { prisma } from "@/lib/prisma";
import UsersListClient from "./UsersListClient";

export default async function UsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          submissions: true,
          problemStats: true,
        },
      },
    },
  });

  return <UsersListClient users={users} />;
}
