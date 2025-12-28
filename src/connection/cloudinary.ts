const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

const CLOUDINARY_BASE_URL = `https://api-eu.cloudinary.com/v1_1/${CLOUD_NAME}`;

interface CloudinaryUploadResponse {
    url: string;
    public_id: string;
}

export const cloudinaryUploadImage = async (file: File, folderName: string): Promise<CloudinaryUploadResponse> => {
    const form = new FormData();
    form.append("file", file);
    form.append("folder", folderName);
    form.append("upload_preset", UPLOAD_PRESET || "");

    const res = await fetch(`${CLOUDINARY_BASE_URL}/upload`, { method: "POST", body: form });

    if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Upload failed: ${res.status} ${txt}`);
    }

    const json = await res.json();

    return {
        url: json.secure_url || json.url,
        public_id: json.public_id
    }
}