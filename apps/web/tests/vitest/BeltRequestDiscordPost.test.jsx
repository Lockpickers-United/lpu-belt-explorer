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

function renderForm({user = {uid: 'firebase-user'}, createBeltRequest = vi.fn(),
    startDiscordOAuth = vi.fn(), initialEntries} = {}) {
    return renderWithRouter(
        <ScorecardDataContext.Provider value={{profile: {}, visibleEntries: []}}>
            <BeltRequestForm/>
        </ScorecardDataContext.Provider>,
        {auth: {user}, db: {createBeltRequest}, api: {startDiscordOAuth}, initialEntries}
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
        const createBeltRequest = vi.fn()
        renderForm({createBeltRequest})
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post to Discord'}))

        expect(startDiscordAuth).toHaveBeenCalledWith({
            startDiscordOAuth: expect.any(Function), purpose: 'beltRequest', returnTo: '/beltRequests'
        })
        expect(readDiscordBeltRequestDraft('firebase-user').form).toEqual(requestForm)
        expect(createBeltRequest).not.toHaveBeenCalled()
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
        storeDiscordPostingGrant('grant', 'firebase-user', {discordId: 'discord-user', username: 'picker'})
        renderForm()

        await waitFor(() => expect(form.restore).toHaveBeenCalledWith(requestForm))
        expect(screen.getByText(/Discord is authorized. Your request is ready/)).toBeInTheDocument()
    })

    it('posts the saved request once after a successful OAuth callback', async () => {
        saveDiscordBeltRequestDraft({uid: 'firebase-user', form: requestForm,
            lockCount: 1, questCount: 0})
        storeDiscordPostingGrant('grant', 'firebase-user', {discordId: 'discord-user', username: 'picker'})
        const createBeltRequest = vi.fn(async () => ({
            messageUrl: 'https://discord.com/channels/1/2/3'
        }))
        renderForm({createBeltRequest, initialEntries: [{pathname: '/beltRequests',
            state: {discordAutoPost: true}}]})

        await waitFor(() => expect(screen.getByText('Request added to queue')).toBeInTheDocument())
        expect(form.restore).toHaveBeenCalledWith(requestForm)
        expect(createBeltRequest).toHaveBeenCalledTimes(1)
        expect(createBeltRequest).toHaveBeenCalledWith({
            requestBelt: 'White Belt', platform: 'Discord', username: 'picker', userId: 'discord-user',
            messageContent: expect.stringContaining('Test Lock'), syncTo: null, syncUsername: null
        })
        expect(readDiscordBeltRequestDraft('firebase-user')).toBeNull()
        expect(startDiscordAuth).not.toHaveBeenCalled()
    })

    it('does not post after a canceled callback', async () => {
        saveDiscordBeltRequestDraft({uid: 'firebase-user', form: requestForm,
            lockCount: 1, questCount: 0})
        const createBeltRequest = vi.fn()
        renderForm({createBeltRequest, initialEntries: [{pathname: '/beltRequests',
            state: {discordAuthError: 'Discord authorization was canceled.'}}]})

        await waitFor(() => expect(form.restore).toHaveBeenCalledWith(requestForm))
        expect(createBeltRequest).not.toHaveBeenCalled()
        expect(readDiscordBeltRequestDraft('firebase-user')).not.toBeNull()
    })

    it('does not post if the callback returns without a same-user draft', async () => {
        storeDiscordPostingGrant('grant', 'firebase-user', {discordId: 'discord-user', username: 'picker'})
        const createBeltRequest = vi.fn()
        renderForm({createBeltRequest, initialEntries: [{pathname: '/beltRequests',
            state: {discordAutoPost: true}}]})

        await waitFor(() => expect(enqueueSnackbar).toHaveBeenCalledWith(
            'Your Discord request could not be resumed. Review your draft and try again.',
            {variant: 'warning'}))
        expect(createBeltRequest).not.toHaveBeenCalled()
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
        storeDiscordPostingGrant('grant', 'firebase-user', {discordId: 'discord-user', username: 'picker'})
        const createBeltRequest = vi.fn(async () => ({
            messageUrl: 'https://discord.com/channels/1/2/3'
        }))
        renderForm({createBeltRequest})
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post to Discord'}))

        await waitFor(() => expect(screen.getByText('Request added to queue')).toBeInTheDocument())
        expect(createBeltRequest).toHaveBeenCalledWith({
            requestBelt: 'White Belt', platform: 'Discord', username: 'picker', userId: 'discord-user',
            messageContent: expect.stringContaining('https://example.com/evidence'),
            syncTo: null, syncUsername: null
        })
        expect(startDiscordAuth).not.toHaveBeenCalled()
    })

    it('prevents a repeat send while Firestore is pending', async () => {
        storeDiscordPostingGrant('grant', 'firebase-user', {discordId: 'discord-user', username: 'picker'})
        let finish
        const createBeltRequest = vi.fn(() => new Promise(resolve => { finish = resolve }))
        renderForm({createBeltRequest})
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post to Discord'}))
        expect(screen.getByRole('button', {name: 'Post to Discord'})).toBeDisabled()
        expect(createBeltRequest).toHaveBeenCalledTimes(1)
        finish({messageUrl: 'https://discord.com/channels/1/2/3'})
        await waitFor(() => expect(screen.getByText('Request added to queue')).toBeInTheDocument())
    })

    it('reports a failed write and keeps the copy fallback available', async () => {
        storeDiscordPostingGrant('grant', 'firebase-user', {discordId: 'discord-user', username: 'picker'})
        const createBeltRequest = vi.fn().mockRejectedValue(Object.assign(
            new Error('Timed out'), {code: 'discord_send_uncertain'}))
        renderForm({createBeltRequest})
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post to Discord'}))

        await waitFor(() => expect(enqueueSnackbar).toHaveBeenCalledWith(
            'Could not save your belt request: Timed out',
            {variant: 'error'}))
        expect(screen.getByRole('button', {name: 'Copy Request'})).toBeEnabled()
        expect(readDiscordBeltRequestDraft('firebase-user')).not.toBeNull()
    })

    it('asks for fresh authorization before retrying a failed write', async () => {
        storeDiscordPostingGrant('grant', 'firebase-user', {discordId: 'discord-user', username: 'picker'})
        const createBeltRequest = vi.fn().mockRejectedValue(Object.assign(
            new Error('Grant expired'), {code: 'discord_grant_expired'}))
        renderForm({createBeltRequest})
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post to Discord'}))

        await waitFor(() => expect(enqueueSnackbar).toHaveBeenCalledWith(
            'Could not save your belt request: Grant expired',
            {variant: 'error'}))
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post to Discord'}))
        expect(startDiscordAuth).toHaveBeenCalledTimes(1)
        expect(createBeltRequest).toHaveBeenCalledTimes(1)
    })

    it('preserves the draft when saving fails', async () => {
        storeDiscordPostingGrant('grant', 'firebase-user', {discordId: 'discord-user', username: 'picker'})
        const createBeltRequest = vi.fn().mockRejectedValue(Object.assign(
            new Error('Discord posting is unavailable'), {code: 'belt_request_posting_disabled', status: 503}))
        renderForm({createBeltRequest})
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post to Discord'}))

        await waitFor(() => expect(enqueueSnackbar).toHaveBeenCalledWith(
            'Could not save your belt request: Discord posting is unavailable',
            {variant: 'error'}))
        expect(readDiscordBeltRequestDraft('firebase-user')).not.toBeNull()
    })

    it('keeps Copy Request available without posting', async () => {
        const createBeltRequest = vi.fn()
        renderForm({createBeltRequest})
        await userEvent.setup().click(screen.getByRole('button', {name: 'Copy Request'}))
        expect(form.submit).toHaveBeenCalledTimes(1)
        expect(createBeltRequest).not.toHaveBeenCalled()
    })

    it('does not authorize or post for a signed-out user', async () => {
        const createBeltRequest = vi.fn()
        renderForm({user: null, createBeltRequest})
        await userEvent.setup().click(screen.getByRole('button', {name: 'Post to Discord'}))
        expect(startDiscordAuth).not.toHaveBeenCalled()
        expect(createBeltRequest).not.toHaveBeenCalled()
        expect(enqueueSnackbar).toHaveBeenCalledWith('Sign in to post a belt request to Discord.',
            {variant: 'warning'})
    })
})
