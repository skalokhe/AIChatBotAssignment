import React, { useState } from 'react';
import 'react-toastify/dist/ReactToastify.css';
import * as pdfjs from 'pdfjs-dist';
import axios from 'axios'; // Use Axios for API requests
import Airtable from 'airtable';

const pdfjsWorker = await import('pdfjs-dist/build/pdf.worker.mjs');

const KnowledgeBase = ( ) => {
  const [selectedFiles, setSelectedFiles] = useState([]);
  
  const handleFileSelect = (e) => {
    const files = e.target.files;
    setSelectedFiles([...selectedFiles, ...files]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleFileChange(); // Initiate file reading process
  };
  
  const addEmbedding = (text, embedding) => {
    var base = new Airtable({apiKey: 'pat4OmmfqTawdexhb.c4eda82930f0da1bfcb8d9cb36e8ce6656354ec0d1fd695382fef26c002fb575'}).base('appfnTH6WHqdQVTnq');
    base('Likhit Gatagat Embeddings').create([
      {
        "fields": {
          "Text": text,
          "Embedding": embedding
        }
      }
    ], function(err, records) {
      if (err) {
        console.error(err);
        return;
      }
      records.forEach(function (record) {
        console.log(record.getId());
      });
    });
  }

  const handleFileChange = () => {
    selectedFiles.forEach((file) => {
      if (file.type === 'application/pdf') {
        const reader = new FileReader();
        reader.onload = async (event) => {
          const typedArray = new Uint8Array(event.target.result);
          pdfjs.GlobalWorkerOptions.workerSrc = pdfjsWorker;
          const pdf = await pdfjs.getDocument({ data: typedArray }).promise;

          const numPages = pdf.numPages;
          let fullText = '';

          for (let j = 1; j <= numPages; j++) {
            const page = await pdf.getPage(j);
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((s) => s.str).join(' ');
            fullText += pageText + '\n';
          }

          try {
            const response = await axios.post('https://api.openai.com/v1/embeddings', {
              input: fullText,
              model: "text-embedding-ada-002"
            }, {
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer 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', // Replace with your API key
              },
            });
            const generatedEmbeddings = response.data.data[0].embedding;
            addEmbedding(fullText, '[' + generatedEmbeddings.join(', ') + ']');
            console.log('Embeddings:', generatedEmbeddings);
          } catch (error) {
            console.error('Error fetching embeddings:', error);
          }
          console.log(`Text extracted from ${file.name}:`);
          console.log(fullText);
        };

        reader.readAsArrayBuffer(file);
      } else {
        console.error(`File ${file.name} is not a PDF.`);
      }
    });
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="application/pdf" multiple onChange={handleFileSelect} />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default KnowledgeBase;