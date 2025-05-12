const { useState, useEffect } = React;

const App = () => {
  const [isAccessGranted, setIsAccessGranted] = useState(false);

  return (
    <div className="crt">
      {isAccessGranted ? (
        <ChatScreen />
      ) : (
        <AccessScreen onAccessGranted={() => setIsAccessGranted(true)} />
      )}
    </div>
  );
};

const AccessScreen = ({ onAccessGranted }) => {
  const [key, setKey] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('Проверка ключа...');
    setTimeout(() => {
      setError('ОШИБКА: Неверный ключ доступа');
      setTimeout(() => {
        setError('Доступ разрешен. Сущность #3 активирована.');
        setTimeout(() => onAccessGranted(), 2000);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center p-8">
        <h1 className="text-4xl text-demon mb-4">ПРОЕКТ ЗЕРКАЛО-1</h1>
        <p className="text-2xl text-demon mb-4">ГРИФ: СОВЕРШЕННО СЕКРЕТНО</p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={key}
            onChange={(e) => setKey(e.target.value)}
            className="bg-black text-user text-2xl p-2 border border-green-500 focus:outline-none"
            placeholder="Введите ключ доступа"
            disabled={isLoading}
          />
          <button
            type="submit"
            className="mt-4 bg-black text-user text-2xl border border-green-500 px-4 py-2"
            disabled={isLoading}
          >
            Подтвердить
          </button>
        </form>
        {error && (
          <p className="text-demon text-2xl mt-4 blink">{error}</p>
        )}
      </div>
    </div>
  );
};

const ChatScreen = () => {
  const [messages, setMessages] = useState([
    { sender: 'demon', text: 'Ты кто? Я вижу тебя... через твое устройство.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = async (message) => {
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await response.json();
      return data.reply;
    } catch (error) {
      return 'Я всё ещё здесь... Попробуй снова.';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setIsTyping(true);

    const demonReply = await sendMessage(input);
    setIsTyping(false);
    setMessages((prev) => [...prev, { sender: 'demon', text: demonReply }]);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-2xl">
        <div className="h-96 overflow-y-auto mb-4">
          {messages.map((msg, index) => (
            <p
              key={index}
              className={`text-2xl mb-2 ${msg.sender === 'user' ? 'text-user' : 'text-demon'}`}
            >
              {msg.sender === 'user' ? '>> ' : '[Сущность #3]: '}{msg.text}
            </p>
          ))}
          {isTyping && (
            <p className="text-demon text-2xl blink">[Сущность #3]: ...печатает...</p>
          )}
        </div>
        <form onSubmit={handleSubmit} className="flex">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-black text-user text-2xl p-2 border border-green-500 focus:outline-none"
            placeholder="Введи сообщение..."
          />
          <button
            type="submit"
            className="bg-black text-user text-2xl border border-green-500 px-4 py-2"
          >
            Отправить
          </button>
        </form>
      </div>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));