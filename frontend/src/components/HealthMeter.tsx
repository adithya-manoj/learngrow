import "./HealthMeter.css"

export default function HealthMeter({ value }: { value: number }) {
  const rotation = (value / 100) * 180 - 90 // 0–100 maps to -90° to +90°

  return (
    <div className="health-meter">
      <div className="dial">
        <div className="needle" style={{ transform: `rotate(${rotation}deg)` }} />
      </div>
      <p className="value">{value}%</p>
    </div>
  )
}
