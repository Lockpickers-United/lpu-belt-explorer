import {describe, expect, it} from 'vitest'
import {
    buildFiltersFromSearchParams,
    cleanFiltersObject,
    countActiveFilterParams,
    parseFiltersToGroups,
    serializeAdvancedFilterGroups
} from './filterUrlState.js'

const contractPolicy = {
    allowedFilterKeys: [
        'roaster',
        'originCountry',
        'processingMethod',
        'stockLevelFilter',
        'varietalsRecognized'
    ]
}

function filtersFromQuery(query) {
    return buildFiltersFromSearchParams(new URLSearchParams(query))
}

describe('filterUrlState', () => {
    it('parses existing OR, AND, and negative URL filter encodings', () => {
        expect(parseFiltersToGroups({
            roaster: 'Alma||Portrait',
            varietalsRecognized: 'Gesha@@Caturra',
            processingMethod: '!Washed'
        })).toEqual([
            {fieldName: 'roaster', matchType: 'Is', operator: 'OR', values: ['Alma', 'Portrait']},
            {fieldName: 'varietalsRecognized', matchType: 'Is', operator: 'AND', values: ['Gesha', 'Caturra']},
            {fieldName: 'processingMethod', matchType: 'Is Not', operator: 'OR', values: ['Washed']}
        ])
    })

    it('round-trips escaped reserved delimiter characters in filter values', () => {
        const searchParams = serializeAdvancedFilterGroups({
            filters: {sort: 'name'},
            groups: [{
                fieldName: 'roaster',
                matchType: 'Is',
                operator: 'OR',
                values: ['A || B', 'C @@ D', '!Literal', 'Back\\Slash']
            }]
        })
        const filters = buildFiltersFromSearchParams(searchParams)

        expect(filters.sort).toBe('name')
        expect(parseFiltersToGroups(filters)).toEqual([{
            fieldName: 'roaster',
            matchType: 'Is',
            operator: 'OR',
            values: ['A || B', 'C @@ D', '!Literal', 'Back\\Slash']
        }])
    })

    it('does not count empty filter params as active filters', () => {
        const searchParams = new URLSearchParams('roaster=&sort=name&varietalsRecognized=Gesha')
        expect(countActiveFilterParams(searchParams)).toBe(1)
    })

    it('preserves repeated values while building the filter object', () => {
        expect(filtersFromQuery('roaster=Alma&roaster=Portrait&sort=name')).toEqual({
            roaster: ['Alma', 'Portrait'],
            sort: 'name'
        })
    })

    it('drops only empty values while retaining false and zero', () => {
        expect(cleanFiltersObject({
            emptyString: '',
            nullValue: null,
            undefinedValue: undefined,
            falseValue: false,
            zeroValue: 0,
            arrayValue: ['', false, 0, null]
        })).toEqual({
            falseValue: false,
            zeroValue: 0,
            arrayValue: [false, 0]
        })
    })

    it('emits the canonical wire form for OR, AND, negation, and escaped tokens', () => {
        const searchParams = serializeAdvancedFilterGroups({
            filters: {sort: 'name'},
            groups: [
                {
                    fieldName: 'roaster',
                    matchType: 'Is',
                    operator: 'OR',
                    values: ['A || B', 'C @@ D', '!Literal', 'Back\\Slash']
                },
                {
                    fieldName: 'varietalsRecognized',
                    matchType: 'Is',
                    operator: 'AND',
                    values: ['Gesha', 'Caturra']
                },
                {
                    fieldName: 'processingMethod',
                    matchType: 'Is Not',
                    operator: 'OR',
                    values: ['Washed', 'Natural']
                }
            ]
        })

        expect(searchParams.toString()).toBe(
            'sort=name'
            + '&roaster=A+%5C%7C%5C%7C+B%7C%7CC+%5C%40%5C%40+D%7C%7C%5C%21Literal%7C%7CBack%5C%5CSlash'
            + '&varietalsRecognized=Gesha%40%40Caturra'
            + '&processingMethod=%21Washed%7C%7CNatural'
        )
    })
})

describe('portable route-policy contract', () => {
    it('parses only explicitly allowed keys as active groups', () => {
        const groups = parseFiltersToGroups(filtersFromQuery(
            'roaster=Alma&uid=123&unknown=future&sort=name'
        ), contractPolicy)

        expect(groups).toEqual([{
            fieldName: 'roaster',
            matchType: 'Is',
            operator: 'OR',
            values: ['Alma']
        }])
    })

    it('counts distinct allowed non-empty fields only', () => {
        const searchParams = new URLSearchParams(
            'roaster=Alma&roaster=Portrait&originCountry=&uid=123&unknown=future'
        )

        expect(countActiveFilterParams(searchParams, contractPolicy)).toBe(1)
    })

    it('canonicalizes compatible repetitions and removes duplicate values', () => {
        expect(parseFiltersToGroups(filtersFromQuery(
            'roaster=Alma&roaster=Portrait&roaster=Alma'
        ), contractPolicy)).toEqual([{
            fieldName: 'roaster',
            matchType: 'Is',
            operator: 'AND',
            values: ['Alma', 'Portrait']
        }])

        expect(parseFiltersToGroups(filtersFromQuery(
            'processingMethod=!Washed&processingMethod=!Natural'
        ), contractPolicy)).toEqual([{
            fieldName: 'processingMethod',
            matchType: 'Is Not',
            operator: 'AND',
            values: ['Washed', 'Natural']
        }])
    })

    it('uses the last valid occurrence for incompatible repetitions', () => {
        expect(parseFiltersToGroups(filtersFromQuery(
            'roaster=Alma%7C%7CPortrait&roaster=!Onyx&roaster='
        ), contractPolicy)).toEqual([{
            fieldName: 'roaster',
            matchType: 'Is Not',
            operator: 'OR',
            values: ['Onyx']
        }])
    })

    it('drops malformed empty tokens while preserving literal unmatched syntax', () => {
        expect(parseFiltersToGroups(filtersFromQuery(
            'roaster=!&originCountry=Colombia%7C%7C&processingMethod=Semi%40Washed'
        ), contractPolicy)).toEqual([
            {
                fieldName: 'originCountry',
                matchType: 'Is',
                operator: 'OR',
                values: ['Colombia']
            },
            {
                fieldName: 'processingMethod',
                matchType: 'Is',
                operator: 'OR',
                values: ['Semi@Washed']
            }
        ])
    })

    it('preserves opaque keys and multiplicity while replacing managed filters', () => {
        const searchParams = serializeAdvancedFilterGroups({
            searchParams: new URLSearchParams(
                'uid=123&unknown=first&roaster=Old&unknown=second&sort=name'
            ),
            allowedFilterKeys: contractPolicy.allowedFilterKeys,
            groups: [{
                fieldName: 'roaster',
                matchType: 'Is',
                operator: 'OR',
                values: ['Alma']
            }]
        })

        expect([...searchParams.entries()]).toEqual([
            ['uid', '123'],
            ['unknown', 'first'],
            ['unknown', 'second'],
            ['sort', 'name'],
            ['roaster', 'Alma']
        ])
    })

    it('retains false and zero through serialization and reparsing', () => {
        const searchParams = serializeAdvancedFilterGroups({
            searchParams: new URLSearchParams('sort=name'),
            allowedFilterKeys: contractPolicy.allowedFilterKeys,
            groups: [
                {
                    fieldName: 'stockLevelFilter',
                    matchType: 'Is',
                    operator: 'OR',
                    values: [false]
                },
                {
                    fieldName: 'originCountry',
                    matchType: 'Is',
                    operator: 'OR',
                    values: [0]
                }
            ]
        })

        expect(parseFiltersToGroups(
            buildFiltersFromSearchParams(searchParams),
            contractPolicy
        )).toEqual([
            {
                fieldName: 'stockLevelFilter',
                matchType: 'Is',
                operator: 'OR',
                values: ['false']
            },
            {
                fieldName: 'originCountry',
                matchType: 'Is',
                operator: 'OR',
                values: ['0']
            }
        ])
    })

    it.each([
        'roaster=Alma%7C%7CPortrait',
        'varietalsRecognized=Gesha%40%40Caturra',
        'processingMethod=!Washed%7C%7CNatural',
        'roaster=A+%5C%7C%5C%7C+B%7C%7C%5C%21Literal%7C%7CBack%5C%5CSlash'
    ])('is parse/serialize/parse equivalent for %s', query => {
        const firstGroups = parseFiltersToGroups(filtersFromQuery(query), contractPolicy)
        const serialized = serializeAdvancedFilterGroups({
            searchParams: new URLSearchParams(`sort=name&${query}`),
            allowedFilterKeys: contractPolicy.allowedFilterKeys,
            groups: firstGroups
        })
        const secondGroups = parseFiltersToGroups(
            buildFiltersFromSearchParams(serialized),
            contractPolicy
        )

        expect(secondGroups).toEqual(firstGroups)
        expect(serialized.get('sort')).toBe('name')
    })
})
