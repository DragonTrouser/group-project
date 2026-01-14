import './SimulateButton.css'

export default function SimulateButton({ onSimulate }) {
    return (
        <button className='simulate-button' onClick={onSimulate}>Simulate</button>
    )
}
