export default function Home(props: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-black to-gray-900 p-8 text-amber-50">
      {props.children}
    </main>
  );
}
