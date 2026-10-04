import {describe, expect, it} from 'vitest'
import {
    addAdvancedFilterGroup,
    changeAdvancedFilterRow,
    reconcileAdvancedFilterRows,
    removeAdvancedFilterRow,
    splitAdvancedFilterRows
} from './advancedFilterState.js'

const activeRoaster = {
    fieldName: 'roaster',
    matchType: 'Is',
    operator: 'OR',
    values: ['Alma']
}

const draftOrigin = {
    _id: 'draft-origin',
    fieldName: 'originCountry',
    matchType: 'Is',
    operator: 'OR',
    values: []
}

describe('advancedFilterState', () => {
    it('combines committed groups with incomplete drafts without making drafts active', () => {
        const rows = reconcileAdvancedFilterRows({
            activeGroups: [activeRoaster],
            draftRows: [draftOrigin],
            previousRows: [{...activeRoaster, _id: 'active-roaster'}],
            createId: () => 'unexpected-id'
        })

        expect(rows).toEqual([
            {...activeRoaster, _id: 'active-roaster'},
            draftOrigin
        ])
        expect(splitAdvancedFilterRows(rows)).toEqual({
            activeGroups: [{...activeRoaster, _id: 'active-roaster'}],
            draftRows: [draftOrigin]
        })
    })

    it('discards drafts when external navigation reconciles without them', () => {
        const rows = reconcileAdvancedFilterRows({
            activeGroups: [{...activeRoaster, fieldName: 'processingMethod', values: ['Washed']}],
            draftRows: [],
            previousRows: [{...activeRoaster, _id: 'active-roaster'}, draftOrigin],
            createId: () => 'active-processing'
        })

        expect(rows).toEqual([{
            ...activeRoaster,
            _id: 'active-processing',
            fieldName: 'processingMethod',
            values: ['Washed']
        }])
    })

    it('keeps a row identity when clearing its last value turns it into a draft', () => {
        const rows = [{...activeRoaster, _id: 'active-roaster'}]
        const changed = changeAdvancedFilterRow({
            rows,
            rowId: 'active-roaster',
            changes: {values: []}
        })

        expect(changed).toEqual([{...activeRoaster, _id: 'active-roaster', values: []}])
        expect(splitAdvancedFilterRows(changed)).toEqual({
            activeGroups: [],
            draftRows: [{...activeRoaster, _id: 'active-roaster', values: []}]
        })
    })

    it('preserves an empty value slot as UI-only draft state', () => {
        const rowWithNewValueSlot = {
            ...activeRoaster,
            _id: 'active-roaster',
            operator: 'AND',
            values: ['Alma', '']
        }
        const split = splitAdvancedFilterRows([rowWithNewValueSlot])

        expect(split).toEqual({
            activeGroups: [{
                ...activeRoaster,
                _id: 'active-roaster',
                operator: 'AND'
            }],
            draftRows: [rowWithNewValueSlot]
        })
        expect(reconcileAdvancedFilterRows({
            activeGroups: [activeRoaster],
            draftRows: split.draftRows,
            previousRows: [{...activeRoaster, _id: 'active-roaster'}],
            createId: () => 'unexpected-id'
        })).toEqual([rowWithNewValueSlot])
    })

    it('keeps a row identity and clears values when its field changes', () => {
        const changed = changeAdvancedFilterRow({
            rows: [{...activeRoaster, _id: 'active-roaster'}],
            rowId: 'active-roaster',
            changes: {fieldName: 'originCountry'}
        })

        expect(changed).toEqual([{
            ...activeRoaster,
            _id: 'active-roaster',
            fieldName: 'originCountry',
            values: []
        }])
    })

    it('rejects a field change that would create a duplicate field', () => {
        const rows = [
            {...activeRoaster, _id: 'active-roaster'},
            {...draftOrigin, values: ['Colombia']}
        ]
        const changed = changeAdvancedFilterRow({
            rows,
            rowId: 'draft-origin',
            changes: {fieldName: 'roaster'}
        })

        expect(changed).toBe(rows)
    })

    it('reuses stable IDs by field and creates IDs only for new rows', () => {
        const generatedIds = ['new-processing']
        const rows = reconcileAdvancedFilterRows({
            activeGroups: [
                {...activeRoaster, values: ['Portrait']},
                {...activeRoaster, fieldName: 'processingMethod', values: ['Natural']}
            ],
            previousRows: [{...activeRoaster, _id: 'active-roaster'}],
            createId: () => generatedIds.shift()
        })

        expect(rows.map(row => row._id)).toEqual(['active-roaster', 'new-processing'])
    })

    it('changes and removes rows by ID when a hidden row precedes a visible row', () => {
        const hidden = {...activeRoaster, _id: 'hidden-roaster'}
        const visible = {...draftOrigin, _id: 'visible-origin', values: ['Colombia']}
        const changed = changeAdvancedFilterRow({
            rows: [hidden, visible],
            rowId: 'visible-origin',
            changes: {values: ['Kenya']}
        })

        expect(changed).toEqual([
            hidden,
            {...visible, values: ['Kenya']}
        ])
        expect(removeAdvancedFilterRow({rows: changed, rowId: 'visible-origin'})).toEqual([hidden])
    })

    it('adds to an existing group without mutating frozen input', () => {
        const frozenGroup = Object.freeze({
            ...activeRoaster,
            _id: 'active-roaster',
            values: Object.freeze(['Alma'])
        })
        const rows = Object.freeze([frozenGroup])
        const changed = addAdvancedFilterGroup({
            rows,
            fieldName: 'roaster',
            valueToAdd: 'Portrait',
            operator: 'AND'
        })

        expect(changed).toEqual([{
            ...activeRoaster,
            _id: 'active-roaster',
            operator: 'AND',
            values: ['Alma', 'Portrait']
        }])
        expect(rows).toEqual([frozenGroup])
        expect(changed).not.toBe(rows)
        expect(changed[0]).not.toBe(frozenGroup)
    })

    it.each([false, 0])('accepts %j as a concrete value', value => {
        const changed = addAdvancedFilterGroup({
            rows: [],
            fieldName: 'stockLevelFilter',
            valueToAdd: value,
            createId: () => 'stock-level'
        })

        expect(splitAdvancedFilterRows(changed).activeGroups).toEqual([{
            _id: 'stock-level',
            fieldName: 'stockLevelFilter',
            matchType: 'Is',
            operator: 'OR',
            values: [value]
        }])
    })
})
