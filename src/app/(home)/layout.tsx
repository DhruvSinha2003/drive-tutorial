export default function Home(props: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-zinc-950 via-gray-900 to-slate-900 p-8 text-slate-50">
      {props.children}
    </main>
  );
}
