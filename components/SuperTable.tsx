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
    { title: 'Portfolio Manager - Firm', dataIndex: 'name', key: 'name', sorter: (a: any, b: any) => a.name.localeCompare(b.name)},
    { title: 'Portfolio Value', dataIndex: 'value', key: 'value'},
    { title: 'No. of Stocks', dataIndex: 'stockNumber', key: 'stockNumber', sorter: (a: any, b: any) => a.stockNumber - b.stockNumber},
    { title: 'Largest Holdings', dataIndex: 'stockTickers', render: (stockTickers: any[]) => (
        <span>
            {stockTickers.map((ticker: any) => (
                <Popover
                    key={ticker.id}
                    title={ticker.name}
                    content={<Overview ticker={ticker.ticker}/>}
                    overlayStyle={{
                        width: "400px",
                        height: "350px"
                    }}
                >
                    <Tag color={'blue'}>
                        {ticker.ticker.toUpperCase()}
                    </Tag>
                </Popover>
            ))}
        </span>
    )},
    // { title: 'Version', dataIndex: 'version', key: 'version' },
    // { title: 'Upgraded', dataIndex: 'upgradeNum', key: 'upgradeNum' },
    // { title: 'Creator', dataIndex: 'creator', key: 'creator' },
    // { title: 'Date', dataIndex: 'createdAt', key: 'createdAt' },
    // { title: 'Action', key: 'operation', render: () => <a>Publish</a> },
  ];

//   const data = [];
//   for (let i = 0; i < 3; ++i) {
//     data.push({
//       key: i,
//       name: 'Screem',
//       platform: 'iOS',
//       version: '10.3.4.5654',
//       upgradeNum: 500,
//       creator: 'Jack',
//       createdAt: '2014-12-24 23:12:00',
//     });
//   }

    return (
        <Table
        className="components-table-demo-nested"
        columns={columns}
        pagination={{
            position: ['bottomCenter'],
            pageSize: 10,
            hideOnSinglePage: true,
            showSizeChanger: false,
        }}
        // scroll={{ y: 440 }}
        // expandable={{ expandedRowRender }}
        dataSource={data}
        />
    );
}

export default NestedTable;