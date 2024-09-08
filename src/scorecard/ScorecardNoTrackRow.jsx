import React, {useContext} from 'react'
import dayjs from 'dayjs'
import entryName from '../entries/entryName'
import ScorecardDataContext from './ScorecardDataProvider.jsx'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Link from '@mui/material/Link'

function ScorecardNoTrackRow({evid}) {
    const {getEntryFromId, getProjectEntryFromId} = useContext(ScorecardDataContext)

    const entry = getEntryFromId(evid.matchId)
    const project = getProjectEntryFromId(evid.matchId)
    const entity = entry
        ? entry
        : project

    let entryTitle = entryName(entity)

    const pointsText = evid.points === 1 ? 'pt' : 'pts'
    let dateText = evid.date ? dayjs(evid.date).format('MM/DD/YY') : '(no date)'

    const linkText = evid.link.substring(0, 20)
    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const backgroundColor = '#fff'
    const color = '#333'
    const fontSize = '0.9rem'

    return (

        <React.Fragment>
            <TableRow key={evid.id}
                      sx={{
                          '&:nth-of-type(even) td, &:nth-of-type(even) th': {backgroundColor: '#eee'},
                          'td, th': {}
                      }}>
                <TableCell sx={{
                    textAlign: 'left',
                    fontSize: fontSize,
                    lineHeight: '1.1rem',
                    padding: '8px',
                    backgroundColor: backgroundColor,
                    color: color,
                    fontWeight: 600
                }}
                           component='th' scope='row'>
                    {entryTitle}
                </TableCell>

                <TableCell sx={{
                    textAlign: 'left',
                    fontSize: fontSize,
                    lineHeight: '1.1rem',
                    padding: '8px',
                    backgroundColor: backgroundColor,
                    color: color
                }}
                           component='th' scope='row'>
                    {entity?.version}
                </TableCell>

                <TableCell sx={{
                    textAlign: 'left',
                    fontSize: fontSize,
                    lineHeight: '1.1rem',
                    padding: '8px',
                    backgroundColor: backgroundColor,
                    color: color
                }}
                           component='th' scope='row'>
                    <nobr>{entity?.belt}</nobr>
                </TableCell>

                <TableCell sx={{
                    textAlign: 'left',
                    fontSize: fontSize,
                    lineHeight: '1.1rem',
                    padding: '8px',
                    backgroundColor: backgroundColor,
                    color: color
                }}
                           component='th' scope='row'>
                    {dateText}
                </TableCell>

                <TableCell sx={{
                    textAlign: 'left',
                    fontSize: fontSize,
                    lineHeight: '1.1rem',
                    padding: '8px',
                    backgroundColor: backgroundColor,
                    color: color
                }}
                           component='th' scope='row'>
                    <Link onClick={() => openInNewTab(evid.link)}>{linkText}</Link>
                </TableCell>

                <TableCell sx={{
                    textAlign: 'left',
                    fontSize: fontSize,
                    lineHeight: '1.1rem',
                    padding: '8px',
                    backgroundColor: backgroundColor,
                    color: color
                }}
                           component='th' scope='row'>
                    {evid.modifier}
                </TableCell>

                <TableCell sx={{
                    textAlign: 'left',
                    fontSize: fontSize,
                    lineHeight: '1.1rem',
                    padding: '8px',
                    backgroundColor: backgroundColor,
                    color: color
                }}
                           component='th' scope='row'>
                    <nobr><span style={{fontWeight: 700}}>{evid.points} </span><span
                        style={{color: '#666'}}>{pointsText}</span></nobr>
                </TableCell>
            </TableRow>

        </React.Fragment>
    )

}

export default React.memo(ScorecardNoTrackRow)
