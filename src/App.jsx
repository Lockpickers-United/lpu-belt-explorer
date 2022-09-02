import {Button} from '@mui/material'
import React from 'react'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider'
import ListItemText from '@mui/material/ListItemText'
import ListItemAvatar from '@mui/material/ListItemAvatar'
import Avatar from '@mui/material/Avatar'
import Typography from '@mui/material/Typography'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Chip from '@mui/material/Chip'
import Stack from '@mui/material/Stack'
import Belt from './Belt.jsx'
import Grid from '@mui/material/Grid'

import data from './data'

function App() {
    const [expanded, setExpanded] = React.useState(null)

    const handleChange = panel => (event, isExpanded) => setExpanded(isExpanded ? panel : false)

    return (
        <div style={{margin: 8}}>
            {data.map((datum, index) => {
                const id = `lock${index}`
                return (
                    <React.Fragment key={id}>
                        <Accordion expanded={expanded === id} onChange={handleChange(id)}>
                            <AccordionSummary expandIcon={<ExpandMoreIcon/>}>
                                <Belt value={datum.belt}/>
                                <Typography sx={{width: '50%', flexShrink: 0, flexDirection: 'column'}}
                                            style={{marginRight: 8}}>
                                    <div>
                                        <Typography component='span' sx={{color: 'text.secondary'}}>Make: </Typography>
                                        <Typography component='span'>{datum.make}</Typography>
                                    </div>
                                    <div>
                                        <Typography component='span' sx={{color: 'text.secondary'}}>Model: </Typography>
                                        <Typography component='span'>{datum.model}</Typography>
                                    </div>
                                </Typography>
                                <Typography sx={{width: '50%', flexShrink: 0, flexDirection: 'column'}}>
                                    <div>
                                        <Typography component='span' sx={{color: 'text.secondary'}}>Type: </Typography>
                                        <Typography component='span'>{datum.type}</Typography>
                                    </div>
                                    <div>
                                        <Typography component='span' sx={{color: 'text.secondary'}}>Belt: </Typography>
                                        <Typography component='span'>{datum.belt}</Typography>
                                    </div>
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography component='span' sx={{color: 'text.secondary'}}>Tags: </Typography>
                                <Stack direction='row' spacing={0} sx={{flexWrap: 'wrap'}}>
                                    {datum.tags.map(tag => <Chip label={tag} variant='outlined' style={{marginRight: 4, marginBottom: 4}}/>)}
                                </Stack>

                                <Typography component='span' sx={{color: 'text.secondary'}}>Links: </Typography>
                                <Stack direction='row' spacing={1}>
                                    {datum.links.map(({text, url}) =>
                                        <Button href={url} target='_blank'>{text}</Button>
                                    )}
                                </Stack>
                            </AccordionDetails>
                        </Accordion>
                    </React.Fragment>
                )
            })}
        </div>
    )
}

export default App
