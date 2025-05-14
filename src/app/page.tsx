export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-background to-foreground/5">
      <div className="text-center">
        <h1 className="mb-4 font-mono text-4xl font-bold tracking-tight text-foreground/80 sm:text-6xl md:text-7xl">
          Hello,{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
            World!
          </span>
        </h1>
      </div>
    </div>
  );
}
