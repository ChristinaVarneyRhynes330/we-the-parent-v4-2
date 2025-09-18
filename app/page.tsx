import WeTheParentChat from '@/components/WeTheParentChat';

export default function HomePage() {
  return (
    <main className="flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        <WeTheParentChat />
      </div>
    </main>
  );
}