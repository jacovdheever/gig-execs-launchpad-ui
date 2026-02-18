/**
 * Reusable JSON-LD structured data component.
 * Renders one or multiple <script type="application/ld+json"> tags.
 * Safe for client-side injection in Vite/React.
 */

interface JsonLdProps {
  schema: object | object[]
}

export function JsonLd({ schema }: JsonLdProps) {
  const schemas = Array.isArray(schema) ? schema : [schema]

  return (
    <>
      {schemas.map((s, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(s),
          }}
        />
      ))}
    </>
  )
}
