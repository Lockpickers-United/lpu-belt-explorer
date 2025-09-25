import React, {useMemo} from 'react'
import {
    Dialog, Zoom, useTheme, lighten
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import CancelIcon from '@mui/icons-material/Cancel'
import Box from '@mui/material/Box'

export default function ScopedDialog({
                                         open,
                                         dialogContent,
                                         handleClose,
                                         width = 350,
                                         dark = false,
                                         containerRef,                 // optional: ref to a section <Box>
                                         position={top:80},            // { top, left, right, bottom } (numbers or CSS strings)
                                         anchorEl,                     // HTMLElement to anchor near
                                         offset = {x: 12, y: 12},      // anchor offset in px
                                         centerX = true                // horizontally center within the parent/viewport
                                     }) {

    const theme = useTheme()

    /*
            <ScopedDialog
                open={notesOpen}
                dialogContent={dialogContent}
                handleClose={handleNotesClose}
                containerRef={containerRef}
                position={{top: 80}}
                centerX={true}
                width={isMobile ? 350 : 550}
            />
    */

    const stopClick = (e) => {
        e.stopPropagation()
        e.preventDefault()
    }

    const containerEl = containerRef?.current || null
    const isScoped = !!containerEl

    const hasCustomPlacement =
        !!centerX ||
        position?.top !== undefined ||
        position?.bottom !== undefined ||
        position?.left !== undefined ||
        position?.right !== undefined ||
        !!anchorEl

    // Compute coords relative to the section if scoped,
    // otherwise relative to the viewport
    const computedPos = useMemo(() => {
        if (anchorEl) {
            const a = anchorEl.getBoundingClientRect()
            if (isScoped && containerEl) {
                const c = containerEl.getBoundingClientRect()
                return {
                    top: a.bottom - c.top + offset.y,
                    left: a.left - c.left + offset.x
                }
            }
            return {
                top: a.bottom + offset.y,
                left: a.left + offset.x
            }
        }
        return position
    }, [anchorEl, isScoped, containerEl, offset.x, offset.y, position])

    // Build Paper positioning rules
    const paperPos = {}
    if (computedPos?.top !== undefined) paperPos.top = computedPos.top
    if (computedPos?.bottom !== undefined) paperPos.bottom = computedPos.bottom

    if (centerX) {
        paperPos.left = '50%'
        paperPos.transform = 'translateX(-50%)'
    } else {
        if (computedPos?.left !== undefined) paperPos.left = computedPos.left
        if (computedPos?.right !== undefined) paperPos.right = computedPos.right
    }

    // If neither top nor bottom provided, give a small default offset
    if (hasCustomPlacement && paperPos.top === undefined && paperPos.bottom === undefined) {
        paperPos.top = 16
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            // Only set a container when scoped. Otherwise, let MUI use the viewport (document.body).
            {...(isScoped ? {container: () => containerEl} : {})}
            // Prevent scroll jump from autofocus
            disableScrollLock
            disableAutoFocus
            scroll='paper'
            sx={{
                // If scoped, make modal root + backdrop fill the section
                ...(isScoped
                    ? {
                        position: 'absolute',
                        inset: 0,
                        m: 0,
                        '& .MuiBackdrop-root': {
                            position: 'absolute',
                            inset: 0
                        }
                    }
                    : {}),

                // Only opt out of center layout when we’re custom-placing the paper
                ...(hasCustomPlacement
                    ? {
                        '& .MuiDialog-container': {
                            display: 'block',
                            minHeight: isScoped ? '100%' : undefined
                        }
                    }
                    : {}),

                // Position the paper: absolute when scoped, fixed when using viewport
                '& .MuiPaper-root': {
                    ...(hasCustomPlacement
                        ? {
                            position: isScoped ? 'absolute' : 'fixed',
                            ...paperPos
                        }
                        : {}),
                    // bounds and scrolling
                    maxWidth: 'min(600px, calc(100% - 24px))',
                    maxHeight: 'min(80vh, calc(100% - 24px))',
                    overflow: 'auto',
                    m: 0
                },
                '.MuiDialog-paper': {
                    backgroundColor: 'transparent', backgroundImage: 'none',
                    padding: '12px', margin: '0px 0px 20px 0px',
                    width: width,
                    boxShadow: 'none'
                },

            }}
            slotProps={{
                backdrop: {
                    sx: {
                        bgcolor: dark ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.5)',
                        backdropFilter: dark ? 'blur(0.75px)' : 'none'
                    }
                },
                paper: {
                    sx: {
                        backgroundColor: '#666',
                        padding: '8px',
                    }
                }
            }}
            //onEntered={() => paperFocusRef.current?.focus?.({ preventScroll: true })}
        >
            <Zoom in={open} timeout={{enter: 250, exit: 250}}>
                <div style={{position: 'relative', paddingBottom: 20}}>

                    {handleClose &&
                        <div onClick={handleClose} style={{
                            display: 'flex',
                            flexGrow: 1,
                            justifyContent: 'flex-end',
                            marginBottom: -15,
                            marginRight: -10
                        }}>
                            <IconButton style={{padding: 0, color: '#eee', backgroundColor: '#333'}}
                                        onClick={handleClose}>
                                <CancelIcon/>
                            </IconButton>
                        </div>
                    }
                    <Box onClick={stopClick} sx={{
                        backgroundColor: lighten(theme.palette.background.default, 0.2),
                        borderRadius: '4px',
                        //boxShadow: '0px 11px 15px -7px rgba(0,0,0,0.6),0px 18px 20px 0px rgba(0,0,0,0.4),0px 9px 46px 8px rgba(0,0,0,0.0)'
                        boxShadow: theme.shadows[10],
                    }}>
                        {dialogContent}
                    </Box>
                </div>
            </Zoom>
        </Dialog>
    )
}
