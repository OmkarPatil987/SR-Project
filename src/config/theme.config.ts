import { ThemeOptions } from '@mui/material'

const themeConfig = (): ThemeOptions => {
    const mode = 'light'
    const config = {
        typography: {
            htmlFontSize: 16,
            fontFamily: 'Roboto, Helvetica, Arial, sans-serif',
            fontSize: 14,
            fontWeightLight: 300,
            fontWeightRegular: 400,
            fontWeightMedium: 500,
            fontWeightBold: 700,
            h1: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.4 },
            h2: { fontSize: '1.60rem', fontWeight: 600, lineHeight: 1.4 },
            h3: { fontSize: '1.45rem', fontWeight: 600, lineHeight: 1.4 },
            h4: { fontSize: '1.30rem', fontWeight: 600, lineHeight: 1.4 },
            h5: { fontSize: '1.15rem', fontWeight: 600, lineHeight: 1.4 },
            h6: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.4 },
            subtitle1: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.4 },
            subtitle2: { fontSize: '0.875rem', fontWeight: 600, lineHeight: 1.4 },
            body1: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.43 },
            body2: { fontSize: '0.875rem', fontWeight: 500, lineHeight: 1.4 },
            button: { fontSize: '0.875rem', fontWeight: 500, textTransform: 'uppercase' },
            caption: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4 },
            overline: { fontSize: '0.75rem', fontWeight: 500, textTransform: 'uppercase', lineHeight: 1.1 },
            inherit: { fontSize: 'inherit', fontWeight: 'inherit', textTransform: 'inherit' }
        },
        shape: { borderRadius: 5 },
        zIndex: { mobileStepper: 1000, fab: 1050, speedDial: 1050, appBar: 1100, drawer: 1200, modal: 1300, snackbar: 1400, tooltip: 1500 },
        overrides: {
            MuiCssBaseline: {
                '@global': {
                    'a': {
                        color: '#1976d2',
                        textDecoration: 'none',
                        '&:hover': {
                            textDecoration: 'underline',
                        },
                    },
                },
            },
        },
        components: {
            MuiLink: {
                styleOverrides: {
                    root: {
                        textDecoration: 'none',
                        color: '#1976d2',
                        '&:hover': { textDecoration: 'underline' },
                        '&:visited': { color: '#1976d2' }
                    }
                }
            },
            MuiButton: {
                styleOverrides: {
                    root: {
                        textTransform: 'none',
                        fontWeight: 500
                    },
                    startIcon: {
                        marginRight: '3px',
                    },
                    endIcon: {
                        marginLeft: '3px',
                    }
                },
                variants: [
                    {
                        props: { size: 'small' },
                        //style: { fontSize: '0.8rem', lineHeight: 1.1, padding: '4px 15px' }
                    },
                    {
                        props: { size: 'medium' },
                        style: { fontSize: '0.8rem', lineHeight: 1.75, padding: '5px 20px' }
                    },
                    {
                        props: { size: 'large' },
                        //style: { fontSize: '1.063rem', lineHeight: 1.44, padding: '10px 15px' }
                    }
                ],
            },
            MuiDialogActions: {
                styleOverrides: {
                    root: {
                        backgroundColor: '#f2f2f2',
                        padding: '8px 24px'
                    }
                }
            },
            MuiTextField: {
                styleOverrides: {
                    root: {
                        '& .MuiInputBase-root': { padding: 0 },
                        '& .MuiInputBase-input': { fontSize: '13px', padding: '9px 12px' },
                        '& .MuiSelect-select': { fontSize: '13px', padding: '9px 12px' }
                    },
                }
            },
            MuiSelect: {
                styleOverrides: {
                    root: {
                        '& .MuiSelect-select': { fontSize: '13px', padding: '7px 12px' }
                    },
                }
            },
            MuiFormHelperText: {
                styleOverrides: {
                    root: {
                        fontSize: '0.7rem',
                        fontWeight: 400
                    }
                }
            }
        }
    }

    const palette: any = {
        light: {
            palette: {
                mode: 'light',
                common: { black: '#221f20', white: '#ffffff' },
                primary: { main: '#1976d2', light: '#42a5f5', dark: '#1565c0', disabled: '#1f897f', contrastText: '#ffffff' },
                secondary: { main: '#9c27b0', light: '#ba68c8', light2: '#d1c4e9', dark: '#7b1fa2', disabled: '#ba80c4', contrastText: '#ffffff' },
                error: { main: '#d32f2f', light: '#ef5350', light2: '#f8d7da', dark: '#c62828', disabled: '#f77066', contrastText: '#ffffff' },
                warning: { main: '#ed6c02', light: '#ff9800', light2: '#ffeeba', dark: '#e65100', disabled: '#e8bd59', contrastText: '#ffffff' },
                info: { main: '#0288d1', light: '#03a9f4', light2: '#bee5eb', dark: '#01579b', disabled: '#94d0eb', contrastText: '#ffffff' },
                custom: { main: '#00796b', light: '#48a999', dark: '#004d40', disabled: '#80cbc4', contrastText: '#ffffff' },
                success: { main: '#2e7d32', light: '#4caf50', light2: '#c3e6cb', dark: '#1b5e20', disabled: '#a8cb7f', contrastText: '#ffffff' },
                grey: { 50: '#fafafa', 100: '#f5f5f5', 200: '#eeeeee', 300: '#e0e0e0', 400: '#bdbdbd', 500: '#9e9e9e', 600: '#757575', 700: '#616161', 800: '#424242', 900: '#212121', A100: '#f5f5f5', A200: '#eeeeee', A400: '#bdbdbd', A700: '#616161' },
                contrastThreshold: 3,
                tonalOffset: 0.2,
                text: { primary: 'rgba(0, 0, 0, 0.75)', secondary: 'rgba(0, 0, 0, 0.6)', warning: '#ed6c02', error: '#d32f2f', disabled: 'rgba(0, 0, 0, 0.38)' },
                divider: 'rgba(0, 0, 0, 0.12)',
                background: { paper: '#ffffff', default: '#ffffff' },
                action: { active: 'rgba(0, 0, 0, 0.54)', hover: 'rgba(0, 0, 0, 0.04)', hoverOpacity: 0.04, selected: 'rgba(0, 0, 0, 0.08)', selectedOpacity: 0.08, disabled: 'rgba(0, 0, 0, 0.26)', disabledBackground: 'rgba(0, 0, 0, 0.12)', disabledOpacity: 0.38, focus: 'rgba(0, 0, 0, 0.12)', focusOpacity: 0.12, activatedOpacity: 0.12 }
            },
            shadows: [
                'none',
                '3px 0px 3px 1px rgba(0,0,0,0.07)', // top
                '3px -3px 3px 1px rgba(0,0,0,0.07)', // right
                '3px 0px 3px 1px rgba(0,0,0,0.07)', // bottom
                '3px 0px 3px 1px rgba(0,0,0,0.07)', // left
                '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)',
                '0px 3px 1px -2px rgba(0,0,0,0.2),0px 2px 2px 0px rgba(0,0,0,0.14),0px 1px 5px 0px rgba(0,0,0,0.12)',
                '0px 3px 3px -2px rgba(0,0,0,0.2),0px 3px 4px 0px rgba(0,0,0,0.14),0px 1px 8px 0px rgba(0,0,0,0.12)',
                '0px 2px 4px -1px rgba(0,0,0,0.4),0px 4px 5px 0px rgba(0,0,0,0.14),0px 1px 10px 0px rgba(0,0,0,0.12)',
                '0px 3px 5px -1px rgba(0,0,0,0.2),0px 5px 8px 0px rgba(0,0,0,0.14),0px 1px 14px 0px rgba(0,0,0,0.12)',
                '0px 3px 5px -1px rgba(0,0,0,0.2),0px 6px 10px 0px rgba(0,0,0,0.14),0px 1px 18px 0px rgba(0,0,0,0.12)',
                '0px 4px 5px -2px rgba(0,0,0,0.2),0px 7px 10px 1px rgba(0,0,0,0.14),0px 2px 16px 1px rgba(0,0,0,0.12)',
                '0px 5px 5px -3px rgba(0,0,0,0.2),0px 8px 10px 1px rgba(0,0,0,0.14),0px 3px 14px 2px rgba(0,0,0,0.12)',
                '0px 5px 6px -3px rgba(0,0,0,0.2),0px 9px 12px 1px rgba(0,0,0,0.14),0px 3px 16px 2px rgba(0,0,0,0.12)',
                '0px 6px 6px -3px rgba(0,0,0,0.2),0px 10px 14px 1px rgba(0,0,0,0.14),0px 4px 18px 3px rgba(0,0,0,0.12)',
                '0px 6px 7px -4px rgba(0,0,0,0.2),0px 11px 15px 1px rgba(0,0,0,0.14),0px 4px 20px 3px rgba(0,0,0,0.12)',
                '0px 7px 8px -4px rgba(0,0,0,0.2),0px 12px 17px 2px rgba(0,0,0,0.14),0px 5px 22px 4px rgba(0,0,0,0.12)',
                '0px 7px 8px -4px rgba(0,0,0,0.2),0px 13px 19px 2px rgba(0,0,0,0.14),0px 5px 24px 4px rgba(0,0,0,0.12)',
                '0px 7px 9px -4px rgba(0,0,0,0.2),0px 14px 21px 2px rgba(0,0,0,0.14),0px 5px 26px 4px rgba(0,0,0,0.12)',
                '0px 8px 9px -5px rgba(0,0,0,0.2),0px 15px 22px 2px rgba(0,0,0,0.14),0px 6px 28px 5px rgba(0,0,0,0.12)',
                '0px 8px 10px -5px rgba(0,0,0,0.2),0px 16px 24px 2px rgba(0,0,0,0.14),0px 6px 30px 5px rgba(0,0,0,0.12)',
                '0px 8px 11px -5px rgba(0,0,0,0.2),0px 17px 26px 2px rgba(0,0,0,0.14),0px 6px 32px 5px rgba(0,0,0,0.12)',
                '0px 9px 11px -5px rgba(0,0,0,0.2),0px 18px 28px 2px rgba(0,0,0,0.14),0px 7px 34px 6px rgba(0,0,0,0.12)',
                '0px 9px 12px -6px rgba(0,0,0,0.2),0px 19px 29px 2px rgba(0,0,0,0.14),0px 7px 36px 6px rgba(0,0,0,0.12)',
                '0px 10px 13px -6px rgba(0,0,0,0.2),0px 20px 31px 3px rgba(0,0,0,0.14),0px 8px 38px 7px rgba(0,0,0,0.12)',
                '0px 10px 13px -6px rgba(0,0,0,0.2),0px 21px 33px 3px rgba(0,0,0,0.14),0px 8px 40px 7px rgba(0,0,0,0.12)',
                '0px 10px 14px -6px rgba(0,0,0,0.2),0px 22px 35px 3px rgba(0,0,0,0.14),0px 8px 42px 7px rgba(0,0,0,0.12)',
                '0px 11px 14px -7px rgba(0,0,0,0.2),0px 23px 36px 3px rgba(0,0,0,0.14),0px 9px 44px 8px rgba(0,0,0,0.12)',
                '0px 11px 15px -7px rgba(0,0,0,0.2),0px 24px 38px 3px rgba(0,0,0,0.14),0px 9px 46px 8px rgba(0,0,0,0.12)'
            ],
        }
    }

    return { ...palette[mode], ...config }
}

export default themeConfig