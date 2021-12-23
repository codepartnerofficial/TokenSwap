import React from "react";
import reactDom from "react-dom";
import App from './apnan/App';
import { BrowserRouter } from 'react-router-dom';
import { MoralisProvider } from "react-moralis";
reactDom.render(
<>
<MoralisProvider appId="w406UCeyzHb3MIPsfi9QqMzXdXcskUKB5LW3VGq9" serverUrl="https://ldj2ql65uhog.usemoralis.com:2053/server">
    <BrowserRouter>
        <App />
    </BrowserRouter>
</MoralisProvider>
</>,
document.getElementById('root')
);

