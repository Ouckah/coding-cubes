import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/session";
import { EmptyPlaceholder } from "@/components/empty-placeholder";
import { DashboardHeader } from "@/components/header";
import { PostCreateButton } from "@/components/post-create-button";
import { PostItem } from "@/components/post-item";
import { DashboardShell } from "@/components/shell";

export const metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect(authOptions?.pages?.signIn || "/login");
  }

  const posts = await db.post.findMany({
    where: {
      authorId: user.id,
    },
    select: {
      id: true,
      title: true,
      published: true,
      createdAt: true,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return (
    <DashboardShell>
      <DashboardHeader
        heading="Projects Editor"
        text="Create and manage projects."
      >
        <PostCreateButton />
      </DashboardHeader>
      <div>
        {posts?.length ? (
          <div className="divide-y divide-border rounded-md border-white ">
            {posts.map((post) => (
              <PostItem key={post.id} post={post} />
            ))}
          </div>
        ) : (
          <EmptyPlaceholder className="bg-[#212121]">
            <EmptyPlaceholder.Icon name="post" />
            <EmptyPlaceholder.Title>No projects created</EmptyPlaceholder.Title>
            <EmptyPlaceholder.Description className="text-white">
              You don&apos;t have any projects yet.
            </EmptyPlaceholder.Description>
            <PostCreateButton variant="outline" />
          </EmptyPlaceholder>
        )}
      </div>
    </DashboardShell>
  );
}
