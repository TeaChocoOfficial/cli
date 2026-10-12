//-Path: "TeaChoco-Official/projects/dev/src/components/hook/EditorCode/EditorCode.tsx"
import { Text } from '../Text';
import { useEffect } from 'react';
import { editor } from 'monaco-editor';
import {
    CSize,
    useTheme,
    createStyled,
    ChocoStyledProps,
} from '@teachoco-official/react-choco-style';
import { useLocation } from 'react-router-dom';
import MonacoEditor, { Monaco, useMonaco } from '@monaco-editor/react';

const CMonacoEditor = createStyled(MonacoEditor)();

export type OnEditorCodeMount = (
    editor: editor.IStandaloneCodeEditor,
    monaco: Monaco,
) => void;

export type OnEditorCodeChange = (
    value: string | undefined,
    ev: editor.IModelContentChangedEvent,
) => void;

export type EditorCodeProps = ChocoStyledProps<
    typeof MonacoEditor,
    {
        size?: number;
        path?: string;
        line?: number;
        value?: string;
        language?: string;
        defaultValue?: string;
        saveViewState?: boolean;
        defaultLanguage?: string;
        keepCurrentModel?: boolean;
        onMount?: OnEditorCodeMount;
        onChange?: OnEditorCodeChange;
    }
>;

export default function EditorCode({
    size = 16,
    onMount,
    ...props
}: EditorCodeProps) {
    const monaco = useMonaco();
    const location = useLocation();
    const { palette } = useTheme();

    const render = () => {
        if (monaco) {
            monaco.languages.typescript.javascriptDefaults.setEagerModelSync(
                true,
            );
            monaco.editor.defineTheme('teachoco-theme', {
                base: 'vs-dark',
                inherit: true,
                rules: [
                    {
                        token: 'string',
                        foreground: palette.common.orange[5].hex(),
                    },
                    {
                        token: 'number',
                        foreground: palette.main.success[3].hex(),
                    },
                    {
                        token: 'keyword',
                        fontStyle: 'italic',
                        foreground: palette.common.purple[5].hex(),
                    },
                    {
                        token: 'comment',
                        fontStyle: 'italic',
                        foreground: palette.main.success[7].hex(),
                    },
                    {
                        token: 'type',
                        foreground: palette.main.info[3].hex(),
                    },
                ],

                colors: {
                    'editor.background': '#00000000',
                    'editorLineNumber.foreground':
                        palette.text.disabled[5].hex(),
                    'editorLineNumber.activeForeground':
                        palette.text.primary[5].hex(),
                    'editor.foreground': palette.text.primary[5].hex(),
                    'editorCursor.foreground': palette.main.info[5].hex(),
                    'editor.selectionBackground': palette.main.info[5]
                        .alpha(0.5)
                        .hex(),
                    'editor.lineHighlightBackground': palette.main.inherit[5]
                        .alpha(0.3)
                        .hex(),
                    'editor.inactiveSelectionBackground': palette.main.info[5]
                        .alpha(0.2)
                        .hex(),
                },
            });
            // ตั้งค่าธีม
            monaco.editor.setTheme('teachoco-theme');
        }
    };

    useEffect(() => {
        render();
    }, [monaco, palette, location]);

    return (
        <CSize size={size}>
            {(size: number) => (
                <CMonacoEditor
                    {...props}
                    saveViewState
                    theme="teachoco-theme"
                    loading={<Text clr="info" text="code.coding.loading" />}
                    onValidate={(markers) => {
                        console.log(markers);
                    }}
                    onMount={(editor, monaco) => {
                        console.log('on mount');
                        onMount?.(editor, monaco);
                        // ตั้งค่า quick suggestions
                        editor.updateOptions({
                            quickSuggestions: {
                                other: true,
                                strings: true,
                                comments: true,
                            },
                            suggestOnTriggerCharacters: true,
                            acceptSuggestionOnCommitCharacter: true,
                            wordBasedSuggestions: 'allDocuments',
                            parameterHints: {
                                enabled: true,
                            },
                            codeLens: true,
                            // lightbulb: {
                            //     enabled: true,
                            // },
                            formatOnPaste: true,
                            formatOnType: true,
                        });
                        render();
                    }}
                    options={{
                        fontSize: size,
                        lineHeight: (size * 20) / 16,
                        lineNumbers: 'on',
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        minimap: { enabled: false },
                        padding: { top: 8, bottom: 8 },
                        roundedSelection: false,
                        readOnly: false,
                        wordWrap: 'on',
                        tabSize: 4,
                        insertSpaces: true,
                        autoIndent: 'full',
                        formatOnType: true,
                        formatOnPaste: true,
                        snippetSuggestions: 'top',
                        suggest: {
                            localityBonus: true,
                            showIcons: true,
                            filterGraceful: true,
                            showMethods: true,
                            showFunctions: true,
                            showConstructors: true,
                            showFields: true,
                            showVariables: true,
                            showClasses: true,
                            showStructs: true,
                            showInterfaces: true,
                            showModules: true,
                            showProperties: true,
                            showEvents: true,
                            showOperators: true,
                            showUnits: true,
                            showValues: true,
                            showConstants: true,
                            showEnums: true,
                            showEnumMembers: true,
                            showKeywords: true,
                            showWords: true,
                            showColors: true,
                            showFiles: true,
                            showReferences: true,
                            showFolders: true,
                            showTypeParameters: true,
                            showSnippets: true,
                        },
                    }}
                />
            )}
        </CSize>
    );
}

// สร้าง themes สำหรับ React code
export const reactThemes: Record<string, editor.IStandaloneThemeData> = {
    // Theme สไตล์ GitHub
    'github-theme': {
        base: 'vs',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '#D73A49', fontStyle: 'bold' },
            { token: 'string', foreground: '#032F62' },
            { token: 'number', foreground: '#005CC5' },
            { token: 'comment', foreground: '#6A737D', fontStyle: 'italic' },
            { token: 'type', foreground: '#6F42C1' },
            { token: 'interface', foreground: '#6F42C1' },
            { token: 'typeParameter', foreground: '#6F42C1' },
            { token: 'function', foreground: '#6F42C1' },
            { token: 'variable', foreground: '#E36209' },
            { token: 'variable.readonly', foreground: '#005CC5' },
        ],
        colors: {
            'editor.background': '#FFFFFF',
            'editor.foreground': '#24292E',
            'editor.lineHighlightBackground': '#F1F8FF',
            'editorCursor.foreground': '#24292E',
            'editor.selectionBackground': '#C8E1FF',
            'editorLineNumber.foreground': '#6A737D',
            'editorLineNumber.activeForeground': '#24292E',
            'editor.inactiveSelectionBackground': '#E4E4E4',
        },
    },
    // Theme สไตล์ React Documentation
    'react-docs-theme': {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '#C792EA', fontStyle: 'bold' },
            { token: 'string', foreground: '#C3E88D' },
            { token: 'number', foreground: '#F78C6C' },
            { token: 'comment', foreground: '#546E7A', fontStyle: 'italic' },
            { token: 'type', foreground: '#82AAFF' },
            { token: 'interface', foreground: '#82AAFF' },
            { token: 'typeParameter', foreground: '#82AAFF' },
            { token: 'function', foreground: '#82AAFF' },
            { token: 'variable', foreground: '#FFCB6B' },
            { token: 'variable.readonly', foreground: '#82AAFF' },
            // JSX specific
            { token: 'tag', foreground: '#F07178' },
            { token: 'tag.id', foreground: '#F07178' },
            { token: 'attribute.name', foreground: '#FFCB6B' },
            { token: 'attribute.value', foreground: '#C3E88D' },
        ],
        colors: {
            'editor.background': '#282C34',
            'editor.foreground': '#ABB2BF',
            'editor.lineHighlightBackground': '#2C313A',
            'editorCursor.foreground': '#528BFF',
            'editor.selectionBackground': '#3E4451',
            'editorLineNumber.foreground': '#495162',
            'editorLineNumber.activeForeground': '#ABB2BF',
            'editor.inactiveSelectionBackground': '#3E4451',
        },
    },
    // Theme สไตล์ Night Owl
    'night-owl-theme': {
        base: 'vs-dark',
        inherit: true,
        rules: [
            { token: 'keyword', foreground: '#c792ea', fontStyle: 'italic' },
            { token: 'string', foreground: '#ecc48d' },
            { token: 'number', foreground: '#f78c6c' },
            { token: 'comment', foreground: '#637777', fontStyle: 'italic' },
            { token: 'type', foreground: '#ffcb8b' },
            { token: 'interface', foreground: '#ffcb8b' },
            { token: 'function', foreground: '#82aaff' },
            { token: 'variable', foreground: '#d7dbe0' },
            { token: 'variable.readonly', foreground: '#82aaff' },
            // JSX specific
            { token: 'tag', foreground: '#7fdbca' },
            { token: 'tag.id', foreground: '#7fdbca' },
            { token: 'attribute.name', foreground: '#addb67' },
            { token: 'attribute.value', foreground: '#ecc48d' },
        ],
        colors: {
            'editor.background': '#011627',
            'editor.foreground': '#d6deeb',
            'editor.lineHighlightBackground': '#0003',
            'editorCursor.foreground': '#80a4c2',
            'editor.selectionBackground': '#1d3b53',
            'editorLineNumber.foreground': '#4b6479',
            'editorLineNumber.activeForeground': '#80a4c2',
        },
    },
};
