export const beltColors =
    ['#d5d5d5', '#d8d801', '#ed7d01', '#389700',
        '#0090de', '#634b9f', '#9d5918',
        '#ba0303', '#1a1a1a', '#373737']

export const platformColors = ['#007de2', '#0367ba', '#005ba0', '#004fa4',
    '#063b87', '#062f6b']

export const browserColors = ['#c34100', '#b33600', '#a02d01', '#7d2900',
    '#6a2200', '#621d00', '#581d00']

export const greenColors = ['#009e01', '#008d01', '#007804', '#006604',
    '#005a04', '#004a02', '#003f01']

const mainColor = '#ccc'

export const primaryTheme = {

    text: {
        color: mainColor
    },
    grid: {
        line: {
            strokeWidth: 1,
            stroke: '#555'
        }
    },
    tooltip: {
        container: {
            backgroundColor: '#222',
            color: '#ccc',
            fontSize: 13
        }
    },
    axis: {
        domain: {
            line: {
                stroke: mainColor,
                strokeWidth: 1
            }
        },
        ticks: {
            line: {
                stroke: mainColor,
                strokeWidth: 1
            },
            text: {
                fill: mainColor,
                color: mainColor,
                fontSize: '0.83rem'
            }
        },
        grid: {
            line: {
                stroke: '#ccc',
                strokeWidth: 1
            }
        },
        legend: {
            text: {
                fill: mainColor,
                color: mainColor
            }
        }
    }
}

export const legendTheme = {
    axis: {
        ticks: {
            text: {
                fill: mainColor,
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
