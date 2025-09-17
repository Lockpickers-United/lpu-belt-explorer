import React, {useCallback, useMemo, useState} from 'react'

// Helpers
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min

const KEY_PIN_TYPES = ['Round', 'Spool', 'Serrated']
const DRIVER_PIN_TYPES = ['Round', 'Spool', 'Serrated', 'Mushroom']
const SPRING_TYPES = ['short', 'long']

const typeEmoji = (type, row) => {
  switch (type) {
    case 'Round': return '⚪️'
    case 'Spool': return '🧵'
    case 'Serrated': return '🪚'
    case 'Mushroom': return '🍄'
    default: return row === 'spring' ? '🌀' : '•'
  }
}

const springEmoji = (spring) => spring === 'long' ? '🧬' : '🌀'

const numberEmoji = (n) => {
  const map = ['0️⃣','1️⃣','2️⃣','3️⃣','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣']
  return (map[n] || String(n))
}

function generateKeyHeights(columns) {
  // Generate heights 1..9 with adjacent diffs ≤ 7
  const arr = []
  arr[0] = randInt(1, 9)
  for (let i = 1; i < columns; i++) {
    const prev = arr[i - 1]
    const min = Math.max(1, prev - 7)
    const max = Math.min(9, prev + 7)
    arr[i] = randInt(min, max)
  }
  return arr
}

function generateGrid(cfg) {
  const {columns, includeMaster, includeSpring} = cfg
  const colNums = Array.from({length: columns}, (_, i) => i + 1)
  const keyHeights = generateKeyHeights(columns)
  const keyPinTypes = Array.from({length: columns}, () => KEY_PIN_TYPES[randInt(0, KEY_PIN_TYPES.length - 1)])
  const masterHeights = includeMaster ? Array.from({length: columns}, () => randInt(1, 6)) : []
  const driverTypes = Array.from({length: columns}, () => DRIVER_PIN_TYPES[randInt(0, DRIVER_PIN_TYPES.length - 1)])
  const springTypes = includeSpring ? Array.from({length: columns}, () => SPRING_TYPES[randInt(0, SPRING_TYPES.length - 1)]) : []
  return {colNums, keyHeights, keyPinTypes, masterHeights, driverTypes, springTypes}
}

export default function RandomLockGrid() {
  const [columns, setColumns] = useState(5)
  const [includeMaster, setIncludeMaster] = useState(true)
  const [includeSpring, setIncludeSpring] = useState(false)
  const [seed, setSeed] = useState(0)

  const config = {columns, includeMaster, includeSpring}
  const grid = useMemo(() => generateGrid(config), [seed, columns, includeMaster, includeSpring])

  const randomize = useCallback(() => setSeed(s => s + 1), [])

  // Render helpers for emoji + text fallback
  const barForHeight = (h) => '▮'.repeat(Math.max(1, Math.min(9, h)))

  const containerStyle = {maxWidth: 740, margin: '12px auto', padding: 12}
  const controlStyle = {display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap', marginBottom: 16}
  const tableStyle = {width: '100%', borderCollapse: 'collapse'}
  const thtd = {borderBottom: '1px solid #444', padding: '8px 6px', textAlign: 'center'}
  const rowHeaderStyle = {...thtd, textAlign: 'left', width: 200}

  return (
    <div style={containerStyle}>
      <div style={controlStyle}>
        <label>
          Number of Columns:&nbsp;
          <select value={columns} onChange={e => setColumns(Math.max(4, Math.min(7, Number(e.target.value))))}>
            {[4,5,6,7].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
        </label>
        <label>
          <input type='checkbox' checked={includeMaster} onChange={e => setIncludeMaster(e.target.checked)}/>
          &nbsp;Include Master Pin Height
        </label>
        <label>
          <input type='checkbox' checked={includeSpring} onChange={e => setIncludeSpring(e.target.checked)}/>
          &nbsp;Include Spring Type
        </label>
        <button onClick={randomize}>Randomize</button>
      </div>

      <table style={tableStyle}>
        <tbody>
          {/* Column Number */}
          <tr>
            <th style={rowHeaderStyle}>Column Number</th>
            {grid.colNums.map((n, i) => (
              <td key={i} style={thtd}>{numberEmoji(n)}</td>
            ))}
          </tr>

          {/* Key Pin Height */}
          <tr>
            <th style={rowHeaderStyle}>Key Pin Height</th>
            {grid.keyHeights.map((h, i) => (
              <td key={i} style={thtd} title={`H=${h}`}>{h} {barForHeight(h)}</td>
            ))}
          </tr>

          {/* Key Pin Type */}
          <tr>
            <th style={rowHeaderStyle}>Key Pin Type</th>
            {grid.keyPinTypes.map((t, i) => (
              <td key={i} style={thtd} title={t}>{typeEmoji(t)} <span style={{opacity: .7}}>{t}</span></td>
            ))}
          </tr>

          {/* Master Pin Height (optional) */}
          {includeMaster && (
            <tr>
              <th style={rowHeaderStyle}>Master Pin Height</th>
              {grid.masterHeights.map((h, i) => (
                <td key={i} style={thtd} title={`Master H=${h}`}>{h} {barForHeight(h)}</td>
              ))}
            </tr>
          )}

          {/* Driver Pin Type */}
          <tr>
            <th style={rowHeaderStyle}>Driver Pin Type</th>
            {grid.driverTypes.map((t, i) => (
              <td key={i} style={thtd} title={t}>{typeEmoji(t)} <span style={{opacity: .7}}>{t}</span></td>
            ))}
          </tr>

          {/* Spring Type (optional) */}
          {includeSpring && (
            <tr>
              <th style={rowHeaderStyle}>Spring Type</th>
              {grid.springTypes.map((t, i) => (
                <td key={i} style={thtd} title={t}>{springEmoji(t)} <span style={{opacity: .7}}>{t}</span></td>
              ))}
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}
