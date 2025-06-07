import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/layout/Layout';
import Routes from './routes';
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './app/store';

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <Layout>
          <Toaster position="top-center" />
          <Routes />
        </Layout>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
