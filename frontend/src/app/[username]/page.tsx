import { verifySession } from "@/lib/session/verifySession";
import { redirect, notFound } from "next/navigation";
import { Suspense } from "react";

// Skeletons
import { ProjectsSkeleton } from "./skeletons/ProjectsSkeleton";

// Projects
import ProjectsTableSlot from "./@projects/page";

export default async function DashboardPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const session = await verifySession();

  if (session.username !== username) notFound();
  if (!session.isAuth) redirect("/login");

  return (
    <div className="container mx-auto py-9 flex flex-col gap-4">
      <h1 className="text-4xl">{`Welcome, ${username}`}</h1>
      <Suspense fallback={<ProjectsSkeleton />}>
        <ProjectsTableSlot username={username} />
      </Suspense>
    </div>
  );
}
