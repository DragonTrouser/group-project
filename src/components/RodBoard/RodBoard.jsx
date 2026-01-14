import './RodBoard.css'
import Bolt from '../Bolt/Bolt'

export default function RodBoard({ rods, mode, onRodClick }) {
  return (
    <div className="container">
      {rods.map((rod, rodIndex) => (
        <div
          key={rodIndex}
          className="rod"
          onClick={() => onRodClick?.(rodIndex)}
        >
          <div className="rod-base"></div>

          {rod.map((color, index) => (
            <Bolt
              key={index}
              color={color}
            />
          ))}
        </div>
      ))}
    </div>
  )
}
