import { useState, useEffect } from 'react';
import { Stock } from '@ant-design/plots';


const Overview = ({ticker}: any) => {

    const [data, setData] = useState([]);

    useEffect(() => {
      asyncFetch();
    }, []);

    const asyncFetch = () => {

        const API_KEY = 'Tpk_cb9df7fc8ad34ab29e012269b8da0439';

        fetch(`https://sandbox.iexapis.com/stable/stock/${ticker}/chart?token=${API_KEY}`)
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };
    const config = {
      data,
      xField: 'date',
      yField: ['open', 'close', 'high', 'low'],
    };

    return <Stock {...config} />;

}

export default Overview;

