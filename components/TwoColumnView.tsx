interface TwoColumnViewProps {
  title: string;
  children: React.ReactNode;
}

export default function TwoColumnView({ title, children }: TwoColumnViewProps) {
  return (
    <section className="two-column-view">
      <h3 className="section-title">{title}</h3>
      <div>{children}</div>
    </section>
  );
}
