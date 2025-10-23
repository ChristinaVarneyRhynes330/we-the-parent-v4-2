export default function ChatPage() {
  return (
    <main className="space-y-6">
      <h1 className="text-2xl font-serif text-navy">AI Assistant</h1>

      <div className="card p-4">
        <p className="text-navy/80">
          Ask plain-language questions. Answers can cite your documents and Florida law.
        </p>
        <form className="mt-4 flex gap-2">
          <input
            className="flex-1 rounded-md border border-navy/20 bg-cream px-3 py-2 focus:border-navy"
            placeholder="What should I do before my shelter review?"
          />
          <button className="btn-secondary">Ask</button>
        </form>
        <p className="mt-2 text-sm text-navy/60">History is saved privately in your case vault.</p>
      </div>
    </main>
  );
}
