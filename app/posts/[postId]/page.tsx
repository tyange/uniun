import Header from "@/components/header";
import { formatPublishedAt, getPostById } from "@/lib/cms";
import { notFound } from "next/navigation";

type PostDetailPageProps = {
  params: Promise<{ postId: string }>;
};

export const revalidate = 60;

export default async function PostDetailPage({ params }: PostDetailPageProps) {
  const { postId } = await params;
  const post = await getPostById(postId);

  if (!post) {
    notFound();
  }

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col w-full max-w-3xl m-auto">
        <Header />
        <main className="flex-1 p-3 flex flex-col gap-4">
          <header className="space-y-1">
            <h1 className="text-xl font-semibold">{post.title}</h1>
            <p className="text-sm text-muted-foreground">{formatPublishedAt(post.published_at)}</p>
          </header>

          <p className="text-sm text-muted-foreground">{post.description}</p>

          <article className="whitespace-pre-wrap text-sm leading-7">{post.content}</article>
        </main>
      </div>
    </div>
  );
}
