export default function Tile({ id, value, x, y }) {
  if (!value) return null;

  const coordinates = { "--x": x, "--y": y };
  return (
    <div key={id} className="tile" style={coordinates}>
      {value}
    </div>
  );
}
