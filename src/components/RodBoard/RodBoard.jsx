import './RodBoard.css'


export default function RodBoard({ rods, onRodClick }) {
    return (
        <div className="rod-board">
            {rods.map((rod, rodIndex) => (
                <div
                key={rodIndex}
                className={`rod ${rod.length === 0 ? 'empty' : ''}`}
                onClick={() => onRodClick(rodIndex)}
                >
                    {rod.map((color, boltIndex) => (
                        <div
                        key={boltIndex}
                        className='bolt'
                        style={{backgroundColor: color}}
                        />
                    ))}
                </div>
            ))}
        </div>
    )
}
