import { useState, useEffect } from 'react';
import { Stock } from '@ant-design/plots';
import { Spin } from 'antd';

const Overview = ({ticker}: any) => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);

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
            })
            .finally(() => {
                setLoading(false);
            })
    };

    const config: any = {
        data,
        meta: false,
        autoFit: true,
        xField: 'date',
        yField: ['open', 'close', 'high', 'low'],
    };

    //@ts-ignore
    return (
        <>
            {loading ? (
                <div style={{textAlign: 'center'}}>
                    <Spin />
                </div>
            ) : <Stock {...config} />}
        </>
    )

}

export default Overview;

