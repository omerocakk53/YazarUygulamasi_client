import React, { useEffect, useState } from 'react';
import { getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// PDF.js worker dosyasını ayarla
GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/2.11.338/pdf.worker.min.js`;

const PDFViewer = ({ pdfurl }) => {
  const [pages, setPages] = useState([]);
  useEffect(() => {
    const loadPdf = async () => {
      try {
        // PDF dosyasını yükle
        const pdf = await getDocument(pdfurl).promise;
        const numPages = pdf.numPages;
        const pagesArray = [];

        // Her sayfayı işle
        for (let pageNumber = 1; pageNumber <= numPages; pageNumber++) {
          const page = await pdf.getPage(pageNumber);

          // Sayfanın metin içeriğini al
          const content = await page.getTextContent();
          const textItems = content.items.map((item) => item.str).join(' ');

          // Sayfa bilgilerini objeye ekle
          pagesArray.push({
            pageNumber,
            text: textItems,
          });
        }

        // Sayfaları state olarak set et
        setPages(pagesArray);
      } catch (error) {
        console.error('PDF yüklenirken bir hata oluştu', error);
      }
    };

    loadPdf();
  }, [pdfurl]);
};

export default PDFViewer;