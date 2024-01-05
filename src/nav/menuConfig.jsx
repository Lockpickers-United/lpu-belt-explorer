import React from 'react'
import HomeIcon from '@mui/icons-material/Home'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import LeaderboardIcon from '@mui/icons-material/Leaderboard'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import InsertChartOutlinedIcon from '@mui/icons-material/InsertChartOutlined'
import MenuBookIcon from '@mui/icons-material/MenuBook'
import FactCheckIcon from '@mui/icons-material/FactCheck'

export default [
    {
        title: 'Lock List',
        icon: <HomeIcon fontSize='small'/>,
        path: '/belts',
        params: {
            tab: 'White',
            search: undefined,
            id: undefined,
            name: undefined
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
        beta: true,
        title: 'Glossary',
        icon: <MenuBookIcon fontSize='small'/>,
        path: '/glossary'
    },
    {
        beta: true,
        title: 'Stats for Nerds',
        icon: <InsertChartOutlinedIcon/>,
        path: '/stats'
    },
    {
        title: 'Belt Requirements',
        icon: <InfoOutlinedIcon fontSize='small'/>,
        path: '/info'
    },
    {
        beta: true,
        title: 'About LPU Belts',
        icon: <FactCheckIcon fontSize='small'/>,
        path: '/about'
    }
]
