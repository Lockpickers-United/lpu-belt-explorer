//    if (import.meta.env.DEV) return null

const doLogging = true
function mglog(item) {
    doLogging && console.log(item)
}
export default mglog
