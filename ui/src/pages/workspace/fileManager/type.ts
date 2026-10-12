// -Path: 'ui\src\pages\workspace\fileManager\type.ts'

/** ข้อมูลสำหรับไฟล์ทั่วไป */
export type FileNode = {
    id: string;
    name: string;
    isFolder?: false;
};

/** ข้อมูลสำหรับโฟลเดอร์ */
export type FolderNode = {
    id: string;
    name: string;
    isOpen?: boolean;
    isFolder: true;
    children: AnyNode[];
};

/** Type กลางที่รวมทั้งไฟล์และโฟลเดอร์ */
export type AnyNode = FileNode | FolderNode;

/** โครงสร้างข้อมูล Project ที่ประกอบด้วย file tree */
export type Project = {
    id: string;
    name: string;
    files: AnyNode[];
    isOpen?: boolean;
    rootPath?: string;
};
