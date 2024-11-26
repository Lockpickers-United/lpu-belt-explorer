import {useDocumentTitle} from 'usehooks-ts'

function usePageTitle(value) {


    const environment = /^localhost.*/.test(window.location.host)
        ? 'LOCAL'
        : /^dev.*/.test(window.location.host)
            ? 'DEV'
            : 'LPU Belt Explorer'

    const title = value ? `${environment} - ${value}` : 'LPU Belt Explorer'
    return useDocumentTitle(title)
}

export default usePageTitle
