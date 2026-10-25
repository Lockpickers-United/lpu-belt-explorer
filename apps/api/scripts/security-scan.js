#!/usr/bin/env node
// ESM script to run Yarn's npm audit and produce a summarized report + JSON artifact
import {execFile as _execFile} from 'node:child_process'
import {promisify} from 'node:util'
import {mkdir, writeFile} from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

const execFile = promisify(_execFile)

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const repoRoot = path.resolve(__dirname, '..')
const logsDir = path.resolve(repoRoot, 'logs')

function nowTs() {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  return (
    d.getFullYear() +
    '-' +
    pad(d.getMonth() + 1) +
    '-' +
    pad(d.getDate()) +
    'T' +
    pad(d.getHours()) +
    pad(d.getMinutes()) +
    pad(d.getSeconds())
  )
}

function summarizeAuditJson(jsonLines) {
  // Yarn 4 returns an NDJSON stream with one registry finding per line. Retain
  // support for Yarn 1 output so older raw reports can still be summarized.
  const advisories = []
  let summary = null
  for (const line of jsonLines) {
    if (!line) continue
    try {
      const obj = JSON.parse(line)
      if (obj.type === 'auditAdvisory' && obj.data && obj.data.advisory) {
        const adv = obj.data.advisory
        const res = obj.data.resolution || {}
        advisories.push({
          id: adv.id,
          module_name: adv.module_name,
          severity: adv.severity,
          title: adv.title,
          vulnerable_versions: adv.vulnerable_versions,
          patched_versions: adv.patched_versions,
          recommendation: adv.recommendation,
          cves: adv.cves,
          github_advisory_id: adv.github_advisory_id,
          path: res.path,
        })
      } else if (obj.type === 'auditSummary') {
        summary = obj.data
      } else if (obj.value && obj.children?.Severity) {
        const finding = obj.children
        advisories.push({
          id: finding.ID,
          module_name: obj.value,
          severity: finding.Severity.toLowerCase(),
          title: finding.Issue,
          vulnerable_versions: finding['Vulnerable Versions'],
          tree_versions: finding['Tree Versions'],
          patched_versions: '',
          recommendation: '',
          cves: [],
          github_advisory_id: finding.URL?.match(/GHSA-[\w-]+/)?.[0] ?? '',
          path: Array.isArray(finding.Dependents) ? finding.Dependents.join(', ') : '',
          url: finding.URL
        })
      }
    } catch {
      // ignore non-JSON lines
    }
  }
  // Sort advisories by severity: critical, high, moderate, low, info
  const order = { critical: 0, high: 1, moderate: 2, low: 3, info: 4 }
  advisories.sort((a, b) => (order[a.severity] ?? 9) - (order[b.severity] ?? 9))
  return {advisories, summary}
}

function countBySeverity(advisories) {
  return advisories.reduce((counts, advisory) => {
    counts[advisory.severity] = (counts[advisory.severity] ?? 0) + 1
    return counts
  }, {})
}

function formatCounts(advisories) {
  const counts = countBySeverity(advisories)
  return `critical=${counts.critical ?? 0}, high=${counts.high ?? 0}, moderate=${counts.moderate ?? 0}, low=${counts.low ?? 0}`
}

function tableCell(value) {
  if (Array.isArray(value)) value = value.join(', ')
  return String(value ?? '').replace(/\r?\n/g, ' ').replace(/\|/g, '/')
}

function buildMarkdown(ts, summary, advisories) {
  const lines = []
  lines.push('# Security audit report')
  lines.push('')
  lines.push(`Generated: ${ts}`)
  lines.push('')
  if (summary && summary.vulnerabilities) {
    const v = summary.vulnerabilities
    lines.push(`- Dependencies scanned: ${summary.totalDependencies}`)
    lines.push(`- Vulnerabilities: critical=${v.critical || 0}, high=${v.high || 0}, moderate=${v.moderate || 0}, low=${v.low || 0}`)
  } else {
    lines.push(`- Findings: ${formatCounts(advisories)}`)
  }
  lines.push('')

  if (!advisories || advisories.length === 0) {
    lines.push('No advisories reported.')
    return lines.join('\n')
  }

  const severities = ['critical', 'high', 'moderate', 'low', 'info']
  for (const sev of severities) {
    const list = advisories.filter(a => a.severity === sev)
    if (!list.length) continue
    lines.push(`## ${sev.charAt(0).toUpperCase()}${sev.slice(1)} (${list.length})`)
    lines.push('')
    lines.push('| Module | Title | Installed | Dependency path | Vulnerable | Advisory |')
    lines.push('|---|---|---|---|---|---|')
    for (const a of list) {
      const advisoryLabel = a.github_advisory_id || a.id || 'Details'
      const advisory = a.url ? `[${advisoryLabel}](${a.url})` : advisoryLabel
      lines.push(`| ${tableCell(a.module_name)} | ${tableCell(a.title)} | ${tableCell(a.tree_versions)} | ${tableCell(a.path)} | ${tableCell(a.vulnerable_versions)} | ${advisory} |`)
    }
    lines.push('')
  }

  return lines.join('\n')
}

async function run() {
  await mkdir(logsDir, { recursive: true })
  const ts = nowTs()
  const jsonFile = path.resolve(logsDir, `security-audit-${ts}.jsonl`)
  const mdFile = path.resolve(logsDir, `security-audit-${ts}.md`)

  console.log('Running yarn npm audit --all --recursive --json ...')
  let stdout = ''
  let stderr = ''
  let nonZeroExit = false
  try {
    const res = await execFile('yarn', ['npm', 'audit', '--all', '--recursive', '--json'], {
      cwd: repoRoot,
      maxBuffer: 1024 * 1024 * 20
    })
    stdout = res.stdout || ''
    stderr = res.stderr || ''
  } catch (err) {
    // Yarn returns non-zero when findings exist; the output is still a valid report.
    nonZeroExit = true
    stdout = err?.stdout || ''
    stderr = err?.stderr || ''
    if (err?.code !== null && err?.code !== undefined) {
      console.error(`yarn npm audit exited with code ${err.code}; attempting to summarize results...`)
    }
  }
  if (stderr && stderr.trim()) {
    // Yarn may print progress or warnings to stderr; not necessarily an error
    console.error(stderr)
  }

  // Write raw JSON lines for full detail (even on failure if any stdout exists)
  try {
    await writeFile(jsonFile, stdout ?? '', 'utf8')
    console.log(`\nRaw JSON lines written to: ${jsonFile}`)
  } catch (e) {
    console.error('Failed to write audit output file:', e)
  }

  const lines = (stdout || '').split(/\r?\n/)
  const {advisories, summary} = summarizeAuditJson(lines)

  // Build and write Markdown report
  try {
    const md = buildMarkdown(ts, summary, advisories)
    await writeFile(mdFile, md, 'utf8')
    console.log(`\nMarkdown report written to: ${mdFile}`)
  } catch (e) {
    console.error('Failed to write markdown report:', e)
  }

  console.log('\nSecurity audit summary:')
  if (summary) {
    const v = summary.vulnerabilities || {}
    console.log(`- Dependencies scanned: ${summary.totalDependencies}`)
    console.log(`- Vulnerabilities: critical=${v.critical || 0}, high=${v.high || 0}, moderate=${v.moderate || 0}, low=${v.low || 0}`)
  } else if (advisories.length) {
    console.log(`- Findings: ${formatCounts(advisories)}`)
  } else if (nonZeroExit && !stdout) {
    console.log('- No output received from yarn npm audit')
  } else {
    console.log(`- Findings: ${formatCounts(advisories)}`)
  }

  if (advisories.length) {
    console.log('\nTop findings:')
    for (const adv of advisories.slice(0, 20)) {
      console.log(`• [${adv.severity.toUpperCase()}] ${adv.module_name} — ${adv.title}`)
      if (adv.path) console.log(`  Path: ${adv.path}`)
      if (adv.recommendation) console.log(`  Recommendation: ${adv.recommendation}`)
      if (adv.patched_versions) console.log(`  Patched versions: ${adv.patched_versions}`)
      if (adv.vulnerable_versions) console.log(`  Vulnerable: ${adv.vulnerable_versions}`)
      if (adv.cves && adv.cves.length) console.log(`  CVEs: ${adv.cves.join(', ')}`)
      if (adv.github_advisory_id) console.log(`  GitHub Advisory: ${adv.github_advisory_id}`)
    }
  } else {
    console.log('No advisories reported.')
  }

  console.log('For full details, open that file or run `yarn npm audit --all --recursive` directly.')

  // Exit code policy:
  // - 1 if advisories found (expected when vulnerabilities exist)
  // - 0 if no advisories and command exited cleanly
  // - 2 if audit failed and produced no parseable advisories
  const hasIssues = advisories.length > 0
  if (hasIssues) process.exit(1)
  if (!nonZeroExit) process.exit(0)
  process.exit(2)
}

run().catch((err) => {
  console.error('security scan failed:', err)
  process.exit(2)
})
