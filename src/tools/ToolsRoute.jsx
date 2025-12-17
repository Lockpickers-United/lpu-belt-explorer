import React from 'react'
import Nav from '../nav/Nav.jsx'
import Footer from '../nav/Footer.jsx'
import Tracker from '../app/Tracker.jsx'
import Link from '@mui/material/Link'
import {useNavigate} from 'react-router-dom'
import usePageTitle from '../util/usePageTitle.jsx'
import {lockFilterFields} from '../data/filterFields'
import allEntries from '../data/data.json'
import {FilterProvider} from '../context/FilterContext.jsx'
import {DataProvider} from '../locks/LockDataProvider.jsx'

function ToolsRoute() {
    const navigate = useNavigate()

    usePageTitle('Tools')

    const nav = (
        <React.Fragment></React.Fragment>
    )

    const itemPadding = 20

    return (
        <FilterProvider filterFields={lockFilterFields}>
            <DataProvider allEntries={allEntries} profile={null}>
                <Nav title='Tools' extras={nav}/>
                <div style={{
                    maxWidth: 500, padding: 0,
                    marginLeft: 'auto', marginRight: 'auto', marginTop: 16, marginBottom: 46
                }}>
                    <div style={{marginTop: 40, backgroundColor: '#222', padding: itemPadding}}>
                        <Link onClick={() => navigate('/tools/flickrinfo')}
                              style={{
                                  color: '#fff',
                                  textDecorationColor: '#bbb',
                                  cursor: 'pointer',
                                  fontSize: '1.1rem',
                                  fontWeight: 700
                              }}>
                            Get Flickr Media Info
                        </Link><br/>
                        Retrieves photo data formatted for media tabs for a selected Flickr photoset by ID.
                    </div>

                    <div style={{marginTop: 20, backgroundColor: '#222', padding: itemPadding}}>
                        <Link onClick={() => navigate('/beltsMarkdown')}
                              style={{
                                  color: '#fff',
                                  textDecorationColor: '#bbb',
                                  cursor: 'pointer',
                                  fontSize: '1.1rem',
                                  fontWeight: 700
                              }}>
                            Export Belt Requirements Markdown
                        </Link><br/>
                        Preview Belt Requirements and export them to clipboard/markdown file.
                    </div>

                    <div style={{marginTop: 20, backgroundColor: '#222', padding: itemPadding}}>
                        <Link onClick={() => navigate('/tools/reddit-belts')}
                              style={{
                                  color: '#fff',
                                  textDecorationColor: '#bbb',
                                  cursor: 'pointer',
                                  fontSize: '1.1rem',
                                  fontWeight: 700
                              }}>
                            Belt Distribution Data & Refresh
                        </Link><br/>
                        Displays belt distribution data. Can refresh Reddit flairs, screenshot, copy data to clipboard.
                    </div>

                    <div style={{marginTop: 20, backgroundColor: '#222', padding: itemPadding}}>
                        <Link onClick={() => navigate('/recent')}
                              style={{
                                  color: '#fff',
                                  textDecorationColor: '#bbb',
                                  cursor: 'pointer',
                                  fontSize: '1.1rem',
                                  fontWeight: 700
                              }}>
                            Recent Changes
                        </Link><br/>
                        Shows recently added images (last 14 days) with links to entries.
                        Also has a tab for deleted entries (all time).
                    </div>

                    <div style={{marginTop: 20, backgroundColor: '#222', padding: itemPadding}}>
                        <Link onClick={() => navigate('/evidence-review')}
                              style={{
                                  color: '#fff',
                                  textDecorationColor: '#bbb',
                                  cursor: 'pointer',
                                  fontSize: '1.1rem',
                                  fontWeight: 700
                              }}>
                            Evidence Review
                        </Link><br/>
                        Displays All Projects (all Projects from Scorecards as well as unclaimed dan tabs),
                        Scorecard Projects, All Modified Picks, and Black Belt Picks with Modifiers.
                    </div>

                    <div style={{marginTop: 20, backgroundColor: '#222', padding: itemPadding}}>
                        <Link onClick={() => navigate('/userinfo')}
                              style={{
                                  color: '#fff',
                                  textDecorationColor: '#bbb',
                                  cursor: 'pointer',
                                  fontSize: '1.1rem',
                                  fontWeight: 700
                              }}>
                            User Info
                        </Link><br/>
                        Displays info for logged in user. Includes uid, claims, Scorecard stats, and Collection details.
                    </div>

                    <div style={{marginTop: 20, backgroundColor: '#222', padding: itemPadding}}>
                        <Link onClick={() => navigate('/projectsQuests')}
                              style={{
                                  color: '#fff',
                                  textDecorationColor: '#bbb',
                                  cursor: 'pointer',
                                  fontSize: '1.1rem',
                                  fontWeight: 700
                              }}>
                            Projects/Quests
                        </Link><br/>
                        Lists all Projects in Scorecards and Unclaimed Dan Sheet Tabs
                    </div>

                </div>
                <Footer/>
                <Tracker feature='flickrInfo'/>
            </DataProvider>
        </FilterProvider>
    )
}

export default ToolsRoute