// -Path: 'ui\src\pages\workspace\editor\tool.ts'
import Code from '@editorjs/code';
import List from '@editorjs/list';
import Image from '@editorjs/image';
import Quote from '@editorjs/quote';
import Table from '@editorjs/table';
import Header from '@editorjs/header';
import Warning from '@editorjs/warning';
import Delimiter from '@editorjs/delimiter';
import InlineCode from '@editorjs/inline-code';
import { ToolConstructable, ToolSettings } from '@editorjs/editorjs';

// การกำหนดค่าเครื่องมือ (tools) ที่จะใช้ใน Editor.js
export const EDITOR_JS_TOOLS: {
    [toolName: string]: ToolConstructable | ToolSettings;
} = {
    code: Code,
    list: List,
    table: Table,
    quote: Quote,
    header: Header,
    warning: Warning,
    delimiter: Delimiter,
    inlineCode: InlineCode,
    image: {
        class: Image,
        config: {
            //     endpoints: {
            //          byFile: 'http://your-api/uploadImage', // API endpoint
            //          byUrl: 'http://your-api/fetchImage', // API สำหรับดึงรูปจาก URL
            //     },
            // uploader: {
            //     async uploadByFile(file: File) {
            //         const formData = new FormData();
            //         formData.append('file', file);
            //         const response = await fetch(
            //             'http://your-api/uploadImage',
            //             {
            //                 method: 'POST',
            //                 body: formData,
            //             },
            //         );
            //         const data = await response.json();
            //         return {
            //             success: 1,
            //             file: {
            //                 url: data.url, // URL ของรูปภาพที่อัปโหลด
            //             },
            //         };
            //     },
            // },
        },
    },
};
