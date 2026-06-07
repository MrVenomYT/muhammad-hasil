export default function ParallaxLayer({ children, className = "" }) {
  return (
    <div className={className}>
      {children}
    </div>
  );
}
