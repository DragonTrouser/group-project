/**
 * Generates a random bolt-sorting board.
 *
 * @param {number} rodCount - Number of rods (max 15)
 * @returns {number[][]} rods (numeric representation)
 */
export function generateRandomBoard(rodCount) {
    if (rodCount < 5 || rodCount > 15) {
        throw new Error('rodCount must be between 5 and 15')
    }

    const colorCount = rodCount - 2

    const boltsPerColor = randomInt(6, 10)

    const bolts = []
    for (let color = 1; color <= colorCount; color++) {
        for (let i = 0; i < boltsPerColor; i++) {
            bolts.push(color)
        }
    }

    shuffleInPlace(bolts)

    const rods = Array.from({ length: rodCount }, () => [])

    bolts.forEach((bolt) => {
        const rodIndex = randomInt(0, rodCount - 1)
        rods[rodIndex].push(bolt)
    })

    return rods
}

export function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffleInPlace(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[array[i], array[j]] = [array[j], array[i]]
    }
}
