export default function getUserIdFromURL() {
    const userIdMatch = window.location.href.match(/\/(\w{28})[/|?]/)
    return userIdMatch ? userIdMatch[1] : null
}


