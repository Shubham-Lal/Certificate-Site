import { useState } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`

const PDFViewer = ({ file }) => {
    const [numPages, setNumPages] = useState()

    function onDocumentLoadSuccess({ numPages }) {
        setNumPages(numPages)
    }

    return (
        <Document
            file={file}
            onLoadSuccess={onDocumentLoadSuccess}
            className='border shadow-md'
        >
            {Array.apply(null, Array(numPages))
                .map((x, i) => i + 1)
                .map((page, i) => {
                    return (
                        <Page
                            key={i}
                            pageNumber={page}
                            renderTextLayer={false}
                            renderAnnotationLayer={false}
                        />
                    )
                })}
        </Document>
    )
}

export default PDFViewer