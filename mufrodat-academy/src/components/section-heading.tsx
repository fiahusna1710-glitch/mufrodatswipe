type Props = { eyebrow?: string; title: string; description?: string; action?: React.ReactNode };
export function SectionHeading({ eyebrow, title, description, action }: Props) {
  return (
    <div className="section-heading">
      <div>{eyebrow && <span className="eyebrow">{eyebrow}</span>}<h2>{title}</h2>{description && <p>{description}</p>}</div>
      {action}
    </div>
  );
}
