export default function ThreePanelLayout({
  left,
  main,
  right,
}: {
  left: React.ReactNode;
  main: React.ReactNode;
  right: React.ReactNode;
}) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "320px 1fr 360px", height: "100vh" }}>
      <div style={{ borderRight: "1px solid #ddd" }}>{left}</div>
      <div style={{ borderRight: "1px solid #ddd" }}>{main}</div>
      <div>{right}</div>
    </div>
  );
}