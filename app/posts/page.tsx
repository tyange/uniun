import Link from "next/link";
import Header from "@/components/header";
import { formatPublishedAt, getPosts } from "@/lib/cms";

export const revalidate = 60;

export default async function PostsPage() {
  let posts = [] as Awaited<ReturnType<typeof getPosts>>;
  let errorMessage: string | null = null;

  try {
    posts = await getPosts();
  } catch (error) {
    errorMessage = error instanceof Error ? error.message : "포스트를 불러오지 못했습니다.";
  }

  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col w-full max-w-3xl m-auto">
        <Header />
        <main className="flex-1 p-3 flex flex-col gap-3">
          <h1 className="text-lg font-semibold">쓴 글</h1>

          {errorMessage ? (
            <p className="text-sm text-red-500">{errorMessage}</p>
          ) : posts.length === 0 ? (
            <p className="text-sm text-muted-foreground">아직 공개된 글이 없어요.</p>
          ) : (
            <ul className="flex flex-col gap-2">
              {posts.map((post) => (
                <li key={post.post_id} className="border border-dashed rounded-md p-3">
                  <Link href={`/posts/${post.post_id}`} className="block space-y-2">
                    <p className="text-base font-medium">{post.title}</p>
                    <p className="text-sm text-muted-foreground">{post.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{formatPublishedAt(post.published_at)}</span>
                      <span>{post.tags.map((tag) => `#${tag.tag}`).join(" ")}</span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </main>
      </div>
    </div>
  );
}
