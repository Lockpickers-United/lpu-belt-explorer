import {useDocumentTitle} from 'usehooks-ts'

function usePageTitle(value) {
    const title = value ? `LPU Belt Explorer - ${value}` : 'LPU Belt Explorer'
    return useDocumentTitle(title)
}

export default usePageTitle
