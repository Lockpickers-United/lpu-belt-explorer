import {describe, expect, it} from 'vitest'
import {summarizeAuditJson} from './security-scan.js'

describe('npm workspace security audit', () => {
  it('summarizes npm findings without counting transitive references twice', () => {
    const report = {
      auditReportVersion: 2,
      vulnerabilities: {
        example: {name: 'example', nodes: ['apps/api/node_modules/example'], via: [
          {source: 123, severity: 'high', title: 'Example advisory', range: '<2', url: 'https://example.com/GHSA-abcd-1234-efgh'}
        ]},
        parent: {name: 'parent', nodes: ['apps/api/node_modules/parent'], via: ['example']}
      },
      metadata: {dependencies: {total: 42}, vulnerabilities: {high: 2, total: 2}}
    }
    const result = summarizeAuditJson(JSON.stringify(report, null, 2))
    expect(result.summary.totalDependencies).toBe(42)
    expect(result.advisories).toHaveLength(1)
    expect(result.advisories[0]).toMatchObject({severity: 'high', path: 'apps/api/node_modules/example'})
  })

  it('accepts a clean npm report', () => {
    expect(summarizeAuditJson(JSON.stringify({auditReportVersion: 2, vulnerabilities: {},
      metadata: {dependencies: {total: 3}, vulnerabilities: {total: 0}}})).advisories).toEqual([])
  })

  it('does not turn failed or malformed audits into clean reports', () => {
    expect(() => summarizeAuditJson('{')).toThrow()
    expect(() => summarizeAuditJson('{}')).toThrow('Unrecognized npm audit report')
    expect(() => summarizeAuditJson(JSON.stringify({error: {summary: 'Registry unavailable'}}))).toThrow('Registry unavailable')
  })
})
