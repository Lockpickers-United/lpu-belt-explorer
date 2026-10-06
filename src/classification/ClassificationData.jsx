import { darken } from '@mui/material/styles'
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import GppGoodIcon from '@mui/icons-material/GppGood'
import GppBadIcon from '@mui/icons-material/GppBad'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'
import LocalPoliceIcon from '@mui/icons-material/LocalPolice'
import PolicyIcon from '@mui/icons-material/Policy'

const greenColor = '#0e0'

export const classificationStatuses = {
        closedVotes: {
            name: 'Closed Votes',
            color: '#c44646',
            icon: GppBadIcon
        },
        Open: {
            name: 'Open Votes',
            color: darken(greenColor, 0.5),
            icon: HealthAndSafetyIcon
        },
        Pending: {
            name: 'Pending',
            color: darken(greenColor, 0.3),
            icon: GppGoodIcon
        },
        Staged: {
            name: 'Staged',
            color: darken(greenColor, 0.0),
            icon: LocalPoliceIcon
        },
        Published: {
            name: 'Published',
            color: '#0f0',
            icon: PolicyIcon
        },
        cancelled: {
            name: 'Cancelled',
            color: '#fff',
            icon: GppMaybeIcon
        }
}