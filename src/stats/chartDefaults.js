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
