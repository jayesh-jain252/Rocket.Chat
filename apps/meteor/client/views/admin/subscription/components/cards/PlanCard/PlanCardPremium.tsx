import { Box, Icon, Skeleton } from '@rocket.chat/fuselage';
import type { ILicenseV3 } from '@rocket.chat/license';
import { ExternalLink } from '@rocket.chat/ui-client';
import type { ReactElement } from 'react';
import React from 'react';
import { Trans, useTranslation } from 'react-i18next';

import { useFormatDate } from '../../../../../../hooks/useFormatDate';
import { useIsSelfHosted } from '../../../../../../hooks/useIsSelfHosted';
import { CONTACT_SALES_LINK } from '../../../utils/links';
import PlanCardBase from './PlanCardBase';

type LicenseLimits = {
	activeUsers: { max: number; value?: number };
	monthlyActiveContacts: { max: number; value?: number };
};

type PlanCardProps = {
	licenseInformation: ILicenseV3['information'];
	licenseLimits: LicenseLimits;
};

const PlanCardPremium = ({ licenseInformation, licenseLimits }: PlanCardProps): ReactElement => {
	const { t } = useTranslation();
	const { isSelfHosted, isLoading } = useIsSelfHosted();
	const formatDate = useFormatDate();

	const planName = licenseInformation.tags?.[0]?.name ?? '';

	const isAutoRenew = licenseInformation.autoRenew;
	const { visualExpiration } = licenseInformation;

	return (
		<PlanCardBase name={planName}>
			{licenseLimits?.activeUsers.max === Infinity ||
				(licenseLimits?.monthlyActiveContacts.max === Infinity && (
					<Box fontScale='p2' display='flex' mb={4} alignItems='center'>
						<Icon name='lightning' size={24} mie={12} />
						{licenseLimits?.activeUsers.max === Infinity &&
							licenseLimits?.monthlyActiveContacts.max === Infinity &&
							t('Unlimited_seats_MACs')}
						{licenseLimits?.activeUsers.max === Infinity && licenseLimits?.monthlyActiveContacts.max !== Infinity && t('Unlimited_seats')}
						{licenseLimits?.activeUsers.max !== Infinity && licenseLimits?.monthlyActiveContacts.max === Infinity && t('Unlimited_MACs')}
					</Box>
				))}
			<Box fontScale='p2' display='flex' mb={4} alignItems='center'>
				<Icon name='calendar' size={24} mie={12} />
				<Box is='span'>
					{isAutoRenew ? (
						t('Renews_DATE', { date: formatDate(visualExpiration) })
					) : (
						<Trans i18nKey='Contact_sales_renew_date'>
							<ExternalLink to={CONTACT_SALES_LINK}>Contact sales</ExternalLink> to check plan renew date.
						</Trans>
					)}
				</Box>
			</Box>
			{!isLoading ? (
				<Box fontScale='p2' display='flex' mb={4} alignItems='center'>
					<Icon name='cloud-plus' size={24} mie={12} /> {isSelfHosted ? t('Self_managed_hosting') : t('Cloud_hosting')}
				</Box>
			) : (
				<Skeleton />
			)}
		</PlanCardBase>
	);
};

export default PlanCardPremium;
