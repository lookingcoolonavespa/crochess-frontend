import styles from '../styles/TwoColumnViewWithTitle.module.scss';

interface TwoColumnViewWithTitleProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export default function TwoColumnViewWithTitle({
  title,
  className,
  children,
}: TwoColumnViewWithTitleProps) {
  return (
    <section className={styles.main + ' two-column-view ' + (className || '')}>
      <h3 className={styles.title}>
        <span className={styles['text-wrapper']}>{title}</span>
      </h3>
      <div className={styles.content}>{children}</div>
    </section>
  );
}
