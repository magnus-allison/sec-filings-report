import type { NextPage, GetStaticProps } from 'next'
import cheerio from 'cheerio'
import axios from 'axios'
import Table from '../components/Table';
import { Layout, Menu, Breadcrumb } from 'antd';

interface Manager {
    index: number;
    name: string;
    value: string;
    stockNumber: string;
    stockTickers: string[];
}

export const getStaticProps: GetStaticProps = async (context) => {

    const { data } = await axios.get('https://www.dataroma.com/m/allact.php');
    const $ = cheerio.load(data);

    const managersData: Manager[] = [];

    $('#grid > tbody > tr').each((rowIdx, row) => {

        const managerName: string = $(row).find('td').eq(0).text();
        const managerValue: string = $(row).find('td').eq(1).text();
        const managerStockNumber: string = $(row).find('td').eq(2).text();
        const managerStockTickers: string[] = [];

        $(row).find('.sym').each((colIdx, cell) => {
            managerStockTickers.push($(cell).find('a').text());
        });

        managersData.push({
            index: rowIdx,
            name: managerName,
            value: managerValue,
            stockNumber: managerStockNumber,
            stockTickers: managerStockTickers
        });

    });

    const lastScraped = new Date().toISOString();

    return {
        props: { managersData, lastScraped },
        revalidate: 10,
    }
}

interface Props {
    managersData: Manager[];
}

const Home: NextPage<Props> = ({managersData}) => {

    const { Header, Content, Footer } = Layout;

    return (
        <Layout className="layout">
            <Header>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>
                <Menu.Item>Activity</Menu.Item>
            </Menu>
            </Header>
            <Content style={{ padding: '50px 50px' }}>
                <Table data={managersData}/>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Thinkalike.io ©2022</Footer>
        </Layout>
    )
}

export default Home;
