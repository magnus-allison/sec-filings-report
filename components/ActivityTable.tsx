
import { Table, Tag, Badge, Menu, Dropdown, Space, Popover, Button } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import Overview from './Overview';

const menu = (
  <Menu>
    <Menu.Item>Action 1</Menu.Item>
    <Menu.Item>Action 2</Menu.Item>
  </Menu>
);

const NestedTable = ({ data }: any) => {

    const expandedRowRender = () => {

        // const columns = [
//       { title: 'Date', dataIndex: 'date', key: 'date' },
//       { title: 'Name', dataIndex: 'name', key: 'name' },
//       {
//         title: 'Status',
//         key: 'state',
//         render: () => (
//           <span>
//             <Badge status="success" />
//             Finished
//           </span>
//         ),
//       },
//       { title: 'Upgrade Status', dataIndex: 'upgradeNum', key: 'upgradeNum' },
//       {
//         title: 'Action',
//         dataIndex: 'operation',
//         key: 'operation',
//         render: () => (
//           <Space size="middle">
//             <a>Pause</a>
//             <a>Stop</a>
//             <Dropdown overlay={menu}>
//               <a>
//                 More <DownOutlined />
//               </a>
//             </Dropdown>
//           </Space>
//         ),
//       },
//     ];

//     const data = [];
//     for (let i = 0; i < 3; ++i) {
//       data.push({
//         key: i,
//         date: '2014-12-24 23:12:00',
//         name: 'This is production name',
//         upgradeNum: 'Upgraded: 56',
//       });
//     }
        // return <Table columns={columns} dataSource={data} pagination={false} />;
    };

  const columns = [
    { title: 'Portfolio Manager - Firm', dataIndex: 'name', key: 'name' },
    { title: 'Period', dataIndex: 'period', key: 'period' },
    { title: 'Largest Holdings', dataIndex: 'stockTickers', render: (stockTickers: any[]) => (
        <span>
            {stockTickers.map((ticker: any) => (
                <Popover
                    key={ticker}
                    placement="bottom"
                    title={ticker.name}
                    content={<Overview ticker={ticker.ticker}/>}
                    arrowPointAtCenter
                    overlayStyle={{
                        width: "400px",
                        height: "350px"
                    }}
                >
                    <Tag color={(ticker.percentage[0] === 'A' ? 'geekblue' : 'red')}>
                        {ticker.ticker.toUpperCase()}
                    </Tag>
                </Popover>
            ))}
        </span>
    )},
  ];



    return (
        <Table
        className="components-table-demo-nested"
        columns={columns}

        dataSource={data}
        />
    );
}

export default NestedTable;