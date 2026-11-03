import React, {useCallback, useContext, useEffect, useMemo, useState} from 'react'
import {collection, doc, onSnapshot, query, runTransaction, deleteField, where} from 'firebase/firestore'
import {db} from '../../auth/firebase.js'
import DBContext from '../../app/DBContext.jsx'
import {enqueueSnackbar} from 'notistack'
import dayjs from 'dayjs'
import Button from '@mui/material/Button'

export function BeltAdminDBProvider({children}) {
    const globalContext = useContext(DBContext)
    const {profile} = useContext(DBContext)

    const [beltRequests, setBeltRequests] = useState([])
    const [requestsLoaded, setRequestsLoaded] = useState(false)
    const [dbError, setDbError] = useState(null)

    const [viewing, setViewing] = useState('open') // ['open' , 'all']
    const toggleViewAll = useCallback(() => {
        setRequestsLoaded(false)
        setViewing(prev => prev === 'all' ? 'open' : 'all')
    }, [])

    useEffect(() => {
        const openStatuses = ['open', 'checked-out', 'processing-approve', 'processing-deny']

        const colRef = collection(db, 'belt-requests')
        const q = viewing === 'all'
            ? colRef
            : query(colRef, where('status', 'in', openStatuses))
        const unsubscribe = onSnapshot(q, querySnapshot => {
            const items = []
            querySnapshot.forEach((doc) => {
                items.push({id: doc.id, ...doc.data()})
            })
            setBeltRequests(items)
            setRequestsLoaded(true)
        }, error => {
            console.error('Error listening to DB:', error)
            setDbError(true)
            enqueueSnackbar('There was a problem loading belt requests. Please refresh the page to try again. ', {
                autoHideDuration: null,
                action: <Button color='secondary' onClick={() => location.reload()}>Refresh</Button>
            })
        })
        return () => unsubscribe()
    }, [viewing])

    const updateBeltRequest = useCallback(async (update) => {
        if (globalContext.dbError || dbError) {
            throw new Error('Database error')
        }
        const ref = doc(db, 'belt-requests', update.id)
        await runTransaction(db, async transaction => {
            const sfDoc = await transaction.get(ref)
            const revision = (sfDoc.data()?.revision ?? 0) + 1
            if (!sfDoc.exists()) {
                transaction.set(ref, {...update, revision})
            } else {
                transaction.update(ref, {...update, revision})
            }
        })
    }, [dbError, globalContext.dbError])

    const replaceBeltRequest = useCallback(async (id, replacement) => {
        if (globalContext.dbError || dbError) {
            throw new Error('Database error')
        }
        const ref = doc(db, 'belt-requests', id)
        await runTransaction(db, async transaction => {
            transaction.set(ref, replacement)
        })
    }, [dbError, globalContext.dbError])

    const buildUpdate = useCallback((request, status, fields = {}) => {
        return {
            id: request.id,
            status,
            lastUpdated: dayjs().format(),
            lastUpdateBy: profile.displayName,
            lastUpdatePlatform: 'Site',
            ...fields
        }
    }, [profile.displayName])

    const approveRequest = useCallback(async (request, force = false) => {
        if (!['open', 'checked-out'].includes(request.status)) {
            enqueueSnackbar(`Request ${request.id} isn't open for review.`, {variant: 'warning'})
            return
        } else if (request.status === 'checked-out' && request.reviewerName !== profile.displayName && !force) {
            enqueueSnackbar(`Request ${request.id} is being reviewed by ${request.reviewerName}.`, {variant: 'warning'})
            return
        }
        const update = buildUpdate(request, 'processing-approve', {notes: request.reply, checkoutBy: deleteField()})
        try {
            await updateBeltRequest(update)
            enqueueSnackbar(`${request.id} has been approved!`, {variant: 'success'})
        } catch (error) {
            enqueueSnackbar(`Error while updating request ${request.id}: ${error.message}`, {variant: 'error'})
        }
    }, [buildUpdate, profile.displayName, updateBeltRequest])

    const denyRequest = useCallback(async (request, force = false) => {
        console.log('request', request)
        if (!['open', 'checked-out'].includes(request.status)) {
            enqueueSnackbar(`Request ${request.id} isn't open for review.`, {variant: 'warning'})
            return
        } else if (request.status === 'checked-out' && request.reviewerName !== profile.displayName && !force) {
            enqueueSnackbar(`Request ${request.id} is being reviewed by ${request.reviewerName}.`, {variant: 'warning'})
            return
        }
        const update = buildUpdate(request, 'processing-deny', {notes: request.reply, 'checkoutBy': deleteField()})
        try {
            await updateBeltRequest(update)
            enqueueSnackbar(`${request.id} has been denied.`, {variant: 'success'})
        } catch (error) {
            enqueueSnackbar(`Error while updating request ${request.id}: ${error.message}`, {variant: 'error'})
        }
    }, [buildUpdate, profile.displayName, updateBeltRequest])

    const deleteRequest = useCallback(async (request, force = false) => {
        if (request.status === 'deleted') {
            enqueueSnackbar(`Request ${request.id} is already deleted.`, {variant: 'warning'})
            return
        } else if (request.status === 'checked-out' && request.reviewerName !== profile.displayName && !force) {
            enqueueSnackbar(`Request ${request.id} is being reviewed by ${request.reviewerName}.`, {variant: 'warning'})
            return
        }
        const update = buildUpdate(request, 'deleted', {checkoutBy: deleteField()})
        try {
            await updateBeltRequest(update)
            enqueueSnackbar(`${request.id} has been deleted`, {variant: 'success'})
        } catch (error) {
            enqueueSnackbar(`Error while updating request ${request.id}: ${error.message}`, {variant: 'error'})
        }
    }, [buildUpdate, profile.displayName, updateBeltRequest])

    const reopenRequest = useCallback(async (request, _force) => {
        if (['open', 'checked-out'].includes(request.status)) {
            enqueueSnackbar(`Request ${request.id} is already open.`, {variant: 'warning'})
            return
        }
        const update = buildUpdate(request, 'open', {checkoutBy: deleteField()})
        try {
            await updateBeltRequest(update)
            enqueueSnackbar(`${request.id} has been re-opened`, {variant: 'success'})
        } catch (error) {
            enqueueSnackbar(`Error while updating request ${request.id}: ${error.message}`, {variant: 'error'})
        }
    }, [buildUpdate, updateBeltRequest])

    const checkoutRequest = useCallback(async (request, force) => {
        if (request.status === 'checked-out' && request.checkoutBy !== profile.displayName && !force) {
            enqueueSnackbar(`Request ${request.id} is being reviewed by ${request.checkoutBy}.`, {variant: 'warning'})
            return
        } else if (request.status !== 'open') {
            enqueueSnackbar(`Request ${request.id} isn't open for review.`, {variant: 'warning'})
            return
        }
        const update = buildUpdate(request, 'checked-out', {'checkoutBy': profile.displayName})
        try {
            await updateBeltRequest(update)
            enqueueSnackbar(`${request.id} has been checked out`, {variant: 'success'})
        } catch (error) {
            enqueueSnackbar(`Error while updating request ${request.id}: ${error.message}`, {variant: 'error'})
        }
    }, [buildUpdate, profile.displayName, updateBeltRequest])

    const checkinRequest = useCallback(async (request, force) => {
        if (request.status !== 'checked-out') {
            enqueueSnackbar(`Request ${request.id} isn't checked out.`, {variant: 'warning'})
            return
        } else if (request.status === 'checked-out' && request.checkoutBy !== profile.displayName && !force) {
            enqueueSnackbar(`Request ${request.id} is being reviewed by ${request.checkoutBy}.`, {variant: 'warning'})
            return
        }
        const update = buildUpdate(request, 'open', {'checkoutBy': deleteField()})
        try {
            await updateBeltRequest(update)
            enqueueSnackbar(`${request.id} has been checked in.`, {variant: 'success'})
        } catch (error) {
            enqueueSnackbar(`Error while updating request ${request.id}: ${error.message}`, {variant: 'error'})
        }
    }, [buildUpdate, profile.displayName, updateBeltRequest])

    const handleUpdate = useCallback(async (request, action, force = false) => {
        if (action === 'approve') {
            await approveRequest(request, force)
        } else if (action === 'deny') {
            await denyRequest(request, force)
        } else if (action === 'delete') {
            await deleteRequest(request, force)
        } else if (action === 'reopen') {
            await reopenRequest(request, force)
        } else if (action === 'checkout') {
            await checkoutRequest(request, force)
        } else if (action === 'checkin') {
            await checkinRequest(request, force)
        }
    }, [approveRequest, checkinRequest, checkoutRequest, deleteRequest, denyRequest, reopenRequest])

    const value = useMemo(() => ({
        ...globalContext,
        requestsLoaded,
        beltRequests,
        viewing,
        toggleViewAll,
        replaceBeltRequest,
        updateBeltRequest,
        handleUpdate,
        approveRequest,
        denyRequest,
        deleteRequest,
        reopenRequest,
        checkoutRequest,
        checkinRequest
    }), [globalContext, requestsLoaded, beltRequests, viewing, toggleViewAll, replaceBeltRequest, updateBeltRequest, handleUpdate, approveRequest, denyRequest, deleteRequest, reopenRequest, checkoutRequest, checkinRequest])

    return (
        <DBContext.Provider value={value}>
            {children}
        </DBContext.Provider>
    )
}

export default DBContext
