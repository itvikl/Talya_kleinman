export default function ProjectsLoading() {
  return (
    <div className="pt-40 pb-32">
      <div className="container-editorial">
        <div className="mb-20">
          <div className="mb-5 h-3 w-32 animate-pulse rounded bg-cream-300" />
          <div className="h-14 w-56 animate-pulse rounded bg-cream-300" />
        </div>
        <div className="mb-16 flex gap-8 border-b border-ink/10 pb-6">
          {[80, 110, 100, 90].map((w, i) => (
            <div key={i} className={`h-3 animate-pulse rounded bg-cream-300`} style={{ width: w }} />
          ))}
        </div>
        <div className="grid gap-x-8 gap-y-20 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className={i % 3 === 1 ? 'md:mt-24' : ''}>
              <div className="aspect-[4/5] animate-pulse rounded-2xl bg-cream-300" />
              <div className="mt-6 space-y-3">
                <div className="h-2.5 w-28 animate-pulse rounded bg-cream-300" />
                <div className="h-8 w-52 animate-pulse rounded bg-cream-300" />
                <div className="h-2.5 w-20 animate-pulse rounded bg-cream-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
