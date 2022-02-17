import { invoke } from "@tauri-apps/api/tauri";

export async function readdir (dir: string): Promise<string[]> {
    return invoke('readdir', { dir })
}
export async function readtextfile (dir: string): Promise<string> {
    return invoke('readtextfile', { dir })
}
export async function writefile (contents: string, dir: string) {
    return invoke('writefile', { contents, dir })
}