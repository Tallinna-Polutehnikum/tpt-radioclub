import supabase from "../connection/supabase";
import type { StorageError } from "@supabase/storage-js";

const SUPABASE_STORAGE_URL = import.meta.env.VITE_SUPABASE_URL || "";

export interface SupabaseRequestResult {
    url: string | null;
    error: StorageError | null;
}

export const getSupabasePublicUrl = (path: string, gallery: string): string => {
    return `${SUPABASE_STORAGE_URL}/storage/v1/object/public/${gallery}/${path}`;
}

export const supabaseUploadImage = async (file: File, folder: string, gallery: string = "gallery"): Promise<SupabaseRequestResult> => {
    const { data, error } = await supabase.storage
        .from(gallery)
        .upload(`${folder}/${file.name}`, file);

    if (error) {
        console.error("Supabase storage upload error:", error);
        return { url: null, error };
    }

    return { url: getSupabasePublicUrl(data.path, gallery), error: null };
}

export const supabaseDeleteImage = async (path: string, gallery: string = "gallery"): Promise<void> => {
    const { error } = await supabase
        .storage
        .from(gallery)
        .remove([path])

    if (error) {
        console.error("Supabase storage delete error:", error);
        return;
    }
}