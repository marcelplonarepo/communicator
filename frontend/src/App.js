import { Route, Routes } from 'react-router-dom';
import styles from './App.module.css';
import Login from './pages/login/Login';
import Register from './pages/register/Register';
import Socket from './pages/socket/Socket';
import Main from './pages/main/Main';
function App() {

  return (
    <div className={styles.app}>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Socket />} />
      </Routes>

    </div>
  );
}

export default App;
