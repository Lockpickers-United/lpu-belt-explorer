import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'

export default [
    {
        title: 'Home',
        icon: <HomeIcon fontSize='small'/>
    },
    {
        title: 'My Collection',
        icon: <LibraryBooksIcon fontSize='small'/>,
        children: [
            {
                title: 'Owned',
                icon: <LockIcon fontSize='small'/>
            },
            {
                title: 'Picked',
                icon: <LockOpenOutlinedIcon fontSize='small'/>
            },
            {
                title: 'Recorded',
                icon: <VideocamOutlinedIcon fontSize='small'/>
            },
            {
                title: 'Wishlist',
                icon: <SavingsOutlinedIcon fontSize='small'/>
            }
        ]
    },
    {
        title: 'Leaderboard',
        icon: <LeaderboardIcon fontSize='small'/>
    },
    {
        title: 'Belt Requirements',
        icon: <InfoOutlinedIcon fontSize='small'/>
    }
]
