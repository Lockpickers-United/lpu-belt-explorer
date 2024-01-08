export const beltColors =
    ['#d5d5d5', '#d8d801', '#ed7d01', '#389700',
        '#0090de', '#634b9f', '#9d5918',
        '#ba0303', '#1a1a1a', '#373737']

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
