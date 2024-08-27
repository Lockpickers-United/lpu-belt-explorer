import React from 'react'
import {PDFDocument, rgb} from 'pdf-lib'
import fontkit from '@pdf-lib/fontkit'
import dayjs from 'dayjs'
import Button from '@mui/material/Button'
import useWindowSize from '../util/useWindowSize.jsx'

function Award({profile}) {

    const downloadFile = async (blob) => {
        const URL = window.URL.createObjectURL(blob)
        const el = document.createElement('a')
        el.download = 'black-belt-award.pdf'
        el.href = URL
        el.click()
        window.URL.revokeObjectURL(URL)
    }

    async function modifyPdf(mode) {
        const url = mode === 'bw'
            ? '/images/black-belt-award-bw.pdf'
            : '/images/black-belt-award.pdf'
        const existingPdfBytes = await fetch(url).then(res => res.arrayBuffer())

        const fontUrl = '/fonts/LibreBaskerville-Regular.ttf'
        const fontBytes = await fetch(fontUrl).then((res) => res.arrayBuffer())

        const pdfDoc = await PDFDocument.load(existingPdfBytes)
        const pages = pdfDoc.getPages()
        const firstPage = pages[0]
        const {width, height} = firstPage.getSize()

        pdfDoc.registerFontkit(fontkit)
        const serifFont = await pdfDoc.embedFont(fontBytes)

        let text = profile?.displayName ? profile?.displayName : 'No Display Name Set'
        const textSize = 42
        const textWidth = serifFont.widthOfTextAtSize(text, textSize)
        const textHeight = serifFont.heightAtSize(textSize)

        let dateText = dayjs(profile?.blackBeltAwardedAt.seconds * 1000).format('MMMM D, YYYY')
        const dateTextSize = 11
        const dateTextWidth = serifFont.widthOfTextAtSize(dateText, dateTextSize)

        firstPage.drawText(text, {
            x: (width - textWidth) / 2,
            y: (height - textHeight) / 2 + 32,
            size: textSize,
            font: serifFont,
            color: rgb(0, 0, 0)
        })

        firstPage.drawText(dateText, {
            x: 190 - (dateTextWidth / 2),
            y: 120,
            size: dateTextSize,
            font: serifFont,
            color: rgb(0.2, 0.2, 0.2)
        })

        firstPage.drawText('The LPU Community', {
            x: 540,
            y: 120,
            size: dateTextSize,
            font: serifFont,
            color: rgb(0, 0, 0)
        })

        let b64Chunk = await pdfDoc.saveAsBase64()
        b64Chunk = 'data:application/pdf;base64,' + b64Chunk
        const blob = await (await fetch(b64Chunk)).blob()
        await downloadFile(blob)
    }

    const {isMobile} = useWindowSize()
    const mobileTransform = isMobile ? {transform: 'scale(0.5) translateX(-340px) translateY(-270px)'} : {}

    const height = 541
    const spacerTop = 208
    const nameHeight = 80
    const spacerMid = 97
    const detailsHeight = 80
    const spacerBot = height - spacerTop - nameHeight - spacerMid - detailsHeight

    const width = 700
    const hSpacer = 102
    const hDetails = 130
    const hSpacerMid = width - (hSpacer * 2) - (hDetails * 2)

    return (
        <React.Fragment>
            <link rel='preconnect' href='https://fonts.googleapis.com'/>
            <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin/>
            <link
                href='https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&display=swap'
                rel='stylesheet'/>

            <div style={{
                maxWidth: 700, padding: 0,
                marginLeft: 'auto', marginRight: 'auto', marginTop: 16
            }}>

                <div style={{display: 'flex', marginBottom: 20}}>
                    <div style={{flexGrow: 1}}>
                        <Button onClick={() => modifyPdf('bw')} color='primary' style={{color: '#fff', fontWeight: 700}}
                                disabled>
                            Preview
                        </Button>
                    </div>
                    <div>
                        <Button onClick={() => modifyPdf('bw')} color='primary' style={{color: '#fff'}} disabled>
                            Download PDF:
                        </Button>
                    </div>
                    <Button onClick={() => modifyPdf()} color='secondary' variant='outlined'
                            style={{margin: '0px 10px', color: '#46d046'}}>
                        Color
                    </Button>
                    <Button onClick={() => modifyPdf('bw')} color='success' variant='outlined'
                            style={{color: '#ccc'}}>
                        Grayscale
                    </Button>
                </div>

                <table style={{
                    backgroundImage: 'url(/images/certificate-bg.svg)',
                    width: width,
                    height: height,
                    backgroundColor: '#fff',
                    backgroundRepeat: 'no-repeat',
                    ...mobileTransform
                }}>
                    <tbody>
                    <tr>
                        <td style={{height: spacerTop}} colSpan={5}>&nbsp;</td>
                    </tr>
                    <tr>
                        <td style={{
                            textAlign: 'center',
                            fontFamily: 'Libre Baskerville',
                            color: '#000',
                            fontSize: '1.9rem',
                            height: nameHeight
                        }}
                            colSpan={5}
                        >
                            {profile?.displayName}
                        </td>
                    </tr>
                    <tr>
                        <td style={{height: spacerMid}} colSpan={5}>&nbsp;</td>
                    </tr>
                    <tr>
                        <td style={{width: hSpacer}}>&nbsp;</td>
                        <td style={{
                            textAlign: 'center',
                            fontFamily: 'Libre Baskerville',
                            color: '#000',
                            fontSize: '0.6rem',
                            width: hDetails
                        }}>
                            {dayjs(profile?.blackBeltAwardedAt.seconds * 1000).format('MMMM D, YYYY')}
                        </td>
                        <td style={{width: hSpacerMid}}>&nbsp;</td>
                        <td style={{
                            textAlign: 'center',
                            fontFamily: 'Libre Baskerville',
                            color: '#000',
                            fontSize: '0.6rem',
                            width: hDetails
                        }}>
                            The LPU Community
                        </td>
                        <td style={{width: hSpacer}}>&nbsp;</td>
                    </tr>
                    <tr>
                        <td style={{height: spacerBot}} colSpan={5}>&nbsp;</td>
                    </tr>
                    </tbody>
                </table>

            </div>
        </React.Fragment>

    )
}

export default Award
