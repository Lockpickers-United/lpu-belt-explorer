import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety'
import GppGoodIcon from '@mui/icons-material/GppGood'
import GppBadIcon from '@mui/icons-material/GppBad'
import GppMaybeIcon from '@mui/icons-material/GppMaybe'
import LocalPoliceIcon from '@mui/icons-material/LocalPolice'
import ShieldMoonIcon from '@mui/icons-material/ShieldMoon'
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip'

// display variables
export const classificationStatuses = {
    'No Votes': {
        color: '#777',
        Icon: ShieldMoonIcon
    },
    'Has Votes': {
        color: '#ddd',
        Icon: HealthAndSafetyIcon
    },
    'Draft': {
        color: '#319431',
        Icon: PrivacyTipIcon
    },
    Pending: {
        color: '#1aa41a',
        Icon: GppGoodIcon
    },
    Staged: {
        color: '#0d0',
        Icon: LocalPoliceIcon
    },
    Published: {
        color: '#777',
        Icon: ShieldMoonIcon
    },
    'Re-opened': {
        color: '#5386c5',
        Icon: HealthAndSafetyIcon
    },
    Settled: {
        color: '#da5d5d',
        Icon: GppBadIcon
    },
    Error: {
        color: '#ff2424',
        Icon: GppMaybeIcon
    }
}
