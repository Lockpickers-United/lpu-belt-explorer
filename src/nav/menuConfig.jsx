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
        title: 'Belt List',
        icon: <HomeIcon fontSize='small'/>,
        path: '/belts',
        params: {
            tab: 'White'
        }
    },
    {
        title: 'My Collection',
        icon: <LibraryBooksIcon fontSize='small'/>,
        children: [
            {
                title: 'Owned',
                icon: <LockIcon fontSize='small'/>,
                path: '/belts',
                params: {
                    tab: 'search',
                    collection: 'Own'
                }
            },
            {
                title: 'Picked',
                icon: <LockOpenOutlinedIcon fontSize='small'/>,
                path: '/belts',
                params: {
                    tab: 'search',
                    collection: 'Picked'
                }
            },
            {
                title: 'Recorded',
                icon: <VideocamOutlinedIcon fontSize='small'/>,
                path: '/belts',
                params: {
                    tab: 'search',
                    collection: 'Recorded'
                }
            },
            {
                title: 'Wishlist',
                icon: <SavingsOutlinedIcon fontSize='small'/>,
                path: '/belts',
                params: {
                    tab: 'search',
                    collection: 'Wishlist'
                }
            }
        ]
    },
    {
        title: 'Leaderboard',
        icon: <LeaderboardIcon fontSize='small'/>,
        path: '/leaderboard'
    },
    {
        title: 'Belt Requirements',
        icon: <InfoOutlinedIcon fontSize='small'/>,
        path: '/info'
    }
]
