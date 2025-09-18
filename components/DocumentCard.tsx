// src/components/DocumentCard.tsx

type Props = {
  title: string;
  status: 'filed' | 'review' | 'draft';
  lastEdited: string;
};

export default function DocumentCard({ title, status, lastEdited }: Props) {
  const statusColor = {
    filed: 'text-olive-emerald',
    review: 'text-terracotta',
    draft: 'text-garnet',
  };

  return (
    <div className="card">
      <h3 className="text-xl font-semibold text-charcoal-navy">{title}</h3>
      <p className={`text-sm ${statusColor[status]}`}>{status.toUpperCase()}</p>
      <p className="text-slate-gray text-xs">Last Edited: {lastEdited}</p>
      <div className="mt-2 flex gap-2">
        <button className="button-secondary">Preview</button>
        <button className="button-primary">Export</button>
      </div>
    </div>
  );
}