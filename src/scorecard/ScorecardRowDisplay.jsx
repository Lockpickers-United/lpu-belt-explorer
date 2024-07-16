import EditIcon from '@mui/icons-material/Edit'
import IconButton from '@mui/material/IconButton'
import Link from '@mui/material/Link'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Tooltip from '@mui/material/Tooltip'
import Typography from '@mui/material/Typography'

function ScorecardRowDisplay({owner, evid, onEdit}) {

    return (
        <TableRow key={evid.row}>
            <TableCell align='left' style={{backgroundColor: evid.color}}>
                <Typography>{evid.row}</Typography>
            </TableCell>
            <TableCell align='center'>
                {owner &&
                    <IconButton size='small' onClick={() => onEdit(evid.id)}>
                        <EditIcon/>
                    </IconButton>
                }
            </TableCell>
            <TableCell align='left'>
                {evid.matchLink ?
                    <Link href={evid.matchLink} target='_blank' color='secondary'>
                        <Typography>{evid.matchName}</Typography>
                    </Link>
                    :
                    <Typography>{evid.matchName}</Typography>
                }
            </TableCell>
            <TableCell alight='left'>
                <Link href={evid.link} target='_blank' color='secondary'>
                    <Typography>{evid.name}</Typography>
                </Link>
            </TableCell>
            <TableCell align='left'>
                <Typography noWrap={true}>{evid.date}</Typography>
            </TableCell>
            <TableCell align='left'>
                <Typography>{evid.modifier}</Typography>
            </TableCell>
            <TableCell align='right'>
                <Typography>{evid.bbCount}</Typography>
            </TableCell>
            <TableCell align='right'>
                <Tooltip title={evid.note}>
                    <Typography>{evid.points}</Typography>
                </Tooltip>
            </TableCell>
        </TableRow>
    )
}

export default ScorecardRowDisplay

