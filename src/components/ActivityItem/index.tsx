export default function ActivityItem() {
    return (
        <div className='border border-gray-300 rounded-lg shadow-sm max-w-80'>
            <img
                src='https://home.cdn.papaya.services/tu_thien_la_gi_5131bbcfa1.jpg'
                className='w-80 rounded-t-lg'
            />

            <div className="px-2">
                <h1 className='text-lg font-semibold mb-1 hover:text-primary-pink text-gray-800 transition-all cursor-pointer'>Activity name</h1>
                <p className='mb-1'>Activity creator</p>
                <p className='mb-1'>Total: 1.xxx.xxx/10.xxx.xxx</p>
                <button className="border-1 border-primary-pink text-primary-pink px-3 py-2 rounded-lg mb-2 cursor-pointer hover:-translate-y-1 transition-all font-semibold">Donate now!</button>
            </div>
        </div>
    );
}
