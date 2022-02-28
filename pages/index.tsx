import type { NextPage, GetStaticProps } from 'next'
import cheerio from 'cheerio'
import axios from 'axios'
import SuperTable from '../components/SuperTable';
import ActivityTable from '../components/ActivityTable';
import { Layout, Menu, Breadcrumb } from 'antd';
import { Tabs } from 'antd';

interface Manager {
    index: number;
    name: string;
    value: string;
    stockNumber: string;
    stockTickers: any[];
}
interface Activity {
    index: number;
    name: string;
    period: string;
    stockTickers: any[];
}


const fetchManagersData = async () => {

    const { data } = await axios.get('https://www.dataroma.com/m/managers.php');
    const $ = cheerio.load(data);

    const managersData: Manager[] = [];

    // @ts-ignore
    $('#grid > tbody > tr').each((rowIdx, row) => {

        const managerName: string = $(row).find('td').eq(0).text();
        const managerValue: string = $(row).find('td').eq(1).text();
        const managerStockNumber: string = $(row).find('td').eq(2).text();
        const managerStockTickers: object[] = [];

        $(row).find('.sym').each((colIdx, cell) => {

            let parts = ($(cell).find('div').html()?.split('<br>')) ?? [];

            let stock = {
                ticker: $(cell).find('a').text(),
                name: parts[0],
                percentage: parts[1],
                price: parts[2],
            }

            managerStockTickers.push(stock);
        });

        managersData.push({
            index: rowIdx,
            name: managerName,
            value: managerValue,
            stockNumber: managerStockNumber,
            stockTickers: managerStockTickers
        });
    });

    return managersData;
}

const fetchActivityData = async () => {

    const { data } = await axios.get('https://www.dataroma.com/m/allact.php');
    const $ = cheerio.load(data);

    const activityData: Activity[] = [];

    // @ts-ignore
    $('#grid > tbody > tr').each((rowIdx, row) => {

        const managerName: string = $(row).find('td').eq(0).text();
        const managerPeriod: string = $(row).find('td').eq(1).text();
        const managerStockTickers: object[] = [];

        $(row).find('.sym').each((colIdx, cell) => {

            let parts = ($(cell).find('div').html()?.split('<br>')) ?? [];

            let stock = {
                ticker: $(cell).find('a').text(),
                name: parts[0],
                percentage: parts[1],
                price: parts[2],
            }

            managerStockTickers.push(stock);
        });

        activityData.push({
            index: rowIdx,
            name: managerName,
            period: managerPeriod,
            stockTickers: managerStockTickers
        });
    });

    return activityData;
}

export const getStaticProps: GetStaticProps = async (context) => {

    const managersData = await fetchManagersData();
    const activityData = await fetchActivityData();

    const lastScraped = new Date().toISOString();

    return {
        props: { managersData, activityData, lastScraped },
        revalidate: 10,
    }
}

interface Props {
    managersData: Manager[];
    activityData: Activity[];
}

const Home: NextPage<Props> = ({managersData, activityData}) => {

    const { Header, Content, Footer } = Layout;
    const { TabPane } = Tabs;

    return (
        <Layout className="layout">
            <Header>
            <div className="logo" />
            <Menu theme="dark" mode="horizontal" defaultSelectedKeys={['2']}>

            </Menu>
            </Header>
            <Content style={{ padding: '0px 50px' }}>
                <Tabs defaultActiveKey="1" onChange={() => false}>
                    <TabPane tab="Super Investors" key="1">
                        <SuperTable data={managersData}/>
                    </TabPane>
                    <TabPane tab="Activity" key="2">
                        <ActivityTable data={activityData}/>
                    </TabPane>
                    <TabPane tab="Tab 3" key="3">
                    Content of Tab Pane 3
                    </TabPane>
                </Tabs>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Thinkalike.io ©2022</Footer>
        </Layout>
    )
}

export default Home;
