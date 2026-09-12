import React from 'react'
import {MemoryRouter} from 'react-router-dom'
import {render, screen} from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import {describe, expect, it, vi} from 'vitest'
import AuthContext from '../../src/app/AuthContext.jsx'
import AppContext from '../../src/app/AppContext.jsx'
import RaffleContext from '../../src/rafl/RaffleContext.jsx'
import RafflePreviewBar from '../../src/rafl/RafflePreviewBar.jsx'
import {getData} from '../../src/formUtils/getData.jsx'

vi.mock('../../src/formUtils/getData.jsx', () => ({
    getData: vi.fn().mockResolvedValue({status: 'All Good!'})
}))

vi.mock('notistack', async importOriginal => {
    const original = await importOriginal()
    return {...original, enqueueSnackbar: vi.fn()}
})

describe('RafflePreviewBar', () => {
    it('sends the signed-in Firebase user when refreshing preview data', async () => {
        const user = {uid: 'rafl-admin', getIdToken: vi.fn()}
        const refresh = vi.fn().mockResolvedValue(undefined)
        render(
            <MemoryRouter>
                <AuthContext.Provider value={{user}}>
                    <AppContext.Provider value={{version: '2026-09-12'}}>
                        <RaffleContext.Provider value={{
                            preview: true,
                            setPreview: vi.fn(),
                            raflPreviewVersion: {version: '2026-09-11'}
                        }}>
                            <RafflePreviewBar page='pots' refresh={refresh}/>
                        </RaffleContext.Provider>
                    </AppContext.Provider>
                </AuthContext.Provider>
            </MemoryRouter>
        )

        await userEvent.click(screen.getByRole('button', {name: 'Refresh From Sheet'}))

        expect(getData).toHaveBeenCalledWith({
            user,
            url: expect.stringContaining('/refresh-preview'),
            snackBars: false,
            timeoutDuration: 30000
        })
        expect(refresh).toHaveBeenCalledOnce()
    })
})
