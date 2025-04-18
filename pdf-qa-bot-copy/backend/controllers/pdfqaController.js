import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { getVectorStore, getWeaviateClient } from '../config/weaviateDB.js';
import fs from 'fs';
import pdfParse from 'pdf-parse/lib/pdf-parse.js'; 

export const uploadPDF = async (req, res) => {
  try {
    // Check if file is present
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: ' No file uploaded. Please attach a PDF file.',
      });
    }
    
    const filePath = req.file.path;
    console.log("File path:", filePath);
    const buffer = fs.readFileSync(filePath);

    // Extract entire PDF text
    const data = await pdfParse(buffer);

    // Split PDF into pages manually
    const pages = data.text.split('\n\n'); // rough page split — can vary
    const totalPages = pages.length;
    console.log(`Total pages extracted: ${totalPages}`);

    // Parse and provide default values
    const startPage = req.body.startPage ? parseInt(req.body.startPage, 10) : 1;
    const endPage = req.body.endPage ? parseInt(req.body.endPage, 10) : totalPages;

    // Validation
    if (isNaN(startPage) || isNaN(endPage)) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ success: false, message: 'Page numbers must be valid integers.' });
    }

    if (startPage < 1 || endPage < startPage) {
      fs.unlinkSync(filePath);
      return res.status(400).json({ success: false, message: 'Invalid page range.' });
    }

    if (endPage > totalPages) {
      fs.unlinkSync(filePath);
      return res.status(400).json({
        success: false,
        message: `PDF only has ${totalPages} pages. You requested up to page ${endPage}.`,
      });
    }


    const startIndex = startPage - 1
    // Slice desired pages (e.g., page 1 to 5)
    const selectedPagesText = pages.slice(startIndex, endPage).join('\n\n');
    // console.log(`Selected pages text: ${selectedPagesText}`);

    // Create pseudo-document
    const docs = [{ pageContent: selectedPagesText, metadata: { source: filePath, pageRange: `${startPage}-${endPage}` } }];
    // console.log(docs);
    // Chunking
    const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 1000, chunkOverlap: 200 });
    const chunks = await splitter.splitDocuments(docs);
    // console.log(chunks);

    // Store
    await getVectorStore().addDocuments(chunks);

    fs.unlinkSync(filePath);
    res.json({ success: true, message: `✅ Pages ${startPage}-${endPage} processed and stored successfully.`, });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};


export const deletePDF = async (req, res) => {
  try {
    const { source } = req.body;

    if (!source) {
      return res.status(400).json({ success: false, message: 'Missing "source" in request body.' });
    }

    const client = getWeaviateClient();

    // Perform GraphQL delete mutation
    const deleteQuery = `
      mutation {
        deleteObjects(where: {
          path: ["source"],
          operator: Equal,
          valueString: "${source}"
        }) {
          results {
            successful
            matches
          }
        }
      }
    `;

    const deleteResult = await client.graphql.raw(deleteQuery);

    // 🔍 Verification: Run a follow-up query to check if anything still exists
    const checkQuery = `
      {
        Get {
          PdfQa(where: {
            path: ["source"],
            operator: Equal,
            valueString: "${source}"
          }) {
            source
            text
            _additional {
              id
            }
          }
        }
      }
    `;

    const checkResult = await client.graphql.raw(checkQuery);
    const remaining = checkResult.data?.Get?.PdfQa || [];

    const deleted = remaining.length === 0;

    res.json({
      success: deleted,
      message: deleted
        ? `✅ Data with source "${source}" was deleted from Weaviate.`
        : `⚠️ Delete mutation ran, but data still exists with source "${source}".`,
      deleteResult,
      remainingRecords: remaining,
    });

  } catch (error) {
    console.error('❌ Error deleting from Weaviate:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};






