import {useCallback, useContext} from 'react'
import AccessContext from '../app/AccessContext.jsx'
import AppContext from '../app/AppContext.jsx'
import AuthContext from '../app/AuthContext.jsx'

export function isFilterFieldVisible(filterField, {
    beta = false,
    isLoggedIn = false,
    adminEnabled = false
} = {}) {
    return (!filterField?.beta || beta)
        && (!filterField?.userBased || isLoggedIn)
        && (!filterField?.adminEnabled || adminEnabled)
}

export default function useFilterFieldVisibility() {
    const {beta} = useContext(AppContext)
    const {isLoggedIn} = useContext(AuthContext)
    const access = useContext(AccessContext)
    const adminEnabled = access?.accessInfo?.enabledRoles?.admin || false

    return useCallback(filterField => isFilterFieldVisible(filterField, {
        beta,
        isLoggedIn,
        adminEnabled
    }), [adminEnabled, beta, isLoggedIn])
}
