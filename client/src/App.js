import { Container } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles';

import SideBarMenu from './components/SideBarMenu/index';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3D405B',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <main>
        <Container maxWidth='xl'>
          <SideBarMenu />
        </Container>
      </main>
    </ThemeProvider>
  );
}

export default App;
