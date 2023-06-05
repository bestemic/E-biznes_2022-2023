import {useState} from "react";

const Register = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [message, setMessage] = useState('');
    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleNameChange = (e) => {
        setName(e.target.value);
    };
    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleRegister = () => {
        fetch('http://localhost:3000/users/register', {
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({name, email, password}),
        })
            .then((response) => response.json().then((data) => ({status: response.status, body: data})))
            .then((result) => {
                if (result.status === 200) {
                    setMessage('Udało się załorzyć konto')
                } else {
                    setMessage(result.body.message)
                }
            })
            .catch((error) => {
                console.error('Błąd rejestracji:', error);
            });
    };

    return (
        <div>
            <h1>Rejestracja</h1>
            <input
                type="text"
                placeholder="Nazwa"
                value={name}
                onChange={handleNameChange}
            />
            <br/>
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
            <button onClick={handleRegister}>Zarejestruj</button>

            {message !== '' && <p>{message}</p>}
        </div>
    );
}

export default Register