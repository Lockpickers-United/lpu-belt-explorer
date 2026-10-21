import React from 'react'
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest'
import {screen, waitFor} from '@testing-library/react'
import {userEvent} from '@testing-library/user-event'
import ScorecardDataContext from '../../src/scorecard/ScorecardDataProvider.jsx'
import BeltRequestForm from '../../src/beltRequests/requestSubmit/BeltRequestForm.jsx'
import useForm from '../../src/formUtils/useForm.jsx'
import {startDiscordAuth, storeDiscordPostingGrant} from '../../src/auth/discordAuth.js'
import {readDiscordBeltRequestDraft, saveDiscordBeltRequestDraft}
    from '../../src/beltRequests/requestSubmit/discordBeltRequest.js'
import {renderWithRouter} from '../../src/test/render.jsx'
import {enqueueSnackbar} from 'notistack'

vi.mock('../../src/formUtils/useForm.jsx', () => ({default: vi.fn()}))
vi.mock('../../src/formUtils/FormElement.jsx', () => ({default: () => null}))
vi.mock('../../src/beltRequests/requestSubmit/RequestBeltRequirements.jsx', () => ({default: () => null}))
vi.mock('../../src/beltRequests/requestSubmit/BeltRequestEntrySelect.jsx', () => ({default: () => null}))
vi.mock('../../src/beltRequests/requestSubmit/BeltRequestEpicQuest.jsx', () => ({default: () => null}))
vi.mock('../../src/app/Tracker.jsx', () => ({default: () => null}))
vi.mock('../../src/auth/discordAuth.js', async importOriginal => ({
    ...await importOriginal(), startDiscordAuth: vi.fn()
}))
vi.mock('notistack', () => ({enqueueSnackbar: vi.fn()}))

const entry = {lockId: 'lock-1', lockName: 'Test Lock', belt: 'White',
    link: 'https://example.com/evidence'}
const requestForm = {requestBelt: 'White Belt', readRequirements: true,
    requestPlatform: 'Discord Post', entry1: entry}
let form

function renderForm({user = {uid: 'firebase-user'}, postDiscordBeltRequest = vi.fn(),
    startDiscordOAuth = vi.fn(), initialEntries} = {}) {
    return renderWithRouter(
        <ScorecardDataContext.Provider value={{profile: {}, visibleEntries: []}}>
            <BeltRequestForm/>
        </ScorecardDataContext.Provider>,
        {auth: {user}, api: {postDiscordBeltRequest, startDiscordOAuth}, initialEntries}
    )
}

describe('Post to Discord button', () => {
    beforeEach(() => {
        vi.clearAllMocks()
        form = {
            form: requestForm, canSave: true, intialized: true, required: [], invalid: [],
            submitting: false, submitted: false, initialize: vi.fn(), require: vi.fn(),
            submit: vi.fn(), clearSubmit: vi.fn(), update: vi.fn(), reload: vi.fn(),
            restore: vi.fn(), validate: vi.fn(), invalidate: vi.fn()
        }
        vi.mocked(useForm).mockReturnValue(form)
    })

    afterEach(() => sessionStorage.clear())

    it('saves the draft and starts fresh OAuth before sending', async () => {
        const postDiscordBeltRequest = vi.fn()
        renderForm({postDiscordBeltRequest})
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post to Discord'}))

        expect(startDiscordAuth).toHaveBeenCalledWith({
            startDiscordOAuth: expect.any(Function), purpose: 'beltRequest', returnTo: '/beltRequests'
        })
        expect(readDiscordBeltRequestDraft('firebase-user').form).toEqual(requestForm)
        expect(postDiscordBeltRequest).not.toHaveBeenCalled()
    })

    it('prevents repeated authorization while OAuth startup is pending', async () => {
        let finish
        vi.mocked(startDiscordAuth).mockImplementationOnce(() => new Promise(resolve => { finish = resolve }))
        renderForm()
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post to Discord'}))

        expect(screen.getByRole('button', {name: 'Post to Discord'})).toBeDisabled()
        expect(startDiscordAuth).toHaveBeenCalledTimes(1)
        finish()
        await waitFor(() => expect(screen.getByRole('button', {name: 'Post to Discord'})).toBeEnabled())
    })

    it('restores a same-user draft after OAuth', async () => {
        saveDiscordBeltRequestDraft({uid: 'firebase-user', form: requestForm,
            lockCount: 1, questCount: 0})
        storeDiscordPostingGrant('grant', 'firebase-user')
        renderForm()

        await waitFor(() => expect(form.restore).toHaveBeenCalledWith(requestForm))
        expect(screen.getByText(/Discord is authorized. Your request is ready/)).toBeInTheDocument()
    })

    it('posts the saved request once after a successful OAuth callback', async () => {
        saveDiscordBeltRequestDraft({uid: 'firebase-user', form: requestForm,
            lockCount: 1, questCount: 0})
        storeDiscordPostingGrant('grant', 'firebase-user')
        const postDiscordBeltRequest = vi.fn(async () => ({
            messageUrl: 'https://discord.com/channels/1/2/3'
        }))
        renderForm({postDiscordBeltRequest, initialEntries: [{pathname: '/beltRequests',
            state: {discordAutoPost: true}}]})

        await waitFor(() => expect(screen.getByText('Request sent to Discord')).toBeInTheDocument())
        expect(form.restore).toHaveBeenCalledWith(requestForm)
        expect(postDiscordBeltRequest).toHaveBeenCalledTimes(1)
        expect(postDiscordBeltRequest).toHaveBeenCalledWith({
            postingGrant: 'grant', request: expect.objectContaining({requestBelt: 'White Belt'})
        })
        expect(readDiscordBeltRequestDraft('firebase-user')).toBeNull()
        expect(startDiscordAuth).not.toHaveBeenCalled()
    })

    it('does not post after a canceled callback', async () => {
        saveDiscordBeltRequestDraft({uid: 'firebase-user', form: requestForm,
            lockCount: 1, questCount: 0})
        const postDiscordBeltRequest = vi.fn()
        renderForm({postDiscordBeltRequest, initialEntries: [{pathname: '/beltRequests',
            state: {discordAuthError: 'Discord authorization was canceled.'}}]})

        await waitFor(() => expect(form.restore).toHaveBeenCalledWith(requestForm))
        expect(postDiscordBeltRequest).not.toHaveBeenCalled()
        expect(readDiscordBeltRequestDraft('firebase-user')).not.toBeNull()
    })

    it('does not post if the callback returns without a same-user draft', async () => {
        storeDiscordPostingGrant('grant', 'firebase-user')
        const postDiscordBeltRequest = vi.fn()
        renderForm({postDiscordBeltRequest, initialEntries: [{pathname: '/beltRequests',
            state: {discordAutoPost: true}}]})

        await waitFor(() => expect(enqueueSnackbar).toHaveBeenCalledWith(
            'Your Discord request could not be resumed. Review your draft and try again.',
            {variant: 'warning'}))
        expect(postDiscordBeltRequest).not.toHaveBeenCalled()
    })

    it('shows a callback error beside the restored draft', async () => {
        saveDiscordBeltRequestDraft({uid: 'firebase-user', form: requestForm,
            lockCount: 1, questCount: 0})
        renderForm({initialEntries: [{pathname: '/beltRequests',
            state: {discordAuthError: 'Discord authorization was canceled.'}}]})

        await waitFor(() => expect(form.restore).toHaveBeenCalledWith(requestForm))
        expect(screen.getByText('Discord authorization was canceled.')).toBeInTheDocument()
    })

    it('sends once with the one-use grant and shows a delivery link', async () => {
        storeDiscordPostingGrant('grant', 'firebase-user')
        const postDiscordBeltRequest = vi.fn(async () => ({
            messageUrl: 'https://discord.com/channels/1/2/3'
        }))
        renderForm({postDiscordBeltRequest})
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post to Discord'}))

        await waitFor(() => expect(screen.getByText('Request sent to Discord')).toBeInTheDocument())
        expect(postDiscordBeltRequest).toHaveBeenCalledWith({
            postingGrant: 'grant',
            request: {requestBelt: 'White Belt', entries: [{lockId: 'lock-1',
                lockName: 'Test Lock', belt: 'White', link: 'https://example.com/evidence'}], quests: []}
        })
        expect(startDiscordAuth).not.toHaveBeenCalled()
    })

    it('prevents a repeat send while the API is pending', async () => {
        storeDiscordPostingGrant('grant', 'firebase-user')
        let finish
        const postDiscordBeltRequest = vi.fn(() => new Promise(resolve => { finish = resolve }))
        renderForm({postDiscordBeltRequest})
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post to Discord'}))
        expect(screen.getByRole('button', {name: 'Post to Discord'})).toBeDisabled()
        expect(postDiscordBeltRequest).toHaveBeenCalledTimes(1)
        finish({messageUrl: 'https://discord.com/channels/1/2/3'})
        await waitFor(() => expect(screen.getByText('Request sent to Discord')).toBeInTheDocument())
    })

    it('explains an uncertain send and keeps the copy fallback available', async () => {
        storeDiscordPostingGrant('grant', 'firebase-user')
        const postDiscordBeltRequest = vi.fn().mockRejectedValue(Object.assign(
            new Error('Timed out'), {code: 'discord_send_uncertain'}))
        renderForm({postDiscordBeltRequest})
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post to Discord'}))

        await waitFor(() => expect(enqueueSnackbar).toHaveBeenCalledWith(
            'Delivery could not be confirmed. Check the Discord channel before trying again.',
            {variant: 'warning'}))
        expect(screen.getByRole('button', {name: 'Copy Request'})).toBeEnabled()
        expect(readDiscordBeltRequestDraft('firebase-user')).not.toBeNull()
    })

    it('asks for fresh authorization after a rejected grant', async () => {
        storeDiscordPostingGrant('grant', 'firebase-user')
        const postDiscordBeltRequest = vi.fn().mockRejectedValue(Object.assign(
            new Error('Grant expired'), {code: 'discord_grant_expired'}))
        renderForm({postDiscordBeltRequest})
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post to Discord'}))

        await waitFor(() => expect(enqueueSnackbar).toHaveBeenCalledWith(
            'Discord authorization expired or was used. Click Post to Discord to authorize again.',
            {variant: 'warning'}))
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post to Discord'}))
        expect(startDiscordAuth).toHaveBeenCalledTimes(1)
        expect(postDiscordBeltRequest).toHaveBeenCalledTimes(1)
    })

    it('explains a disabled API posting target and preserves the draft', async () => {
        storeDiscordPostingGrant('grant', 'firebase-user')
        const postDiscordBeltRequest = vi.fn().mockRejectedValue(Object.assign(
            new Error('Discord posting is unavailable'), {code: 'belt_request_posting_disabled', status: 503}))
        renderForm({postDiscordBeltRequest})
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post to Discord'}))

        await waitFor(() => expect(enqueueSnackbar).toHaveBeenCalledWith(
            'Discord posting is disabled on the API server. Your draft is saved; try again after the test webhook is configured.',
            {variant: 'warning'}))
        expect(readDiscordBeltRequestDraft('firebase-user')).not.toBeNull()
    })

    it('keeps Copy Request available without posting', async () => {
        const postDiscordBeltRequest = vi.fn()
        renderForm({postDiscordBeltRequest})
        await userEvent.setup().click(screen.getByRole('button', {name: 'Copy Request'}))
        expect(form.submit).toHaveBeenCalledTimes(1)
        expect(postDiscordBeltRequest).not.toHaveBeenCalled()
    })

    it('does not authorize or post for a signed-out user', async () => {
        const postDiscordBeltRequest = vi.fn()
        renderForm({user: null, postDiscordBeltRequest})
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post to Discord'}))
        expect(startDiscordAuth).not.toHaveBeenCalled()
        expect(postDiscordBeltRequest).not.toHaveBeenCalled()
        expect(enqueueSnackbar).toHaveBeenCalledWith('Sign in to post a belt request to Discord.',
            {variant: 'warning'})
    })
})
