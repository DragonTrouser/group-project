import './RandomButton.css'

export default function RandomButton({
    onCreate,
    numRods = 6,
    numBoltsPerRod = 6
}) {
    const handleClick = () => {
        const numColors = numRods - 1
        const newRods = Array.from({ length: numRods }, () => [])

        const emptyRodIndex = numRods - 1
        const totalBolts = (numRods - 1) * numBoltsPerRod
        const boltsPerColor = Math.floor(totalBolts / numColors)

        const allBolts = []
        for (let colorIndex = 1; colorIndex <= numColors; colorIndex++) {
            for (let i = 0; i < boltsPerColor; i++) {
                allBolts.push(colorIndex)
            }
        }

        for (let i = allBolts.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1))
            ;[allBolts[i], allBolts[j]] = [allBolts[j], allBolts[i]]
        }

        let rodIndex = 0
        allBolts.forEach((bolt) => {
            rodIndex++
            if (rodIndex === emptyRodIndex) rodIndex++
            if (rodIndex >= numRods) rodIndex = 0
            if (rodIndex === emptyRodIndex) rodIndex++
            newRods[rodIndex].push(bolt)
        })

        onCreate?.(newRods)
    }

    return (
        <button className='random-button' onClick={handleClick}>Create Random</button>
    )
}
