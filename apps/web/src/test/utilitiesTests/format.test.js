import { describe, it, expect } from 'vitest'
import { formatLock } from '../../util/format'

describe('formatLock', () => {
  it('formats title and id', () => {
    expect(formatLock({ id: 7, title: 'Abloy' })).toBe('Abloy (#7)')
  })
})
