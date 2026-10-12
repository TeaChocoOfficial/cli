// -Path: 'ui\src\pages\workspace\fileManager\getFileIcon.tsx'
import { VscJson, VscFile, VscMarkdown } from 'react-icons/vsc';
import { BiLogoTypescript, BiLogoJavascript } from 'react-icons/bi';
import { FaCss3Alt, FaReact, FaHtml5, FaGitAlt, FaImage } from 'react-icons/fa';

export function getFileIcon(fileName: string) {
    const base = fileName.toLowerCase();
    const extension = fileName.split('.').pop()?.toLowerCase() ?? '';

    if (base === '.gitignore') return <FaGitAlt className="text-[#e84d31]" />;

    const iconMap: Record<string, React.JSX.Element> = {
        tsx: <FaReact className="text-[#61dafb]" />,
        jsx: <FaReact className="text-[#61dafb]" />,
        ts: <BiLogoTypescript className="text-[#3178c6]" />,
        js: <BiLogoJavascript className="text-[#f7df1e]" />,
        mjs: <BiLogoJavascript className="text-[#f7df1e]" />,
        css: <FaCss3Alt className="text-[#1572b6]" />,
        html: <FaHtml5 className="text-[#e44d26]" />,
        json: <VscJson className="text-[#f7df1e]" />,
        md: <VscMarkdown className="text-[#519aba]" />,
        png: <FaImage className="text-[#a074c4]" />,
        jpg: <FaImage className="text-[#a074c4]" />,
        jpeg: <FaImage className="text-[#a074c4]" />,
        svg: <FaImage className="text-[#a074c4]" />,
        ico: <FaImage className="text-[#a074c4]" />,
        gif: <FaImage className="text-[#a074c4]" />,
        webp: <FaImage className="text-[#a074c4]" />,
    };

    return iconMap[extension] ?? <VscFile className="text-neutral-muted" />;
}
