import React, {useCallback, useContext} from 'react'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import MenuItem from '@mui/material/MenuItem'
import ListItemIcon from '@mui/material/ListItemIcon'
import LockIcon from '@mui/icons-material/Lock'
import ListItemText from '@mui/material/ListItemText'
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined'
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined'
import SavingsOutlinedIcon from '@mui/icons-material/SavingsOutlined'
import AuthContext from '../contexts/AuthContext.jsx'
import FilterContext from '../contexts/FilterContext.jsx'
import DBContext from '../contexts/DBContext.jsx'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'

function CollectionSubMenu({expanded, closeMain}) {

    const {isLoggedIn} = useContext(AuthContext)
    const {setFilters} = useContext(FilterContext)
    const {lockCollection} = useContext(DBContext)

    // Only works if in /belts
    const handleFilter = useCallback((filterKey, filterValue) => () => {
        setFilters({
            [filterKey]: filterValue,
            tab: 'search'
        })
        closeMain()
    }, [setFilters, closeMain])

    const menuItemStyle = {paddingLeft: '24px', backgroundColor: 'transparent'}

    return (
        <Accordion expanded={expanded} disableGutters
                   style={{
                       width: '100%',
                       boxShadow: 'none',
                       margin: '2px 0px 2px 24px',
                       backgroundColor: 'transparent',
                       backgroundImage: 'none'
                   }}>
            <AccordionSummary expandIcon={<ExpandMoreIcon style={{margin: '0px 16px'}}/>}
                              style={{
                                  backgroundColor: 'transparent',
                                  margin: 0,
                                  padding: 0,
                                  color: isLoggedIn ? '#fff' : '#999'
                              }}>
                <LibraryBooksIcon fontSize='small' style={{marginRight: '16px'}}/>
                My Collection
            </AccordionSummary>
            {
                isLoggedIn &&
                <ul style={{margin: 0, padding: '0px 0px 16px 0px', backgroundColor: 'transparent'}}>
                    <MenuItem onClick={handleFilter('collection', 'Own')} style={menuItemStyle}>
                        <ListItemIcon>
                            <LockIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>Owned ({lockCollection.own?.length || 0})</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleFilter('collection', 'Picked')} style={menuItemStyle}>
                        <ListItemIcon>
                            <LockOpenOutlinedIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>Picked ({lockCollection.picked?.length || 0})</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleFilter('collection', 'Recorded')} style={menuItemStyle}>
                        <ListItemIcon>
                            <VideocamOutlinedIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>Recorded ({lockCollection.recorded?.length || 0})</ListItemText>
                    </MenuItem>
                    <MenuItem onClick={handleFilter('collection', 'Wishlist')} style={menuItemStyle}>
                        <ListItemIcon>
                            <SavingsOutlinedIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>Wishlist ({lockCollection.wishlist?.length || 0})</ListItemText>
                    </MenuItem>
                </ul>
            }
            {
                !isLoggedIn &&
                <ul style={{margin: 0, padding: '0px 0px 16px 0px', backgroundColor: 'transparent'}}>
                    <MenuItem disabled style={menuItemStyle}>
                        <ListItemIcon>
                            <LockIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>Owned</ListItemText>
                    </MenuItem>
                    <MenuItem disabled style={menuItemStyle}>
                        <ListItemIcon>
                            <LockOpenOutlinedIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>Picked</ListItemText>
                    </MenuItem>
                    <MenuItem disabled style={menuItemStyle}>
                        <ListItemIcon>
                            <VideocamOutlinedIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>Recorded</ListItemText>
                    </MenuItem>
                    <MenuItem disabled style={menuItemStyle}>
                        <ListItemIcon>
                            <SavingsOutlinedIcon fontSize='small'/>
                        </ListItemIcon>
                        <ListItemText>Wishlist</ListItemText>
                    </MenuItem>
                </ul>
            }
        </Accordion>
    )
}

export default React.memo(CollectionSubMenu)
