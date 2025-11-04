import React, { useState } from "react"

const Counter: React.FC = () => {
  const [count, setCount] = useState(0)

  const handleDecrement = () => {
    if (count > 0) setCount(count - 1)
  }

  return (
    <div className="card flex flex-col items-center gap-4">
      <p className="text-xl">Count is</p>
      <h1 className="text-4xl font-bold">{count}</h1>

      <div className="flex gap-2">
        <button
          onClick={handleDecrement}
          disabled={count === 0}
          className={`px-6 py-4 rounded-xl ${
            count === 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-red-500 text-white"
          }`}
        >
          -
        </button>

        <button
          onClick={() => setCount(count + 1)}
          className="px-6 py-4 bg-green-500 text-white rounded-xl"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default Counter
