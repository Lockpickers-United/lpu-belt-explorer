import {makeStyles} from '@mui/styles'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Tooltip from '@mui/material/Tooltip'
import Paper from '@mui/material/Paper'
import Link from '@mui/material/Link'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import EditIcon from '@mui/icons-material/Edit'
import entryName from '../entries/entryName'
import allEntries from '../data/data.json'
import allProjects from '../data/projects.json'
import nextUpgrades from '../data/upgrades.json'
import belts, {projectTiers, modifierMultiplier} from '../data/belts'

const allEntriesById = allEntries
    .reduce((group, term) => {
        const {id} = term
        group[id] = term
        return group
    }, {})

const allProjectsById = allProjects
	.reduce((group, term) => {
		const {id} = term
		group[id] = term
		return group
	}, {})

const possibleUpgrades = Object.keys(nextUpgrades)
	.reduce((group, term) => {
		group[term] = true
		nextUpgrades[term].forEach(id => {
			group[id] = true
		})
		return group
	}, {})

function isUpgradeOf(aId, bId) {
	if (!nextUpgrades[bId]) {
		return false
	} else if (nextUpgrades[bId].includes(aId)) {
		return true
	} else {
		return nextUpgrades[bId].some(id => isUpgradeOf(aId, id))
	}
}


function Scorecard({evidence}) {
	const useStyles = makeStyles({
		table: {
			maxWidth: 650
		}
	})

	const annotatedEvidence = evidence.map(ev => {
		const entry = allEntriesById[ev.id]
		const project = allProjectsById[ev.id]
		const dateObj = ev.date && new Date(ev.date) 
		const dateStr = dateObj && dateObj.getFullYear() + '-' + (dateObj.getMonth()+1) + '-' + dateObj.getDate()
		const modifier = ev.modifier && ev.modifier != 'Upgraded' ? ev.modifier : null
		const multiplier = modifier ? modifierMultiplier[modifier] : 1

		if (entry) {
			const name =  entryName(entry)
        	const safeName = name.replace(/[\s/]/g, '_').replace(/\W/g, '')

			return {
				...ev,
				matchName: name,
				matchLink: `https://share.lpubelts.com/?id=${entry.id}&name=${safeName}`,
				color: belts[entry.belt].color,
				date: dateStr,
				modifier: modifier,
				points: multiplier * belts[entry.belt].danPoints,
				bbCount: entry.belt.startsWith('Black') ? 1 : 0,
			}
		} else if (project) {
			return {
				...ev,
				matchName: project.name,
				color: belts['Unranked'].color,
				date: dateStr,
				modifier: modifier,
				points: multiplier * projectTiers[project.tier].danPoints,
				bbCount: 0
			}
		} else {
			return {
				...ev,
				matchName: '',
				color: belts['Unranked'].color,
				date: dateStr,
				modifier: modifier,
				points: 0,
				bbCount: 0
			}
		}
	})

	const sortedEvidence = annotatedEvidence.sort((a,b) => {
		const aDate = new Date(a.date)
		const bDate = new Date(b.date)
		if (aDate > bDate) {
			return -1
		} else if (aDate < bDate) {
			return 1
		} else {
			return a.name < b.name ? -1 : 1
		}
	})

	let scoredEvidence = []
	let usedIds = {}
	let upgradeableIdIdx = []

	for (let idx=sortedEvidence.length-1; idx >= 0; idx--) {
		const ev = sortedEvidence[idx]

		if (!ev.id) {
			scoredEvidence[idx] = {
				...ev,
				row: idx+1,
				note: 'no match with lock or project'
			}
		} else {
			const collidedIdx = usedIds[ev.id]

			if (collidedIdx) {
				scoredEvidence[idx] = {
					...ev,
					row: idx+1,
					points: 0,
					note: `samelined with row ${collidedIdx+1}`
				}
			} else {
				usedIds[ev.id] = idx
				let superseded = false 

				if (possibleUpgrades[ev.id]) {
					for (let jdx=0; !superseded && jdx < upgradeableIdIdx.length; jdx++) {
						const [upId, upIdx] = upgradeableIdIdx[jdx]

						if (isUpgradeOf(upId, ev.id)) {
							superseded = true

							scoredEvidence[idx] = {
								...ev,
								row: idx+1,
								points: 0,
								note: `superseded by row ${upIdx+1}`
							}

						} else if (isUpgradeOf(ev.id, upId)) {
							scoredEvidence[upIdx] = {
								...scoredEvidence[upIdx],
								row: upIdx+1,
								points: 0,
								note: `superseded by row ${idx+1}`
							}							
						}
					}
					upgradeableIdIdx.push([ev.id, idx])
				}

				if (!superseded) {
					scoredEvidence[idx] = {
						...ev,
						row: idx+1
					}
				}
			}
		}
	}

	const [bbCount, danPoints] = scoredEvidence.reduce((group, ev) => {
		group[0] = group[0] + ev.bbCount
		group[1] = group[1] + ev.points
		return group
	}, [0, 0])

	return (
        <div style={{margin: 8, paddingBottom: 32}}>
        	<Stack direction='row' justifyContent='space-evenly' alignItems='center'>
        		<Typography variant='h4'>{bbCount} Black Belt Locks</Typography>
        		<Typography variant='h4'>{danPoints} Dan Points</Typography>
        	</Stack>
			<TableContainer component={Paper}>
				<Table className={useStyles().table} aria-label="scorecard">
					<TableHead>
						<TableRow>
							<TableCell align='left'></TableCell>
							<TableCell align='left'></TableCell>
							<TableCell align='left'>
								<Typography>Lock / Project</Typography>
							</TableCell>
							<TableCell align='left'>
								<Typography>Evidence</Typography>
							</TableCell>
							<TableCell align='left'>
								<Typography>Date</Typography>
							</TableCell>
							<TableCell align='left'>
								<Typography>Modifier</Typography>
							</TableCell>
							<TableCell align='right'>
								<Typography>BBs</Typography>
							</TableCell>
							<TableCell align='right'>
								<Typography>Points</Typography>
							</TableCell>
						</TableRow>
					</TableHead>
				<TableBody>
					{scoredEvidence.map(ev => {
						return (
						<TableRow key={ev.row}>
							<TableCell align='left' style={{backgroundColor: ev.color}}>
								<Typography>{ev.row}</Typography>
							</TableCell>
							<TableCell align='center'>
								<IconButton size='small'>
							        <EditIcon/> 
							    </IconButton>
							</TableCell>
							<TableCell align='left'>
							{ev.matchLink ? 
						        <Link href={ev.matchLink} target='_blank' color='secondary'>
						        	<Typography>{ev.matchName}</Typography>
						        </Link>
							:
								<Typography>{ev.matchName}</Typography>								
							}
							</TableCell>
							<TableCell component='th' scope='row'>
						        <Link href={ev.link} target='_blank' color='secondary'>
						        	<Typography>{ev.name}</Typography>
						        </Link>
							</TableCell>
							<TableCell align='left'>
								<Typography noWrap={true}>{ev.date}</Typography>
							</TableCell>
							<TableCell align='left'>
								<Typography>{ev.modifier}</Typography>
							</TableCell>
							<TableCell align='right'>
								<Typography>{ev.bbCount}</Typography>
							</TableCell>
							<TableCell align='right'>
								<Tooltip title={ev.note}>
									<Typography>{ev.points}</Typography>
								</Tooltip>
							</TableCell>
						</TableRow>
					)})}
				</TableBody>
				</Table>
		    </TableContainer>
		</div>
	)
}

export default Scorecard
