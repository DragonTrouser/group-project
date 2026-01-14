import './PlayButton.css'

export default function PlayButton({ onPlay }) {
    return (
        <button className="play-button" onClick={onPlay}>Play</button>
    )
}
