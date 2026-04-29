import { fetchActivityData, fetchManagersData, fetchSPGridData } from '@/api';
import ManagersTable from '@/components/managers/Table';
import ActivityTable from '@/components/activity/Table';
import MostBoughtTable from '@/components/dashboard/MostBoughtTable';
import MomentumRadar from '@/components/dashboard/MomentumRadar';
import StatsOverview from '@/components/dashboard/StatsOverview';
import SPGridTable from '@/components/grid/Table';
import { Tabs } from 'antd';
import { FundViewOutlined, SwapOutlined, FireOutlined, AppstoreOutlined } from '@ant-design/icons';

export default async function Home() {
	const [managersData, activityData, gridData] = await Promise.all([
		fetchManagersData(),
		fetchActivityData(),
		fetchSPGridData()
	]);

	return (
		<>
			<StatsOverview managers={managersData} activities={activityData} />
			<MomentumRadar activities={activityData} />

			<Tabs
				defaultActiveKey='managers'
				size='large'
				className='dashboard-tabs'
				style={{ width: '100%' }}
				items={[
					{
						key: 'managers',
						label: (
							<span>
								<FundViewOutlined style={{ marginRight: 8 }} />
								Portfolio Managers
							</span>
						),
						children: <ManagersTable data={managersData} />
					},
					{
						key: 'activity',
						label: (
							<span>
								<SwapOutlined style={{ marginRight: 8 }} />
								Recent Activity
							</span>
						),
						children: <ActivityTable data={activityData} />
					},
					{
						key: 'most-bought',
						label: (
							<span>
								<FireOutlined style={{ marginRight: 8 }} />
								Most Bought
							</span>
						),
						children: <MostBoughtTable managers={managersData} activities={activityData} />
					},
					{
						key: 'sp-grid',
						label: (
							<span>
								<AppstoreOutlined style={{ marginRight: 8 }} />
								S&P Grid
							</span>
						),
						children: <SPGridTable data={gridData} />
					}
				]}
			/>
		</>
	);
}
