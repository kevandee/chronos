import { Container } from '@mui/material'
import { ThemeProvider, createTheme } from '@mui/material/styles';

import SideBarMenu from './components/SideBarMenu/index';
import TasksCalendar from './components/TasksCalendar';

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
        <Container maxWidth='xl'sx={{ display: 'grid', gridTemplateColumns: '1fr 4fr 2fr', gap: '20px' }}>
          <SideBarMenu />
          <TasksCalendar />
        </Container>
      </main>
    </ThemeProvider>
  );
}

export default App;
