import ActivityItem from '../../components/ActivityItem';

export default function Activities() {
    return (
        <div className='min-h-screen flex flex-col items-center'>
            <h1 className='mt-10 text-5xl text-primary-pink'>All Activities</h1>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10'>
                {Array(3)
                    .fill(0)
                    .map((_, index) => (
                        <ActivityItem key={index} />
                    ))}
            </div>
        </div>
    );
}
