// -Path: 'cli/src/command/function/server/configureServer.ts'
import fs from 'fs-extra';
import path from 'node:path';
import { exec } from 'child_process';
import { Connect, ViteDevServer } from 'vite';

// Helper function สำหรับอ่าน body
const getBody = (req: Connect.IncomingMessage): Promise<any> => {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', (chunk: string) => (body += chunk));
        req.on('end', () => {
            try {
                resolve(JSON.parse(body || '{}'));
            } catch {
                reject(new Error('Invalid JSON'));
            }
        });
        req.on('error', reject);
    });
};

// Helper function สำหรับส่ง JSON response
const sendJson = (res: any, statusCode: number, data: any) => {
    res.statusCode = statusCode;
    res.setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(data));
};

// ตั้งค่า CORS headers
const setCorsHeaders = (res: any) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
};

export default function configureServer(server: ViteDevServer) {
    // Middleware หลักสำหรับจัดการ API ทั้งหมด
    server.middlewares.use('/api', async (req, res) => {
        // ตั้งค่า CORS headers
        setCorsHeaders(res);

        // จัดการ OPTIONS request (preflight)
        if (req.method === 'OPTIONS') {
            res.statusCode = 204;
            res.end();
            return;
        }

        // ดึง path หลังจาก /api
        const url = new URL(req.url!, `http://${req.headers.host}`);
        const apiPath = url.pathname.replace('/api', '') || '/';
        const searchParams = url.searchParams;

        try {
            // ===== API ROUTES =====

            // GET /api/test
            if (apiPath === '/test' && req.method === 'GET') {
                return sendJson(res, 200, {
                    success: true,
                    message: '🎉 API is working!',
                    method: 'GET',
                    time: new Date().toISOString(),
                });
            }

            // GET /api/open-explore
            if (apiPath === '/open-explore' && req.method === 'GET') {
                const path = searchParams.get('path');
                if (!path) return sendJson(res, 400, { success: false, error: 'Path is required' });                exec(`explorer ${path}`, (error) => {
                    if (error) {
                        if (!res.headersSent) {
                            sendJson(res, 500, { success: false, error: error.message });
                        }
                    } else {
                        if (!res.headersSent) {
                            sendJson(res, 200, {
                                success: true,
                                message: 'เปิด File Explorer บน Server แล้ว',
                            });
                        }
                    }
                });
            }

            // POST /api/data
            if (apiPath === '/data' && req.method === 'POST') {
                const data = await getBody(req);
                return sendJson(res, 200, {
                    success: true,
                    received: data,
                    timestamp: new Date().toISOString(),
                });
            }

            // GET /api/fs - อ่านไฟล์และโฟลเดอร์
            if (apiPath === '/fs' && req.method === 'GET') {
                const targetPath = searchParams.get('path') || process.cwd();

                const scan = async (dir: string): Promise<any[]> => {
                    const files = await fs.readdir(dir);
                    const result = await Promise.all(
                        files.map(async (file) => {
                            const fullPath = path.join(dir, file);
                            const stats = await fs.stat(fullPath);
                            const id = Buffer.from(fullPath).toString('base64');

                            if (stats.isDirectory()) {
                                return {
                                    id,
                                    name: file,
                                    isFolder: true,
                                    children: await scan(fullPath),
                                };
                            }
                            return { id, name: file };
                        }),
                    );
                    return result;
                };

                const data = await scan(targetPath);
                return sendJson(res, 200, data);
            }

            // POST /api/create-file
            if (apiPath === '/create-file' && req.method === 'POST') {
                const { parentPath, name } = await getBody(req);
                const targetPath = parentPath
                    ? path.join(Buffer.from(parentPath, 'base64').toString(), name)
                    : path.join(process.cwd(), name);
                await fs.ensureFile(targetPath);
                return sendJson(res, 200, { success: true });
            }

            // POST /api/create-folder
            if (apiPath === '/create-folder' && req.method === 'POST') {
                const { parentPath, name } = await getBody(req);
                const targetPath = parentPath
                    ? path.join(Buffer.from(parentPath, 'base64').toString(), name)
                    : path.join(process.cwd(), name);
                await fs.ensureDir(targetPath);
                return sendJson(res, 200, { success: true });
            }

            // POST /api/move
            if (apiPath === '/move' && req.method === 'POST') {
                const { nodeId, targetFolderId } = await getBody(req);
                const sourcePath = Buffer.from(nodeId, 'base64').toString();
                const targetDir = targetFolderId
                    ? Buffer.from(targetFolderId, 'base64').toString()
                    : process.cwd();
                const targetPath = path.join(targetDir, path.basename(sourcePath));
                await fs.move(sourcePath, targetPath);
                return sendJson(res, 200, { success: true });
            }

            // POST /api/rename
            if (apiPath === '/rename' && req.method === 'POST') {
                const { nodeId, newName } = await getBody(req);
                const sourcePath = Buffer.from(nodeId, 'base64').toString();
                const targetPath = path.join(path.dirname(sourcePath), newName);
                await fs.rename(sourcePath, targetPath);
                return sendJson(res, 200, { success: true });
            }

            // POST /api/delete
            if (apiPath === '/delete' && req.method === 'POST') {
                const { nodeId } = await getBody(req);
                const targetPath = Buffer.from(nodeId, 'base64').toString();
                await fs.remove(targetPath);
                return sendJson(res, 200, { success: true });
            }

            // ถ้า Method ไม่ถูกต้องสำหรับ endpoint ที่มีอยู่
            const validEndpoints = [
                '/test',
                '/hello',
                '/users',
                '/data',
                '/fs',
                '/create-file',
                '/create-folder',
                '/move',
                '/rename',
                '/delete',
            ];
            if (validEndpoints.includes(apiPath)) {
                return sendJson(res, 405, {
                    error: `Method ${req.method} not allowed for ${apiPath}`,
                });
            }

            // ไม่พบ API endpoint
            return sendJson(res, 404, {
                error: 'API endpoint not found',
                path: apiPath,
                availableEndpoints: validEndpoints,
            });
        } catch (error: any) {
            // จัดการ error
            if (error.message === 'Invalid JSON') {
                return sendJson(res, 400, { error: 'Invalid JSON in request body' });
            }

            console.error(`[API Error] ${apiPath}:`, error);
            return sendJson(res, 500, {
                error: 'Internal Server Error',
                message: error.message || 'Unknown error occurred',
            });
        }
    });
}
