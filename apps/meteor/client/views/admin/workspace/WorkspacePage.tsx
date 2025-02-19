import type { IWorkspaceInfo, IStats } from '@rocket.chat/core-typings';
import { Box, Button, ButtonGroup, Callout, Grid } from '@rocket.chat/fuselage';
import type { IInstance } from '@rocket.chat/rest-typings';
import { useTranslation } from '@rocket.chat/ui-contexts';
import React, { memo } from 'react';

import Page from '../../../components/Page';
import { useIsEnterprise } from '../../../hooks/useIsEnterprise';
import DeploymentCard from './DeploymentCard/DeploymentCard';
import MessagesRoomsCard from './MessagesRoomsCard/MessagesRoomsCard';
import UsersUploadsCard from './UsersUploadsCard/UsersUploadsCard';
import VersionCard from './VersionCard/VersionCard';

type WorkspaceStatusPageProps = {
	canViewStatistics: boolean;
	serverInfo: IWorkspaceInfo;
	statistics: IStats;
	instances: IInstance[];
	onClickRefreshButton: () => void;
	onClickDownloadInfo: () => void;
};

const WorkspacePage = ({
	canViewStatistics,
	serverInfo,
	statistics,
	instances,
	onClickRefreshButton,
	onClickDownloadInfo,
}: WorkspaceStatusPageProps) => {
	const t = useTranslation();

	const { data } = useIsEnterprise();

	const warningMultipleInstances = !data?.isEnterprise && !statistics?.msEnabled && statistics?.instanceCount > 1;
	const alertOplogForMultipleInstances = warningMultipleInstances && !statistics.oplogEnabled;

	return (
		<Page bg='tint'>
			<Page.Header title={t('Workspace')}>
				{canViewStatistics && (
					<ButtonGroup>
						<Button type='button' onClick={onClickDownloadInfo}>
							{t('Download_Info')}
						</Button>
						<Button type='button' onClick={onClickRefreshButton}>
							{t('Refresh')}
						</Button>
					</ButtonGroup>
				)}
			</Page.Header>

			<Page.ScrollableContentWithShadow p={16}>
				<Box marginBlock='none' marginInline='auto' width='full' color='default'>
					{warningMultipleInstances && (
						<Callout type='warning' title={t('Multiple_monolith_instances_alert')} marginBlockEnd={16}></Callout>
					)}
					{alertOplogForMultipleInstances && (
						<Callout
							type='danger'
							title={t('Error_RocketChat_requires_oplog_tailing_when_running_in_multiple_instances')}
							marginBlockEnd={16}
						>
							<Box withRichContent>
								<p>{t('Error_RocketChat_requires_oplog_tailing_when_running_in_multiple_instances_details')}</p>
								<p>
									<a
										rel='noopener noreferrer'
										target='_blank'
										href={
											'https://rocket.chat/docs/installation/manual-installation/multiple-instances-to-improve-' +
											'performance/#running-multiple-instances-per-host-to-improve-performance'
										}
									>
										{t('Click_here_for_more_info')}
									</a>
								</p>
							</Box>
						</Callout>
					)}

					<Grid m={0}>
						<Grid.Item lg={12} xs={4} p={8}>
							<VersionCard serverInfo={serverInfo} />
						</Grid.Item>
						<Grid.Item lg={4} xs={4} p={8}>
							<DeploymentCard serverInfo={serverInfo} statistics={statistics} instances={instances} />
						</Grid.Item>
						<Grid.Item lg={4} xs={4} p={8}>
							<UsersUploadsCard statistics={statistics} />
						</Grid.Item>
						<Grid.Item lg={4} xs={4} p={8}>
							<MessagesRoomsCard statistics={statistics} />
						</Grid.Item>
					</Grid>
				</Box>
			</Page.ScrollableContentWithShadow>
		</Page>
	);
};

export default memo(WorkspacePage);
