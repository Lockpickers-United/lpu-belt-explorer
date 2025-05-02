
export const beltColors = ['#eeeeee', '#dcdc1f', '#e16936', '#34732f',
    '#3e71bd', '#9f21e5', '#9d6837',
    '#c52323', '#2c2c2c', '#525252']

export const beltColorsNewer = ['#e1e1e1', '#d3d31c', '#dc6532', '#34732f',
        '#3e71bd', '#9f21e5', '#ab713d',
        '#c52323', '#2c2c2c', '#525252']

export const beltColorsOrig = ['#d5d5d5', '#d8d801', '#ed7d01', '#389700',
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
                fontSize: '0.83rem',
                fontWeight: 600
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
