export type TagWithCategory = {
  tag: string;
  category: string;
};

export type PostItem = {
  post_id: string;
  title: string;
  description: string;
  published_at: string;
  tags: TagWithCategory[];
  status: string;
};

export type PostDetail = PostItem & {
  content: string;
};

export type PostsResponse = {
  posts: PostItem[];
};

export type CustomResponse<T> = {
  status: boolean;
  data: T | null;
  message: string | null;
};

const DEFAULT_API_BASE_URL = "https://tyange.com/api/cms";

function getApiBaseUrl(): string {
  return process.env.TYANGE_CMS_API_URL ?? DEFAULT_API_BASE_URL;
}

async function fetchCms(path: string): Promise<Response> {
  const baseUrl = getApiBaseUrl();

  try {
    return await fetch(`${baseUrl}${path}`, {
      method: "GET",
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "unknown network error";
    throw new Error(`CMS fetch failed (${baseUrl}${path}): ${message}`);
  }
}

export async function getPosts(): Promise<PostItem[]> {
  const response = await fetchCms("/posts");

  if (!response.ok) {
    throw new Error(`Failed to fetch posts: ${response.status}`);
  }

  const payload = (await response.json()) as CustomResponse<PostsResponse>;

  if (!payload.status) {
    throw new Error(payload.message ?? "CMS returned status=false");
  }

  return payload.data?.posts ?? [];
}

export async function getPostById(postId: string): Promise<PostDetail | null> {
  const response = await fetchCms(`/post/${postId}`);

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch post detail: ${response.status}`);
  }

  return (await response.json()) as PostDetail;
}

export function formatPublishedAt(value: string): string {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(parsed);
}
