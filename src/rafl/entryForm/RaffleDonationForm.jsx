import React, {useCallback, useEffect, useMemo, useState, memo} from 'react'
import FormControl from '@mui/material/FormControl'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import DeleteForeverIcon from '@mui/icons-material/DeleteForever'
import RaffleAutocompleteBox from './RaffleAutocompleteBox.jsx'
import validator from 'validator'
import allCharities from '../../data/raflCharities.json'
import useWindowSize from '../../util/useWindowSize.jsx'
import {Collapse} from '@mui/material'

function RaffleDonationForm({
                                index,
                                donationData,
                                handleDonationChange,
                                removeDonation,
                                showIssues,
                                questionStyle
                            }) {
    const [details, setDetails] = useState(donationData[index] || {amount: 0, receipt: ''})
    const {isMobile, flexStyle} = useWindowSize()

    // Sync local state when parent potData updates externally (e.g., test data fill)
    useEffect(() => {
        const incoming = (donationData || [])[index] || {}
        // shallow compare to avoid unnecessary state updates
        const same = (
            (incoming.charity?.itemFullTitle === details?.charity?.itemFullTitle) &&
            (incoming.charity?.itemTitle === details?.charity?.itemTitle) &&
            (incoming.charity?.itemId === details?.charity?.itemId) &&
            (incoming?.amount === details?.amount) &&
            (incoming?.receipt === details?.receipt)
        )
        if (!same) {
            setDetails(prev => ({...prev, ...incoming}))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, donationData])

    useEffect(() => {
        handleDonationChange(index, details)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [index, details])

    const [display, setDisplay] = useState(false)

    useEffect(() => {
        const timer = setTimeout(() => setDisplay(true), 100)
        return () => clearTimeout(timer)
    }, [])

    // charity selection (using existing autocomplete component)
    const mappedCharities = useMemo(() => {
        return allCharities
            .filter(ch => {
                return !ch.disabled
            })
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(c => ({...c, title: c.name}))
    }, [])
    const charityFullTitle = useCallback((charity) => charity.name, [])


    const onAmountChange = useCallback((e) => {
        const value = parseInt(e.target.value.replace(/[^0-9]/g, '').substring(0, 5)) || 0
        setDetails(prev => ({...prev, amount: value}))
    }, [])

    const onReceiptChange = useCallback((e) => {
        setDetails(prev => ({...prev, receipt: e.target.value}))
    }, [])

    const setCharity = useCallback((item) => {
        setDetails(prev => ({...prev, charity: item}))
    }, [])

    const receiptUrlError = (details?.receipt || showIssues) && !validator.isURL(details?.receipt || '', {
        require_tld: false,
        require_protocol: true
    })

    const showDelete = (donationData || []).length > 1

    const divider = (donationData || []).length > 1
        ? <div style={{height: 0, margin: '20px 0px', borderBottom: '2px solid #bbb', alignItems: 'center'}}/>
        : null

    return (
        <div>
            {divider}
            <Collapse in={display} timeout={500}>
                <div style={{display: flexStyle, margin: '0px 12px 0px 12px'}}>
                    <div>
                        <div style={{display: flexStyle, flexGrow: 1, marginRight: 40}}>
                            <div style={{flexGrow: 1, marginRight: 40}}>
                                <div style={{
                                    ...questionStyle,
                                    fontWeight: 600,
                                    fontSize: '1.1rem',
                                    marginTop: 4
                                }}>Selected Charity
                                </div>
                                <div style={{height: 6}}/>
                                <div>
                                    <RaffleAutocompleteBox allItems={mappedCharities}
                                                           value={details?.charity?.itemFullTitle || ''}
                                                           setItemDetails={setCharity}
                                                           getOptionTitle={charityFullTitle}
                                                           searchText={'Search Charity'}
                                                           error={showIssues && !details?.charity?.itemFullTitle}/>
                                </div>
                                <div style={{
                                    fontSize: '0.75rem',
                                    color: '#f44336',
                                    margin: '4px 14px 0px 14px',
                                    display: showIssues && !details?.charity?.itemFullTitle ? 'block' : 'none'
                                }}>Required Field
                                </div>
                            </div>
                            <div>
                                <div style={{...questionStyle, marginTop: 5}}>Total donation in USD</div>
                                <FormControl>
                                    <TextField type='text' name='donation' label='Donation Amount'
                                               value={details.amount || ''}
                                               error={showIssues && !details.amount}
                                               helperText={showIssues && !details.amount ? 'Required Field' : ' '}
                                               onChange={onAmountChange} color='info' size='small'/>
                                </FormControl>
                            </div>
                        </div>

                        <div>
                            <div style={questionStyle}>Receipt from approved charity <span
                                style={{fontWeight: 400, fontSize: '0.9rem'}}>(hosted image link, must contain a visible date)</span>
                            </div>
                            <FormControl fullWidth>
                                <TextField type='text' name='receipt' label='Receipt Link'
                                           error={receiptUrlError}
                                           helperText={receiptUrlError ? 'Receipt link is not a valid URL' : ' '}
                                           value={details.receipt || ''}
                                           onChange={onReceiptChange} color='info' size='small' fullWidth/>
                            </FormControl>
                        </div>
                    </div>
                    {showDelete && (
                        <div style={{marginLeft: 10}}>
                            {!isMobile &&
                                <div style={questionStyle}>&nbsp;</div>
                            }
                            <IconButton color='warning' onClick={() => removeDonation(index)}>
                                <DeleteForeverIcon/>
                            </IconButton>
                        </div>
                    )}
                </div>
            </Collapse>
        </div>
    )
}

const areEqual = (prevProps, nextProps) => {
    if (prevProps.index !== nextProps.index) return false
    if ((prevProps.donationData || []).length !== (nextProps.donationData || []).length) return false
    if ((prevProps.donationData || [])[prevProps.index] !== (nextProps.donationData || [])[nextProps.index]) return false
    if (prevProps.showIssues !== nextProps.showIssues) return false
    return prevProps.questionStyle === nextProps.questionStyle
}

export default memo(RaffleDonationForm, areEqual)
