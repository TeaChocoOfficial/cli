//-Path: "TeaChoco-Official/projects/dev/src/pages/code/editor/monaco/Config.tsx"
import { useEffect } from 'react';
import { useMonaco } from '@monaco-editor/react';
import { FileEditor } from '$Src/class/code/editor';

export default function Config({
    file,
    value,
}: {
    value?: string;
    file?: FileEditor;
}) {
    const monaco = useMonaco();

    useEffect(() => {
        if (monaco && file) {
            // console.log("here is the monaco instance:", monaco);
            // ตั้งค่า model สำหรับไฟล์ปัจจุบัน
            const existingModel = monaco.editor.getModel(
                monaco.Uri.parse(`file:///${file.path}`),
            );
            if (!existingModel && value !== undefined) {
                monaco.editor.createModel(
                    value,
                    file?.language,
                    monaco.Uri.parse(`file:///${file.path}`),
                );
            }
        }
    }, [monaco, value, file]);
}
