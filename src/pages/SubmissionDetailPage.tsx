import { useParams } from 'react-router-dom';
import { PageShell } from '../components/layout/PageShell';
import { KeystoneActionsView } from '../features/keystone-actions';
import { BackgroundDecorations } from '../components/layout/BackgroundDecorations';

export default function SubmissionDetailPage() {
    const { id } = useParams<{ id: string }>();

    return (
        <PageShell className="relative pb-24 bg-[#FAFBFD] min-h-screen overflow-hidden">
            <BackgroundDecorations />

            <div className="w-full max-w-[1200px] mx-auto pt-10 px-8 relative z-10">
                {id ? <KeystoneActionsView id={id} /> : <div>No ID provided</div>}
            </div>
        </PageShell>
    );
}
