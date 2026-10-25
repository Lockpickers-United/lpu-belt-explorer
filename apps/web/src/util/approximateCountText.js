export default function approximateCountText(number) {
    const increment = number < 700
        ? 50
        : number < 10000
            ? 100
            : 1000
    const approximate = Math.round(number / increment) * increment
    if (number === approximate || number <= increment) return number.toLocaleString()
    return approximate < number
        ? `more than ${approximate.toLocaleString()}`
        : `nearly ${approximate.toLocaleString()}`
}

export function secondApproximateCount(number, firstApproximateString) {
    const approximateString =  approximateCountText(number)
    if (firstApproximateString.includes('nearly') && approximateString.includes('nearly')) {
        return approximateString.replace('nearly', 'almost')
    } else if (firstApproximateString.includes('more than') && approximateString.includes('more than')) {
        return approximateString.replace('more than', 'over')
    }
    return approximateString
}