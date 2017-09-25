import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import store from './store'

ReactDOM.render(<App store={store} />, document.getElementById('root'));
registerServiceWorker();

window.onbeforeunload = () => window.confirm('Do you really want to exit? Code will be lost if not shared.');