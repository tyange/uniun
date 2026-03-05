import Link from "next/link";
import Header from "@/components/header";

export default function Home() {
  return (
    <div className="w-full min-h-screen">
      <div className="flex flex-col w-full max-w-3xl m-auto">
        <Header />
        <main className="flex-1 p-3 flex flex-col gap-3">
          <h1 className="text-lg font-semibold">uniun</h1>
          <p className="text-sm text-muted-foreground">소중한 기록을 모아두는 블로그</p>
          <Link href="/posts" className="text-sm underline underline-offset-4 w-max">
            포스트 목록 보기
          </Link>
        </main>
      </div>
    </div>
  );
}
