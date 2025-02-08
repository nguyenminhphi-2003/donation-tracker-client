import Footer from '../../components/Footer';
import Header from '../../components/Header';

function Homepage() {
    return (
        <>
            <Header />

            {/* Content */}
            <div
                className="
                relative bg-[url('https://d13kjxnqnhcmn2.cloudfront.net/AcuCustom/Sitename/DAM/050/Individual_giving_-_Main.png')] bg-cover bg-center h-screen"
            >
                <div className='absolute right-30 top-60 text-center items-center'>
                    <h1 className=' text-primary-pink text-6xl font-bold'>
                        Sharing is caring
                    </h1>

                    <div className='text-white text-2xl italic opacity-70 my-4'>
                        <p>Help us to help others</p>
                        <p>by donating to our causes</p>
                    </div>

                    <a
                        href='#'
                        className='bg-primary-pink text-white px-4 py-2 rounded-lg'
                    >
                        Donate Now
                    </a>
                </div>
            </div>

            <Footer />
        </>
    );
}

export default Homepage;
