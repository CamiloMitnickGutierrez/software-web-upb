import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'

import { AppRoutes } from './router/AppRouter'


export const App = () => {
  return (
    <>
    <CssBaseline />
    <GlobalStyles styles={{
      'html, body, #root': {
        width: '100%',
        minHeight: '100%',
        margin: 0,
      },
      body: {
        overflow: 'hidden',
      },
    }} />
    <AppRoutes/>
    </>
  )
}
