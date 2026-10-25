import {useDocumentTitle} from 'usehooks-ts'

export default function usePageTitle(value) {
    return useDocumentTitle(getPageTitle(value))
}

export function getPageTitle(value) {
    const environment = /^localhost.*/.test(window.location.host)
        ? 'LOCAL'
        : /^dev.*/.test(window.location.host)
            ? 'DEV'
            : 'LPU Belt Explorer'
    return value ? `${environment} - ${value}` : 'LPU Belt Explorer'
}
