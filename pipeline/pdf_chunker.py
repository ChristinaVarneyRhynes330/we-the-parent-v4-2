import os
import json
from langchain.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

def chunk_pdf(input_dir='docs', output_file='chunked_dataset.json'):
    all_chunks = []
    splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
    for fname in os.listdir(input_dir):
        if fname.endswith('.pdf'):
            loader = PyPDFLoader(os.path.join(input_dir, fname))
            docs = loader.load()
            for d in docs:
                chunks = splitter.split_text(d.page_content)
                for i, c in enumerate(chunks):
                    all_chunks.append({'source': fname, 'page': d.metadata['page'], 'chunk': c})
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(all_chunks, f, ensure_ascii=False, indent=2)

if __name__ == '__main__':
    os.makedirs('docs', exist_ok=True)
    # Put your legal documents (e.g., Chapter 39 statutes) in the `docs` folder.
    chunk_pdf()
    print('✅ Chunks written to chunked_dataset.json')