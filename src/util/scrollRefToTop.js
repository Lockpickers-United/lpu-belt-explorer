export default function scrollRefToTop(ref) {
    if (!ref?.current) return
    const offset = ref.current?.offsetTop - (ref.current?.offsetParent?.offsetTop ?? 0)
    ref.current && setTimeout(() => {
        window.scrollTo({
            left: 0,
            top: offset - 74,
            behavior: 'smooth'
        })
    }, 100)
}
