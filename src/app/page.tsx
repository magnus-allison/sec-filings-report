import { fetchActivityData, fetchManagersData } from '@/api';
import ManagersTable from '@/components/managers/Table';
import ActivityTable from '@/components/activity/Table';
import MostBoughtTable from '@/components/dashboard/MostBoughtTable';
import StatsOverview from '@/components/dashboard/StatsOverview';
import { Tabs, Typography } from 'antd';
import { FundViewOutlined, SwapOutlined, FireOutlined } from '@ant-design/icons';

export default async function Home() {
	const [managersData, activityData] = await Promise.all([fetchManagersData(), fetchActivityData()]);

	return (
		<>
			<StatsOverview managers={managersData} activities={activityData} />

			<Tabs
				defaultActiveKey='managers'
				size='large'
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
					}
				]}
			/>
		</>
	);
}
