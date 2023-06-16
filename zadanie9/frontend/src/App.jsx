import './App.css'
import {useEffect, useState} from "react";
import axios from "axios";

function App() {
    const [openMessage, setOpenMessage] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [showInput, setShowInput] = useState(true);
    const [response, setResponse] = useState('');
    const [showButtons, setShowButtons] = useState(false);
    const [showFinalMessage, setShowFinalMessage] = useState(false);

    useEffect(() => {
        axios.get('http://localhost:8081/opening')
            .then((response) => {
                const data = response.data;
                setOpenMessage(data.message);
            })
            .catch((error) => {
                console.error('Błąd pobierania wiadomości początkowej:', error);
            });
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        axios.post('http://localhost:8081/gpt', inputValue)
            .then((response) => {
                setResponse(response.data);
                setInputValue('');
                setShowInput(false);
                setShowButtons(true);
            })
            .catch((error) => {
                console.error('Błąd wysyłania żądania:', error);
            });
    };

    const handleEnd = async () => {
        axios.get('http://localhost:8081/closing')
            .then((response) => {
                const data = response.data;
                setOpenMessage(data.message);
                setShowFinalMessage(true);
                setShowButtons(false);
            })
            .catch((error) => {
                console.error('Błąd pobierania wiadomości końcowej:', error);
            });
    };

    const handleContinue = () => {
        setShowInput(true);
        setShowButtons(false);
        setShowFinalMessage(false);
    };

    return (
        <div>
            {openMessage && <p>{openMessage}</p>}
            {showInput && (
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        required
                    />
                    <br/>
                    <button type="submit">Wyślij</button>
                </form>
            )}
            {response && (
                <div>
                    <p>{response}</p>
                    {showButtons && (
                        <div>
                            <button onClick={handleContinue}>Kontynuuj</button>
                            <button onClick={handleEnd}>Koniec</button>
                        </div>
                    )}
                </div>
            )}
            {showFinalMessage && <p>{openMessage}</p>}
        </div>
    )
}

export default App
