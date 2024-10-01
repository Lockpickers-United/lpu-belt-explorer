import React, {useContext, useCallback, useState} from 'react'
import {useParams} from 'react-router-dom'
import useData from '../../util/useData.jsx'
import DBContext from '../../app/DBContext.jsx'
import ScorecardNoTrack from './ScorecardNoTrack.jsx'
import LoadingDisplay from '../../util/LoadingDisplay.jsx'
import ProfileNotFound from '../../profile/ProfileNotFound.jsx'
import {ScorecardDataProvider} from '../ScorecardDataProvider.jsx'
import {FilterProvider} from '../../context/FilterContext.jsx'
import calculateScoreForUser from '../scoring'
import {ScorecardListProvider} from '../ScorecardListContext.jsx'
import {scorecardFilterFields} from '../../data/filterFields'
import ScorecardExportButton from '../ScorecardExportButton.jsx'
import {createTheme, ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'

function ScorecardRoute() {
    const {userId} = useParams()
    const {getProfile, getEvidence} = useContext(DBContext)

    const [triggerState, setTriggerState] = useState(false)
    const handleAdminAction = useCallback(() => {
        setTriggerState(!triggerState)
    }, [triggerState])

    const loadFn = useCallback(async () => {
        try {
            const profile = await getProfile(userId)
            if (profile) {
                const ownerName = profile.displayName
                    ? profile.displayName.toLowerCase().endsWith('s')
                        ? `${profile.displayName}'`
                        : `${profile.displayName}'s`
                    : 'Anonymous'
                document.title = `LPU Belt Explorer - ${ownerName} Scorecard`
            }

            const evidence = await getEvidence(userId)
            return {profile, ...calculateScoreForUser(evidence)}
        } catch (ex) {
            console.error('Error loading profile and evidence.', ex)
            return null
        }
    }, [userId, getProfile, getEvidence])
    const {data = {}, loading, error} = useData({loadFn})

    const profile = data ? data.profile : {}
    const cardEvidence = data ? data.scoredEvidence : []
    const cardBBCount = data ? data.bbCount : 0
    const cardDanPoints = data ? data.danPoints : 0
    const cardEligibleDan = data ? data.eligibleDan : 0
    const cardNextDanPoints = data ? data.nextDanPoints : 0
    const cardNextDanLocks = data ? data.nextDanLocks : 0

    if (loading || error) {
        return null
    }

    const ColorModeContext = React.createContext({
        toggleColorMode: () => {
        }
    })

    function ColorModeProvider({children}) {
        const darkTheme = createTheme({
            palette: {
                mode: 'dark',
                secondary: {
                    main: '#2d49bc'
                }
            }
        })

        const lightTheme = createTheme({
            palette: {
                mode: 'light'
            }
        })

        const [mode, setMode] = useState('light')
        const colorMode = React.useMemo(() => ({
                toggleColorMode: () => {
                    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'))
                }
            }),
            []
        )

        const theme = React.useMemo(() =>
                mode === 'light'
                    ? lightTheme
                    : darkTheme,
            [darkTheme, lightTheme, mode]
        )

        const style = getRootStyle(theme)

        return (
            <ColorModeContext.Provider value={colorMode}>
                <ThemeProvider theme={theme}>
                    <CssBaseline enableColorScheme/>
                    <style>{style}</style>
                    {children}
                </ThemeProvider>
            </ColorModeContext.Provider>
        )
    }

    return (
        <FilterProvider filterFields={scorecardFilterFields}>
            <ScorecardDataProvider cardEvidence={cardEvidence} cardBBCount={cardBBCount} cardDanPoints={cardDanPoints}
                                   cardEligibleDan={cardEligibleDan} cardNextDanPoints={cardNextDanPoints}
                                   cardNextDanLocks={cardNextDanLocks} popularLocks={[]}>
                <ScorecardListProvider>

                    <ColorModeProvider>

                        {loading && <LoadingDisplay/>}

                        {!loading && data && !error &&
                            <ScorecardNoTrack profile={profile}
                                              adminAction={handleAdminAction}/>}

                        {!loading && (!data || error) && <ProfileNotFound/>}

                        <div style={{width: '100%', textAlign: 'center', marginBottom:30}}>
                            <ScorecardExportButton/>
                        </div>

                    </ColorModeProvider>

                </ScorecardListProvider>
            </ScorecardDataProvider>
        </FilterProvider>
    )
}

export default ScorecardRoute

const getRootStyle = styleTheme => {
    const linkTextColor = styleTheme.palette.text.icon
    const backgroundColor = styleTheme.palette.background.default

    return `
            body {
                background-color: ${backgroundColor};
                margin: 0;
                padding: 0;
            }
            
            a {
                color: ${linkTextColor};
            }
            
            pre{ 
                white-space: pre-wrap; 
                word-break: break-word;
            }
            
            :root {
              color-scheme: dark;
              overflow-y: scroll;
            }
        `
}