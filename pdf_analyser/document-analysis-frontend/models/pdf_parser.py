# # import fitz  # PyMuPDF
# # from paddleocr import PaddleOCR

# # class PDFParser:
# #     def __init__(self):
# #         self.ocr = PaddleOCR(use_angle_cls=True, lang='en', use_gpu=False, show_log=False)

# #     def extract_text(self, file_path):
# #         doc = fitz.open(file_path)
# #         text_output = ""
# #         for page in doc:
# #             page_text = page.get_text()
# #             # If the page is mostly an image (scan), run OCR
# #             if len(page_text.strip()) < 50:
# #                 img_list = page.get_images()
# #                 if img_list:
# #                     result = self.ocr.ocr(file_path, cls=True)
# #                     page_text = "\n".join([line[1][0] for line in result[0]])
# #             text_output += page_text + "\n"
# #         return text_output














# import fitz  # PyMuPDF
# from langchain.tools import tool

# class HybridParser:
#     @tool("pdf_extractor")
#     def extract(self, file_path: str):
#         """Extracts text from PDF. Detects if pages are scanned/images automatically."""
#         doc = fitz.open(file_path)
#         full_text = []
#         is_scanned = False

#         for page in doc:
#             text = page.get_text().strip()
#             # If text is too short, it's likely an image/scan
#             if len(text) < 50:
#                 is_scanned = True
#                 # In a real scenario, you'd call PaddleOCR here
#                 text = "[OCR Placeholder: Image detected on page]"
#             full_text.append(text)
        
#         doc.close()
#         return {
#             "content": "\n".join(full_text),
#             "is_scanned": is_scanned,
#             "page_count": len(full_text)
#         }








import fitz  # PyMuPDF
from langchain.tools import tool

@tool("pdf_extractor")
def extract_pdf_logic(file_path: str):
    """Extracts text from PDF. Detects if pages are scanned/images automatically."""
    doc = fitz.open(file_path)
    full_text = []
    is_scanned = False

    for page in doc:
        text = page.get_text().strip()
        # If text is too short, it's likely an image/scan
        if len(text) < 50:
            is_scanned = True
        full_text.append(text)
    
    doc.close()
    return {
        "content": "\n".join(full_text),
        "is_scanned": is_scanned
    }