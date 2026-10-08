/** الـ badges تبع التقنيات. الـ label بينقرأ بقارئ الشاشة قبل القائمة ("Technologies used") */
export function Tags({ items, label }: { items: readonly string[]; label?: string }) {
  return (
    <ul className="tags" aria-label={label}>
      {items.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}
