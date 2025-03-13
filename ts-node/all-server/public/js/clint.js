const ws = new WebSocket('ws://localhost:3000');

ws.onopen = () => {
  console.log('Connected to server');
  ws.send('Hello, server!');
};

ws.onmessage = (event) => {
  console.log(`Received: ${event.data}`);
};

ws.onclose = () => {
  console.log('Disconnected from server');
};