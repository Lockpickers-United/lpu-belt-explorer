import React, {useCallback, useEffect, useMemo} from 'react'
import {useDropzone} from 'react-dropzone'
import Link from '@mui/material/Link'
import CancelIcon from '@mui/icons-material/Cancel'
import IconButton from '@mui/material/IconButton'

export default function Dropzone({files, setFiles}) {

    const {getRootProps, getInputProps, isFocused, isDragAccept, isDragReject} =
        useDropzone({
            accept: {
                'image/*': []
            },
            onDrop: acceptedFiles => {
                const newFiles = acceptedFiles.map(file => Object.assign(file, {preview: URL.createObjectURL(file)}))
                setFiles([...files, ...newFiles])
            }
        })

    const baseStyle = {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
        borderWidth: 1,
        borderRadius: 1,
        borderColor: '#777',
        borderStyle: 'dashed',
        backgroundColor: '#333',
        color: '#eee',
        outline: 'none',
        transition: 'border .24s ease-in-out',
        minWidth: 250
    }

    const focusedStyle = {borderColor: '#2196f3'}
    const acceptStyle = {borderColor: '#00e676'}
    const rejectStyle = {borderColor: '#ff1744'}

    const style = useMemo(() => ({
        ...baseStyle,
        ...(isFocused ? focusedStyle : {}),
        ...(isDragAccept ? acceptStyle : {}),
        ...(isDragReject ? rejectStyle : {})
    }), [isFocused, isDragAccept, isDragReject]) //eslint-disable-line

    const thumbsContainer = {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: 16,
        justifyContent: 'center'
    }

    const thumb = {
        display: 'inline-flex',
        borderRadius: 2,
        border: '0px solid #333',
        marginBottom: 12,
        marginRight: 8,
        //width: 100,
        height: 140,
        padding: 4,
        boxSizing: 'border-box'
    }

    const thumbInner = {
        display: 'flex',
        minWidth: 0,
        overflow: 'hidden',
        alignItems: 'start'
    }

    const img = {
        display: 'block',
        width: 'auto',
        height: '100%'
    }

    const clearAll = useCallback(() => {
        files.forEach(file => URL.revokeObjectURL(file.preview))
        setFiles([])
    }, [files, setFiles])

    const clearFile = useCallback((filename) => {
        const matchedFiles = files.filter(e => {return e.name === filename})
        matchedFiles.forEach(file => URL.revokeObjectURL(file.preview))
        setFiles(files.filter(e => e.name !== filename))
    }, [files, setFiles])

    const thumbs = files.map((file, index) => (
        <div style={thumb} key={index}>
            <div style={thumbInner}>
                <img
                    src={file.preview}
                    style={img}
                    alt='Upload preview'
                    // Revoke data uri after image is loaded
                    onLoad={() => {
                        //URL.revokeObjectURL(file.preview)
                    }}
                />
            </div>
            <IconButton style={{
                margin: '0px 0px 0px -16px',
                backgroundColor: '#000',
                padding: 0,
                height: 15,
                width: 15
            }} onClick={() => clearFile(file.name)}><CancelIcon/></IconButton>
        </div>
    ))

    useEffect(() => {
        // Make sure to revoke the data uris to avoid memory leaks, will run on unmount
        // doing this in remove now
        return () => files.forEach(file => URL.revokeObjectURL(file.preview))
    }, []) //eslint-disable-line


    return (

        <section className='container'>
            <div {...getRootProps({style})}>
                <input {...getInputProps()} />
                <p style={{textAlign: 'center'}}>Drag Files Here or<br/> Click to Browse</p>
            </div>

            {files.length > 0 &&
                <div style={{...baseStyle, paddingTop: 10, borderTop: 'none'}}>
                    <div style={thumbsContainer}>
                        {thumbs}
                    </div>
                    <Link onClick={() => {
                        clearAll()
                    }} style={{color: '#eee', marginTop: 6}}>Clear all</Link>
                </div>
            }

        </section>

    )


}
