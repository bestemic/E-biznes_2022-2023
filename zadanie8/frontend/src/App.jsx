import './App.css'
import Login from "./components/Login.jsx";
import Register from "./components/Register.jsx";

function App() {

    if (sessionStorage.getItem('token')) {
        return (
            <div>
                <h1>Jesteś zalogowany</h1>
                <button onClick={() => {
                    sessionStorage.removeItem('token')
                    window.location.reload();
                }}>Wyloguj
                </button>
            </div>
        );
    }

    return (
        <>
            {!sessionStorage.getItem('token') && <Register/>}
            {!sessionStorage.getItem('token') && <Login/>}
            {sessionStorage.getItem('token') &&
                <div>
                    <h1>Jesteś zalogowany</h1>
                    <button onClick={() => {
                        sessionStorage.removeItem('token')
                        window.location.reload();
                    }}>Wyloguj
                    </button>
                </div>
            }
        </>
    )
}

export default App
