import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './application/auth/AuthContext';
import { AppRouter } from './presentation/router/AppRouter';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
