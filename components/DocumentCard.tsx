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
    // FIX: All elements are now wrapped in a single parent <div>
    // We also apply the .card style from your globals.css
    <div className="card">
      <h3 className="text-xl font-header text-charcoal-navy">{title}</h3>
      <p className={`text-sm font-semibold ${statusColor[status]}`}>{status.toUpperCase()}</p>
      <p className="mt-1 text-xs text-slate-gray">Last Edited: {lastEdited}</p>
      <div className="flex gap-2 mt-4">
        <button className="button-secondary">Preview</button>
        <button className="button-primary">Export</button>
      </div>
    </div>
  );
}