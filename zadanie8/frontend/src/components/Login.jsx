import {useState} from "react";
import Cookies from 'js-cookie';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleLogin = () => {
        fetch('http://localhost:3000/users/login', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({email, password}),
        })
            .then((response) => response.json().then((data) => ({status: response.status, body: data})))
            .then((result) => {
                if (result.status === 200) {
                    setMessage('')
                    Cookies.set('token', result.body.token)
                    window.location.reload();
                } else {
                    setMessage(result.body.message)
                }
            })
            .catch((error) => {
                console.error('Błąd logowania:', error);
            });
    };

    return (
        <div>
            <h1>Logowanie</h1>
            <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={handleEmailChange}
            />
            <br/>
            <input
                type="password"
                placeholder="Hasło"
                value={password}
                onChange={handlePasswordChange}
            />
            <br/>
            <button onClick={handleLogin}>Zaloguj</button>

            {message !== '' && <p>{message}</p>}

            <br/>
            <hr/>
            <br/>
            <form action="http://localhost:3000/users/login/google" method="GET">
                <button type="submit">Logowanie przez Google</button>
            </form>
            <br/>
            <form action="http://localhost:3000/users/login/github" method="GET">
                <button type="submit">Logowanie przez GitHub</button>
            </form>
        </div>
    );
}

export default Login