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

    const handleChangeDiscipline = useCallback((event) => {
        if (event.target.value.length) {
            form.update({target: {name: fieldName, value: {...form.form[fieldName], discipline: event.target.value}}})
        } else {
            form.update({target: {name: fieldName, value: {...form.form[fieldName], discipline: undefined}}})
        }
    }, [fieldName, form])

    const handleChangeDetails = useCallback((event) => {
        if (event.target.value.length) {
            form.update({target: {name: fieldName, value: {...form.form[fieldName], details: event.target.value}}})
        } else {
            form.update({target: {name: fieldName, value: {...form.form[fieldName], details: undefined}}})
        }
    }, [fieldName, form])

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

            <Typography sx={{marginBottom: '2px'}}>Discipline</Typography>
            <SelectBox type='text'
                       name={fieldName + 'discipline'}
                       optionsList={disciplines}
                       form={form.form}
                       multiple={false}
                       defaultValue={''}
                       style={{margin: '6px 0px 0px 0px'}}
                       width={320}
                       size={'small'}
                       changeHandler={handleChangeDiscipline}
                       value={form.form[fieldName]?.discipline || ''}
                       />

            <Typography sx={{margin: '8px 0px 2px 0px'}}>Details</Typography>
            <TextField type='text'
                       name={fieldName + 'details'}
                       style={{margin: '0px 0px 16px 0px'}}
                       fullWidth
                       multiline={true}
                       rows={5}
                       size={'small'}
                       onChange={handleChangeDetails}
                       value={form.form[fieldName]?.details || ''}
                       color={'info'}
            />

        </div>

    )
}