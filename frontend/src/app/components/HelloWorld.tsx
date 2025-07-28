"use client";

export function HelloWorld() {
  return (
    <div className="text-center">
      <h1 className="mb-4 font-mono text-4xl font-bold tracking-tight text-foreground/80 sm:text-6xl md:text-7xl">
        Hello,
        <br />{" "}
        <span className="bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
          World!
        </span>
      </h1>
    </div>
  );
}