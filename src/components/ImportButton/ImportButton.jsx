import './ImportButton.css'

export default function ImportButton({ onImport }) {
    const handleFileChange = (event) => {
        const file = event.target.files[0]
        if (!file) return;

        const reader = new FileReader()
        reader.onload = (event) => {
            const text = event.target.result
            const rods = parseFile(text)

            const allColors = rods.flat()
            const numColors = allColors.length > 0 ? Math.max(...allColors) : 0
            const targetRodsCount = numColors + 1

            while (rods.length < targetRodsCount) {
                rods.push([])
            }

            onImport(rods)
        }
        reader.readAsText(file)
    }

    const parseFile = (text) => {
        const lines = text
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line.length > 0)

        const rods = []
        const numCols = lines[0].split(/\s+/).length
        
        for (let i = 0; i < numCols; i++) rods.push([])
        
        lines.forEach((line) => {
            const values = line.split(/\s+/)
            values.forEach((v, i) => {
                const colorIndex = parseInt(v, 10)
                if (colorIndex !== 0) rods[i].push(colorIndex)
            })
        })
        
        return rods
    }

    return (
        <label className='import-button'>
            Import
            <input type='file' accept='.txt' onChange={handleFileChange} style={{display: 'none'}} />
        </label>
    )
}
