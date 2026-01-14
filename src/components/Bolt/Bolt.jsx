import './Bolt.css'

export default function Bolt({ color, isHeld = false, onClick }) {
    return (
        <div 
            className={`bolt${isHeld ? ' held' : ''}`}
            style={{backgroundColor: color}}
            onClick={onClick}
        />
    )
}
