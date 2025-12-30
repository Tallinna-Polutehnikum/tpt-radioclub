import supabase from "../connection/supabase";

export interface ImageMeta {
    id: number;
    url: string;
    filename?: string;
    folder_id?: number | null;
    created_at?: string;
};

export async function getImagesByFolderId(folderId: number): Promise<ImageMeta[]> {
    const { data: imageData } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('folder_id', folderId)
        .order('id', { ascending: false });

    return imageData as ImageMeta[] || [];
}

export async function getImageForFolder(folderId: number): Promise<ImageMeta | null> {
    const { data: imageData } = await supabase
        .from('gallery_images')
        .select('*')
        .eq('folder_id', folderId)
        .limit(1);

    if (!imageData?.length) {
        return null;
    }

    return imageData[0] as ImageMeta;
}

export async function addImageToFolder(image: Partial<ImageMeta>): Promise<ImageMeta> {
    const { data: imageData } = await supabase
        .from('gallery_images')
        .insert(image)
        .select()
        .single();

    return imageData as ImageMeta;
}

export function deleteImage(imageId: number) {
    return supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageId);
}

export function deleteImagesByFolderId(folderId: string | number) {
    return supabase
        .from('gallery_images')
        .delete()
        .eq('folder_id', folderId);
}   

export async function updateImageFolder(folderId: string | number, imageId: string | number) {
    const { data: updatedImageMeta } = await supabase
        .from('gallery_images')
        .update({ folder_id: folderId })
        .eq('id', imageId)
        .select()
        .single();

    return updatedImageMeta as unknown as ImageMeta ?? null;
}
