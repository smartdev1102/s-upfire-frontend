import { Box } from '@mui/material';
import Header from './components/common/Header';
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import Footer from './components/common/Footer';
import Farms from './components/Farms';
import Tokens from './components/Tokens';
import Pools from './components/Pools';
import Banner from './components/common/Banner';

function App() {
  return (
    <Box
      sx={{
        bgcolor: 'background.default',
        color: 'text.primary',
        minHeight: '100vh',
      }}
    >
      <BrowserRouter>
        <Box>
          <Header />
        </Box>
        <Box
          sx={{
            mt: '20px'
          }}
        >
          <Banner />
        </Box>
        <Box
          sx={{
            p: '20px'
          }}
        >
          <Routes>
            <Route path='/' element={<Navigate to="/farms" />} />
            <Route path="/farms" element={<Farms />} />
            <Route path="/tokens" element={<Tokens />} />
            <Route path="/pools" element={<Pools />} />
          </Routes>
        </Box>
        <Footer />
      </BrowserRouter>
    </Box>
  );
}

export default App;
