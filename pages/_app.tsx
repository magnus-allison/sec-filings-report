import type { AppProps } from 'next/app';
import 'antd/dist/antd.variable.min.css';
import { ConfigProvider } from 'antd';

ConfigProvider.config({
    theme: {
        primaryColor: '#10143B',
    },
});

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Component {...pageProps} />
        </>
    )
}

export default App
