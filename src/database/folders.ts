import supabase from "../connection/supabase";

export interface Folder {
    id: number;
    name: string;
    created_at?: string;
};

export async function getAllFolders(): Promise<Folder[]> {
    const { data: folderData } = await supabase
        .from('gallery_folders')
        .select('*')
        .order('id', { ascending: true });
    
    return folderData as Folder[] || [];
}

export async function getFolderById(id: string | number): Promise<Folder | null> {
    const { data: folderData } = await supabase
        .from('gallery_folders')
        .select('*')
        .eq('id', id)
        .single();

    return folderData as Folder || null;
}

export async function createFolder(name: string): Promise<Folder> {
    const { data: folderData } = await supabase
        .from('gallery_folders')
        .insert({name})
        .select()
        .single();  

    return folderData as Folder;
}

export async function updateFolder(id: string | number, folder: { name?: string; description?: string; }): Promise<Folder> {
    const { data: folderData } = await supabase
        .from('gallery_folders')
        .update(folder)
        .eq('id', id)
        .select()
        .single();

    return folderData as Folder;
}

export function deleteFolder(id: string | number) {
    return supabase
        .from('gallery_folders')
        .delete()
        .eq('id', id);
}