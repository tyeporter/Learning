import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import './theme.css';
import './styles.css';
import App from './App';

const rootElement = document.getElementById('root');
const root = ReactDOM.createRoot(rootElement);

root.render(
    <App />
);
// root.render(
//     <React.StrictMode>
//         <App />
//     </React.StrictMode>
// );
