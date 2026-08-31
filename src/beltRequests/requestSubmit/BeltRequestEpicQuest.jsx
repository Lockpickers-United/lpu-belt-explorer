import React, {useCallback} from 'react'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import allProjects from '../../data/projects.json'
import SelectBox from '../../formUtils/SelectBox.jsx'
import TextField from '@mui/material/TextField'

const disciplines = allProjects
    .filter(project => project.belt === 'Project 1')
    .map(project => project.name.replace(', tier 1', ''))

export default function BeltRequestEpicQuest({
                                                 handleReplaceQuest,
                                                 fieldName,
                                                 form = {},
                                                 entryNumber
                                             }) {

    const handleChangeField = useCallback((event) => {
        const {name, value} = event.target
        if (value.length) {
            form.update({target: {name: fieldName, value: {...form.form[fieldName], [name]: value}}})
        } else {
            form.update({target: {name: fieldName, value: {...form.form[fieldName], [name]: undefined}}})
        }
    }, [fieldName, form])

    const tierList = ['Tier 1', 'Tier 2', 'Tier 3', 'Tier 4', 'Tier 5']

    return (

        <div style={{margin: 0}}>
            <div style={{display: 'flex', alignItems: 'center', marginBottom: '0px'}}>
                <Typography sx={{fontSize: '1.2rem', fontWeight: 500}}>
                    EPIC QUEST #{entryNumber}
                </Typography>
                <Button variant='text' size='small' color='info'
                        style={{marginLeft: 16}} onClick={handleReplaceQuest}>
                    Replace with two locks
                </Button>
            </div>

            <div style={{display: 'flex', flexWrap: 'wrap'}}>
                <div style={{marginRight: '16px'}}>
                    <Typography sx={{marginBottom: '2px'}}>Discipline</Typography>
                    <SelectBox type='text'
                               name={'discipline'}
                               optionsList={disciplines}
                               form={form.form}
                               multiple={false}
                               defaultValue={''}
                               style={{margin: '6px 0px 0px 0px'}}
                               width={320}
                               size={'small'}
                               changeHandler={handleChangeField}
                               value={form.form[fieldName]?.discipline || ''}
                    />
                </div>
                <div>
                    <Typography sx={{marginBottom: '2px'}}>Requested Tier</Typography>
                    <SelectBox type='text'
                               name={'tier'}
                               optionsList={tierList}
                               form={form.form}
                               multiple={false}
                               defaultValue={''}
                               style={{margin: '6px 0px 0px 0px'}}
                               width={140}
                               size={'small'}
                               changeHandler={handleChangeField}
                               value={form.form[fieldName]?.tier || ''}
                    />

                </div>
            </div>
            <Typography sx={{margin: '8px 0px 2px 0px'}}>Details</Typography>
            <TextField type='text'
                       name={'details'}
                       style={{margin: '0px 0px 16px 0px'}}
                       fullWidth
                       multiline={true}
                       rows={5}
                       size={'small'}
                       onChange={handleChangeField}
                       value={form.form[fieldName]?.details || ''}
                       color={'info'}
            />

        </div>

    )
}