// -Path: 'ui\src\pages\workspace\editor\Editor.tsx'
import './editor.css';
import { EDITOR_JS_TOOLS } from './tool';
import { memo, useLayoutEffect, useRef } from 'react';
import EditorJS, { OutputData } from '@editorjs/editorjs';
import { useThemeStore } from '../../../stores/themeStore';

function EditorComponent({
    data,
    editorId,
    onChange,
}: {
    data: OutputData;
    editorId: string;
    onChange: (data: OutputData) => void;
}) {
    const { theme } = useThemeStore();
    const ref = useRef<EditorJS | null>(null);

    useLayoutEffect(() => {
        // ✅ ตรวจสอบว่า element มีอยู่จริง
        const holderElement = document.getElementById(editorId);
        if (!holderElement) {
            console.error(`Element with id "${editorId}" not found`);
            return;
        }

        if (!ref.current) {
            const edior = new EditorJS({
                data,
                holder: editorId,
                tools: EDITOR_JS_TOOLS,
                i18n: { messages: {} },
                async onChange(api, _event) {
                    const data = await api.saver.save();
                    onChange(data);
                },
            });
            ref.current = edior;
        }
        return () => {
            if (ref.current && ref.current.destroy) {
                ref.current.destroy();
                ref.current = null;
            }
        };
    }, []);

    return (
        <div
            className={`editor-container ${theme} flex flex-col h-full w-full`}
        >
            <div id={editorId} className="h-full overflow-y-auto" />
        </div>
    );
}

export default memo(EditorComponent);
