import {useState} from "react";

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
                    sessionStorage.setItem('token', result.body.token);
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
        </div>
    );
}

export default Login