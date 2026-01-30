import { INVITATION_STATUS_LABELS } from '../../constants/invitation';
import clsx from 'clsx';

const statusClassMap = {
    active: 'status-active',
    used: 'status-used',
    expired: 'status-expired',
    revoked: 'status-revoked',
};

export default function StatusBadge({ status }) {
    const label = INVITATION_STATUS_LABELS[status] ?? status;
    const className = statusClassMap[status?.toLowerCase()] ?? 'status-default';

    return <span className={clsx('status-badge', className)}>{label}</span>;
}
