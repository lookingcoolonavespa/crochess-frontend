interface TwoColumnViewProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function TwoColumnView({
  title,
  className,
  children,
}: TwoColumnViewProps) {
  return (
    <section className={'two-column-view ' + className || ''}>
      <h3 className="section-title">{title}</h3>
      <div className="section-content">{children}</div>
    </section>
  );
}
