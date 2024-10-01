import React, {useContext} from 'react'
import dayjs from 'dayjs'
import entryName from '../../entries/entryName'
import ScorecardDataContext from '../ScorecardDataProvider.jsx'
import TableCell from '@mui/material/TableCell'
import TableRow from '@mui/material/TableRow'
import Link from '@mui/material/Link'

function ScorecardNoTrackRow({activity}) {
    const {getEntryFromId, getProjectEntryFromId, getAwardEntryFromId} = useContext(ScorecardDataContext)

    const entry = getEntryFromId(activity.matchId)
    const project = getProjectEntryFromId(activity.matchId)
    const award = getAwardEntryFromId(activity.matchId)
    const entity = entry || project || award

    let entryTitle = entryName(entity)

    const pointsText = activity.points === 1 ? 'pt' : 'pts'
    let dateText = activity.date ? dayjs(activity.date).format('MM/DD/YY') : '(no date)'

    const linkText = activity.link.substring(0, 20)
    const openInNewTab = (url) => {
        const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
    }

    const backgroundColor = '#fff'
    const color = '#333'
    const fontSize = '0.9rem'

    return (

        <React.Fragment>
            {!activity.awardType &&
                <TableRow key={activity.id}
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
                        <Link onClick={() => openInNewTab(activity.link)}>{linkText}</Link>
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
                        {activity.evidenceModifier}
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
                        <nobr><span style={{fontWeight: 700}}>{activity.points} </span><span
                            style={{color: '#666'}}>{pointsText}</span></nobr>
                    </TableCell>
                </TableRow>
            }
            {activity.awardType &&
                <TableRow key={activity.id}>
                    <TableCell colSpan={7} sx={{
                        textAlign: 'center',
                        fontSize: fontSize,
                        lineHeight: '1.1rem',
                        padding: '8px',
                        backgroundColor: '#bbb',
                        color: color,
                        fontWeight: 600
                    }}
                               component='th' scope='row'>
                        {entryTitle}
                    </TableCell>
                </TableRow>
            }

                </React.Fragment>
    )

}

export default React.memo(ScorecardNoTrackRow)
