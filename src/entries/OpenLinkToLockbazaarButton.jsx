import React, {useCallback, useContext, useState} from 'react'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import entryName from './entryName'
import LocalOfferIcon from '@mui/icons-material/LocalOffer'
import Dialog from '@mui/material/Dialog'
import Button from '@mui/material/Button'
import HighlightOffIcon from '@mui/icons-material/HighlightOff'
import DataContext from '../context/DataContext.jsx'
import Checkbox from '@mui/material/Checkbox'
import FormControlLabel from '@mui/material/FormControlLabel'
import {useLocalStorage} from 'usehooks-ts'
import Link from '@mui/material/Link'

function OpenLinkToLockbazaarButton({entry, buttonType = 'text', nameType}) {
    const {lockbazzarAvailable} = useContext(DataContext)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [showDialog, setShowDialog] = useLocalStorage('showLpulocksDialog', true)

    const hasListings = lockbazzarAvailable(entry.id)

    const toggleDialog = useCallback(() => {
        setDialogOpen(!dialogOpen)
    }, [dialogOpen])

    const toggleShowDialog = useCallback(() => {
        setShowDialog(!showDialog)
    }, [setShowDialog, showDialog])

    const openInNewTab = useCallback((entryId) => {
        const name = entryName(entry, nameType)
        const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')
        const link = 'https://lpulocks.com/#/lockbazaar'
        const queryString = entryId ? `?search=${entry.id}&name=${safeName}` : ''
        const newWindow = window.open(`${link}${queryString}`, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
        setDialogOpen(false)
    }, [entry, nameType])

    const handleClick = useCallback(() => {
        if (showDialog || !hasListings) {
            toggleDialog()
        } else {
            openInNewTab(entry.id)
        }
    }, [entry.id, hasListings, openInNewTab, showDialog, toggleDialog])


    const buttonColor = hasListings ? '#38b9f6' : '#777'

    return (
        <React.Fragment>
            {buttonType === 'icon'
                ? <Tooltip title='lock-bazaar listings available' arrow disableFocusListener>
                    <IconButton onClick={toggleDialog} style={{marginRight: 20, color: buttonColor}}>
                        <LocalOfferIcon/>
                    </IconButton>
                </Tooltip>
                : <Button
                    onClick={handleClick}
                    color='info'
                    variant='outlined'
                    sx={{textTransform: 'none'}}
                    style={{margin: 4, color: buttonColor, borderColor: buttonColor}}
                >
                    lpulocks.com
                </Button>
            }

            <Dialog open={dialogOpen} onClose={toggleDialog} componentsProps={{
                backdrop: {style: {backgroundColor: '#000', opacity: 0.6}}
            }}>
                <div style={{textAlign: 'right', padding: 10}}>
                    <IconButton onClick={toggleDialog} style={{padding: 0, margin: 0}}>
                        <HighlightOffIcon sx={{cursor: 'pointer'}}/>
                    </IconButton>
                </div>
                {hasListings
                    ? <div style={{maxWidth: 450, textAlign: 'left', padding: '0px 20px 20px 20px'}}>
                        <div style={{fontSize: '1.1rem', lineHeight: '1.5rem', fontWeight: 700, marginBottom: 10}}>
                            Listings of this lock for sale may be available at our sister site, lpulocks.com.
                        </div>
                        <div style={{fontSize: '1.0rem', lineHeight: '1.4rem'}}>
                            Lpulocks.com has searchable listings from most of the major #lock-bazaar sellers on
                            the LPU Discord.
                            Neither lpubelts.com nor lpulocks.com are not vouching for the sellers, please take
                            appropriate
                            precautions
                            as you would with any private purchase.
                            Sellers maintain &mdash; and are solely responsible for &mdash; all listings.<br/><br/>

                            Click below to leave lpubelts.com and view listings.
                        </div>
                        <div style={{textAlign: 'center', marginTop: 20}}>
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        color='info'
                                        size='small'
                                        checked={showDialog === false}
                                        onChange={toggleShowDialog}
                                    />
                                }
                                label={'Don\'t show this again'}
                            />
                            <Button variant='contained' size='small' color='info'
                                    onClick={() => openInNewTab(entry.id)}
                                    style={{margin: '8px 0px 3px 0px', height: 32}}>
                                VIEW LISTINGS FOR THIS LOCK
                            </Button>
                        </div>
                    </div>
                    : <div style={{maxWidth: 450, textAlign: 'left', padding: '0px 20px 20px 20px'}}>
                        <div style={{fontSize: '1.1rem', lineHeight: '1.5rem', fontWeight: 700, marginBottom: 10}}>
                            No current for sale listings at lpulocks.com.
                        </div>
                        <div style={{fontSize: '1.0rem', lineHeight: '1.4rem'}}>
                            Lpulocks.com has searchable listings from most of the major #lock-bazaar sellers on
                            the LPU Discord.
                            When this button is illuminated, you&#39;ll be able to click directly to listings for the
                            lock.
                            Please keep in mind that neither lpubelts.com nor lpulocks.com are not vouching for the
                            sellers. Sellers maintain &mdash; and are solely responsible for &mdash; all
                            listings.<br/><br/>
                        </div>
                        <div style={{textAlign: 'center', marginTop: 10, display: 'flex', justifyContent: 'center'}}>
                            <Button variant='contained' size='small' color='info'
                                    onClick={toggleDialog}
                                    style={{margin: '8px 0px 3px 0px', height: 32}}>
                                CLOSE
                            </Button>
                            <Button variant='contained' size='small' color='info'
                                    onClick={() => openInNewTab(undefined)}
                                    style={{margin: '8px 0px 3px 10px', height: 32}}>
                                Browse lpulocks.com
                            </Button>
                        </div>
                        <Link onClick={() => setShowDialog(true)}
                              style={{color: '#222', textDecoration: 'none', cursor: 'grab'}}>-</Link>
                    </div>
                }
            </Dialog>
        </React.Fragment>
    )
}

export default OpenLinkToLockbazaarButton
