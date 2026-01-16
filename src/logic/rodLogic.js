export function pickBolt(rods, rodIndex) {
    if (!rods[rodIndex].length) return null

    const nextRods = rods.map(r => [...r])
    const bolt = nextRods[rodIndex].pop()

    return { nextRods, bolt }
}

export function placeBolt(rods, rodIndex, bolt) {
    const nextRods = rods.map(r => [...r])
    nextRods[rodIndex].push(bolt)
    return nextRods
}