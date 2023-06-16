import './App.css'
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";
import Cookies from 'js-cookie';

function App() {

    return (
        <>
            {!Cookies.get('token') && <Register/>}
            {!Cookies.get('token') && <Login/>}
            {Cookies.get('token') &&
                <div>
                    <h1>Jesteś zalogowany</h1>
                    <button onClick={() => {
                        Cookies.remove('token')
                        window.location.reload();
                    }}>Wyloguj
                    </button>
                </div>
            }
        </>
    )
}

export default App
