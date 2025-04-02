/*
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc.js' //eslint-disable-line
import isBetween from 'dayjs/plugin/isBetween.js' //eslint-disable-line
dayjs.extend(utc)
dayjs.extend(isBetween)
const start = dayjs.utc('2025-03-28T00:01:00Z')
const end = dayjs.utc('2025-04-02T07:01:00Z')
*/
const pinkify = false

export const beltColors = pinkify
    ? ['#ffdbe4', '#fcc8d4', '#FFB6C1', '#eaa5a4', '#F88379', '#FF69B4', '#FF66CC', '#FF00AA', '#FF00FF']
    : ['#d5d5d5', '#d8d801', '#ed7d01', '#389700',
        '#0090de', '#634b9f', '#9d5918',
        '#ba0303', '#2c2c2c', '#464646']

export const pieColors =
    ['#1b9e77', '#d95f02', '#7570b3', '#e7298a', '#66a61e', '#e6ab02', '#a6761d', '#444', '#666666', '#888', '#d00', '#f00', '#a00']

export const primaryTheme = {
    text: {
        'fontSize': 11,
        'fill': '#f00',
        'outlineWidth': 0,
        'outlineColor': 'transparent'
    },
    tooltip: {
        container: {
            backgroundColor: '#222',
            color: '#ccc',
            'fontSize': 13
        }
    },
    axis: {
        domain: {
            line: {
                stroke: '#777', // Color for the axis domain _siteStats
                strokeWidth: 1
            }
        },
        ticks: {
            line: {
                stroke: '#666', // Color for the axis ticks
                strokeWidth: 1
            },
            text: {
                fill: '#ccc',
                fontSize: '0.83rem'
            }
        },
        grid: {
            line: {
                stroke: '#444',
                strokeWidth: 1
            }
        },
        legend: {
            text: {
                fill: '#ccc'
            }
        }
    }
}

export const legendTheme = {
    axis: {
        ticks: {
            text: {
                fill: '#999',
                fontSize: '0.83rem'
            }
        }
    }
}

export const pieTheme = {
    tooltip: {
        container: {
            backgroundColor: '#222',
            color: '#ccc',
            'fontSize': 13
        }
    },
    domain: {
        line: {
            stroke: '#777', // Color for the axis domain _siteStats
            strokeWidth: 1
        }
    },
    ticks: {
        line: {
            stroke: '#666', // Color for the axis ticks
            strokeWidth: 1
        },
        text: {
            fill: '#aaa',
            fontSize: '0.83rem'
        }
    },
    grid: {
        line: {
            stroke: '#444',
            strokeWidth: 1
        }
    },
    legend: {
        text: {
            fill: '#ccc' // Color for the legend text
        }
    },
    labels: {
        text: {
            fill: '#ccc',
            fontSize: '0.75rem',
            fontWeight: 700
        }
    }
}
