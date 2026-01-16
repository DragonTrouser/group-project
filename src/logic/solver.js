/**
 * Stub function to compute the next iteration toward solving the board.
 * For now, it just returns the board unchanged.
 * Later, you can implement the actual solving algorithm.
 * 
 * @param {number[][]} rods - current board state
 * @returns {number[][]} new board state after one step
 */
export function nextStep(rods) {
    // TODO: implement actual solver
    // For now, just return rods unchanged
    return rods.map(r => [...r])
}
