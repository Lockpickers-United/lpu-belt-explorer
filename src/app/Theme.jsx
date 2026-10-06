import {createTheme} from '@mui/material/styles'

export const darkTheme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#000000',
            light: '#2c2c2c',
            dark: '#000000',
            contrastText: '#ffffff'
        },
        secondary: {
            main: '#18aa18',
            light: '#23d523',
            dark: '#117e11',
            contrastText: '#000000'
        },
        greens: ['#00ff00',
            '#00ee00',
            '#00dd00',
            '#00cc00',
            '#00bb00',
            '#00aa00',
            '#009e00',
            '#008d00',
            '#007800',
            '#006600',
            '#005a00',
            '#004a00',
            '#003f00']
    },
    components: {
        MuiLink: {
            styleOverrides: {
                root: {
                    color: '#ddd',
                    textDecoration: 'none',
                    cursor: 'pointer',
                    '&:hover': {
                        color: '#fff',
                    },
                },
            },
        },
    },
})
