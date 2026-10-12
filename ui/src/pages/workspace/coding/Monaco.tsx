//-Path: "TeaChoco-Official/projects/dev/src/pages/code/container/coding/components/Monaco.tsx"
// import Config from './Config';
import Render from './Render';
// import Languages from './Languages';
import { editor } from 'monaco-editor';
import { ExtraLibType } from '../data';
import { FileEditor } from '$Src/class/code/editor';
import { useEffect, useMemo, useState } from 'react';
import { ContainersAtom } from '$Temp/code/container';
import EventListener from '$Hook/document/EventListener';
import { FileItem, FolderItem } from '$Src/class/code/file';
import { useFormat } from '@teachoco-official/react-choco-style';

export default function Monaco({
    id,
    file,
    value,
    onChange,
    extraLibs,
}: {
    id: string;
    value?: string;
    file?: FileEditor;
    extraLibs: ExtraLibType[];
    onChange: (value?: string) => void;
}) {
    const saveFile = SaveFile();
    const explorer = useExplorer();
    const { callbackSize } = useFormat();
    const containers = ContainersAtom.get();
    const [editor, setEditor] = useState<editor.IStandaloneCodeEditor>();
    const container = containers.find((container) => container.id === id);
    // Languages({ extraLibs });
    // Config({ file, value });

    const editorHeight = useMemo(() => {
        const havepath = (container?.paths?.length ?? 0) > 0;
        return callbackSize<number, number, string>(10, (value) => {
            return `calc(100% - ${value * 2}px - ${
                havepath ? `${value * 3}px` : '0px'
            } - ${value * 4}px)`;
        });
    }, [container]);

    useEffect(() => {
        const code = fileSystem?.code?.join('\n') ?? '';
        const editValue = editor?.getValue();
        if (
            code &&
            editor &&
            editValue !== code &&
            editValue !== value &&
            value === undefined
        ) {
            editor.setValue(code);
        }
    }, [value]);

    const fileSystem = useMemo(() => {
        const currentFile = container?.paths[container.file] ?? [];
        let fileSystem: (FolderItem | FileItem)[] = [];

        for (const name of currentFile) {
            explorer.systems?.forEach((file) => {
                if (file.name === name) {
                    fileSystem = file.src;
                }
            });
            if (fileSystem) {
                const newFileSystem = getFileSystem(fileSystem, name);
                if (Array.isArray(newFileSystem)) {
                    fileSystem = [...newFileSystem];
                } else if (newFileSystem !== undefined) {
                    const value = container?.value[container.file];
                    let fileSystems: FileItem = { ...newFileSystem };
                    if (typeof value === 'string') {
                        fileSystems.code = value.split('\n');
                    }
                    return fileSystems;
                }
            }
        }
        return undefined;
    }, [container, explorer.systems]);

    useEffect(() => {
        const code = container?.value[container.file];
        if (code !== value && value !== undefined) {
            // setCode({ id, value: value });
        } else if (value === undefined) {
            // setCode({ id, value: null });
        }
    }, [value]);

    EventListener(
        'keydown',
        (event) => {
            if (event.key === 's' && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                if (typeof container?.value[container.file] === 'string') {
                    const code =
                        container.value[container.file]?.split('\n') ?? null;
                    saveFile({ code, path: container.paths[container.file] });
                    // setCode({ id, save: true });
                }
            }
        },
        false,
        [container],
    );

    return (
        <Render
            file={file}
            value={value}
            onChange={onChange}
            fileSystem={fileSystem}
            editorHeight={editorHeight}
            onMount={(editor) => setEditor(editor)}
        />
    );
}
