export function DotSpan({ color }: { color: string }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: 10,
        height: 10,
        borderRadius: "50%",
        backgroundColor: color,
        marginRight: 8,
        verticalAlign: "middle",
      }}
    />
  )
}
