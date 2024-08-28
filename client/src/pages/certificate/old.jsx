import {
    Page,
    Text,
    View,
    Document,
    Image,
    StyleSheet,
    PDFDownloadLink
} from '@react-pdf/renderer'

export default function Certificate() {
    return (
        <div className='w-full flex flex-col gap-5 items-center justify-center'>
            <div className='relative w-[400px] h-[300px] md:w-[625px] md:h-[426px] lg:w-[950px] lg:h-[652px] border shadow flex flex-col items-center justify-center'>
                <img
                    src='/certificate.jpeg'
                    className='w-full h-full'
                    alt='Certificate Template'
                />
                <p className='absolute left-1/2 -translate-x-1/2 text-xl md:text-3xl lg:text-4xl text-gray-600 -mt-16 md:-mt-24 lg:-mt-32'>
                    10x Engineer
                </p>
                <p className='absolute left-1/2 -translate-x-1/2 text-xl md:text-3xl lg:text-4xl text-gray-600 mt-14 md:mt-20 lg:mt-32'>
                    Shubham Lal
                </p>
                <p className='absolute bottom-[70px] left-[86px] md:bottom-[100px] md:left-[140px] lg:bottom-[155px] lg:left-[220px] text-[12px] md:text-[16px] lg:text-[20px]'>
                    28/08/2024
                </p>
                <img
                    src='/signature.png'
                    className='absolute bottom-16 right-20 md:bottom-24 md:right-32 lg:bottom-[150px] lg:right-52 w-[75px] md:w-[100px] lg:w-[120px]'
                    alt='Signature'
                />
                <img
                    src='/qr.png'
                    className='absolute bottom-8 right-[33px] md:bottom-12 md:right-14 lg:bottom-[68px] lg:right-20 w-[35px] md:w-[45px] lg:w-[75px]'
                    alt='Verify QR'
                />
            </div>
            <PDFDownloadLink
                document={<CertificatePDF />}
                fileName='certificate.pdf'
            >
                {({ loading }) => (
                    <button
                        disabled={loading}
                        className='w-[100px] h-[40px] bg-[#ff7703] hover:bg-white text-white hover:text-[#ff7703] duration-200 flex items-center justify-center'
                    >
                        {loading ? 'Wait...' : 'Download'}
                    </button>
                )}
            </PDFDownloadLink>
        </div>
    )
}

const CertificatePDF = () => (
    <Document>
        <Page size={[2500, 1704]} style={styles.page}>
            <View style={styles.section}>
                <Image
                    source='/certificate.jpeg'
                    style={styles.certImage}
                />
                <Text style={styles.name}>Shubham Lal</Text>
                <Image source='/signature.png' style={styles.signature} />
                <Image source='/qr.png' style={styles.verify} />
            </View>
        </Page>
    </Document>
)

const styles = StyleSheet.create({
    page: {
        width: 1014,
        height: 700,
        position: 'relative'
    },
    section: {
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    certImage: {
        width: '100%',
        height: '100%',
    },
    name: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: '975px',
        fontSize: '90px',
        color: 'rgb(75 85 99 / 1)',
        textAlign: 'center',
        margin: 'auto'
    },
    signature: {
        position: 'absolute',
        bottom: '400px',
        right: '550px',
        width: '350px'
    },
    verify: {
        position: 'absolute',
        bottom: '175px',
        right: '200px',
        width: '210px',
        height: '210px',
        objectFit: 'contain',
        padding: '16px'
    }
})