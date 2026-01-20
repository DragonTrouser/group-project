/**
 * Stub function to compute the next iteration toward solving the board.
 * For now, it just returns the board unchanged.
 * Later, you can implement the actual solving algorithm.
 * 
 * @param {number[][]} rods - current board state
 * @returns {number[][]} new board state after one step
 */
export function nextStep(rods) {
    const n = rods.length
    const board = rods.map(r => [...r])

    const top = (i) => {
        return board[i][board[i].length - 1];
    }

    const isEmpty = (i) => {
        return board[i].length === 0;
    }

    const isPure = (i) => {
        if (board[i].length === 0) return true
        return board[i].every(v => v === board[i][0])
    }

    for (let from = 0; from < n; from++) {
        if (isEmpty(from)) continue
        const color = top(from)

        let bestTo = -1
        let bestSize = -1

        for (let to = 0; to < n; to++) {
            if (from === to) continue
            if (
                !isEmpty(to) &&
                isPure(to) &&
                top(to) === color &&
                board[to].length > bestSize
            ) {
                bestSize = board[to].length
                bestTo = to
            }
        }

        if (bestTo !== -1) {
            if (
                isPure(from) &&
                top(from) === color &&
                board[from].length >= board[bestTo].length
            ) {
                continue
            }

            board[bestTo].push(board[from].pop())
            return board
        }
    }

    for (let from = 0; from < n; from++) {
        if (isEmpty(from) || isPure(from)) continue
        const color = top(from)

        for (let to = 0; to < n; to++) {
            if (from === to) continue;
            if (!isEmpty(to) && top(to) === color) {
                board[to].push(board[from].pop())
                return board
            }
        }
    }
    
    for (let from = 0; from < n; from++) {
        if (isEmpty(from) || isPure(from)) continue

        for (let to = 0; to < n; to++) {
            if (from !== to && isEmpty(to)) {
                board[to].push(board[from].pop())
                return board
            }
        }
    }

    return board
}
