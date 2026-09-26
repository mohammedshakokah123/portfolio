/** الـ replace(/</g, …) بيمنع أي `</script>` بالنص إنه يسكّر الـ script ويكسر الصفحة */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}
