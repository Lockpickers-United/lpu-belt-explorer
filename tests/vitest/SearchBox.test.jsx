import React, {useCallback, useMemo} from 'react'
import {act, fireEvent, render, screen} from '@testing-library/react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {MemoryRouter, useLocation, useSearchParams} from 'react-router-dom'
import FilterContext, {FilterProvider} from '../../src/context/FilterContext.jsx'
import SearchBox from '../../src/nav/SearchBox.jsx'

function DelayedFilterProvider({children, delay = 100}) {
    const [searchParams, setSearchParams] = useSearchParams()

    const updateSearchParams = useCallback((update, navigationOptions) => {
        const nextSearchParams = new URLSearchParams(searchParams)
        update(nextSearchParams)
        setTimeout(() => {
            setSearchParams(nextSearchParams, {replace: true, ...navigationOptions})
        }, delay)
    }, [delay, searchParams, setSearchParams])

    const addFilters = useCallback((keyValues, replace, navigationOptions) => {
        updateSearchParams(nextSearchParams => {
            keyValues.forEach(({key, value}) => {
                if (!value) {
                    nextSearchParams.delete(key)
                } else if (replace) {
                    nextSearchParams.set(key, value)
                } else {
                    nextSearchParams.append(key, value)
                }
            })
        }, navigationOptions)
    }, [updateSearchParams])

    const removeFilter = useCallback((key, _value, navigationOptions) => {
        updateSearchParams(nextSearchParams => nextSearchParams.delete(key), navigationOptions)
    }, [updateSearchParams])

    const value = useMemo(() => ({
        addFilters,
        removeFilter,
        isFiltered: searchParams.has('search')
    }), [addFilters, removeFilter, searchParams])

    return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>
}

function LocationSearch() {
    const location = useLocation()
    return <div data-testid='location-search'>{location.search}</div>
}

function ExternalSearchButton() {
    const [, setSearchParams] = useSearchParams()
    return <button onClick={() => setSearchParams({search: 'external'})}>External search</button>
}

describe('SearchBox', () => {
    beforeEach(() => {
        vi.useFakeTimers()
        vi.stubGlobal('scrollTo', vi.fn())
    })

    afterEach(() => {
        vi.useRealTimers()
        vi.unstubAllGlobals()
    })

    it('does not replace newer input with a delayed URL update', async () => {
        render(
            <MemoryRouter>
                <DelayedFilterProvider>
                    <SearchBox label='Locks'/>
                    <LocationSearch/>
                </DelayedFilterProvider>
            </MemoryRouter>
        )

        const input = screen.getByRole('textbox')
        fireEvent.change(input, {target: {value: 'Sch'}})
        await act(async () => vi.advanceTimersByTime(250))

        fireEvent.change(input, {target: {value: 'Schlage'}})
        await act(async () => vi.advanceTimersByTime(100))

        expect(input).toHaveValue('Schlage')
        expect(screen.getByTestId('location-search')).toHaveTextContent('?search=Sch')

        await act(async () => vi.advanceTimersByTime(250))
        await act(async () => vi.advanceTimersByTime(100))
        expect(input).toHaveValue('Schlage')
        expect(screen.getByTestId('location-search')).toHaveTextContent('?search=Schlage')
    })

    it('still accepts search text from external navigation', async () => {
        render(
            <MemoryRouter>
                <FilterProvider>
                    <SearchBox label='Locks'/>
                    <ExternalSearchButton/>
                </FilterProvider>
            </MemoryRouter>
        )

        fireEvent.click(screen.getByRole('button', {name: 'External search'}))

        expect(screen.getByRole('textbox')).toHaveValue('external')
    })

    it('keeps a clear action when an older URL update is pending', async () => {
        render(
            <MemoryRouter>
                <DelayedFilterProvider>
                    <SearchBox label='Locks'/>
                    <LocationSearch/>
                </DelayedFilterProvider>
            </MemoryRouter>
        )

        const input = screen.getByRole('textbox')
        fireEvent.change(input, {target: {value: 'Sch'}})
        await act(async () => vi.advanceTimersByTime(250))

        fireEvent.click(screen.getByRole('button', {name: 'Clear'}))
        await act(async () => vi.advanceTimersByTime(100))

        expect(input).toHaveValue('')
        expect(screen.getByTestId('location-search')).toBeEmptyDOMElement()
    })
})
