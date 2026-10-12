//-Path: "TeaChoco-Official/dev/src/pages/code/editor/monaco/Languages.tsx"
import { useEffect } from 'react';
import { ExtraLibType } from '../data';
import { useMonaco } from '@monaco-editor/react';

export default function Languages({
    extraLibs,
}: {
    extraLibs: ExtraLibType[];
}) {
    const monaco = useMonaco();

    useEffect(() => {
        if (monaco) {
            monaco.languages.typescript.javascriptDefaults.setEagerModelSync(
                true,
            );

            // ตั้งค่า TypeScript compiler options
            monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
                target: monaco.languages.typescript.ScriptTarget.ESNext,
                allowNonTsExtensions: true,
                moduleResolution:
                    monaco.languages.typescript.ModuleResolutionKind.NodeJs,
                module: monaco.languages.typescript.ModuleKind.ESNext,
                noEmit: true,
                esModuleInterop: true,
                jsx: monaco.languages.typescript.JsxEmit.React,
                reactNamespace: 'React',
                allowJs: true,
                typeRoots: ['node_modules/@types'],
            });

            // เพิ่ม type definitions สำหรับ React
            monaco.languages.typescript.typescriptDefaults.addExtraLib(
                `declare module 'react' {
                        namespace React {
                            type FC<P = {}> = React.FunctionComponent<P>;
                            interface FunctionComponent<P = {}> {
                            (props: P & { children?: React.ReactNode }): React.ReactElement | null;
                            }
                            type ReactElement = {
                            type: any;
                            props: any;
                            key: any;
                            };
                            type ReactNode = ReactElement | string | number | boolean | null | undefined;
                        }
                        export = React;
                        export as namespace React;
                    }`,
                'file:///node_modules/@types/react/index.d.ts',
            );

            monaco.languages.typescript.typescriptDefaults.addExtraLib(
                `declare module 'react' {
                    function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
                    function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
                    function useRef<T>(initialValue: T): { current: T };
                    function useMemo<T>(factory: () => T, deps: readonly any[]): T;
                    function useCallback<T extends (...args: any[]) => any>(callback: T, deps: readonly any[]): T;
                }`,
                'file:///node_modules/@types/react/hooks.d.ts',
            );

            // Add tailwind types if you're using it
            monaco.languages.typescript.typescriptDefaults.addExtraLib(
                `
                declare module 'tailwind' {
                    type TailwindClass = string;
                }
                `,
                'file:///node_modules/tailwind/index.d.ts',
            );

            // เพิ่ม extra libraries ที่ส่งมาจาก props
            extraLibs.forEach(({ content, filePath }) => {
                monaco?.languages.typescript.typescriptDefaults.addExtraLib(
                    content,
                    `file:///node_modules/${filePath}`,
                );
            });
        }
    }, [monaco, extraLibs]);
}
