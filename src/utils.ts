import crypto from "crypto";

export function formatDate(input: string | Date): string {
    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    let year: number, month: number, day: number;

    if (input instanceof Date) {
        if (isNaN(input.getTime())) throw new Error("Invalid Date");
        year = input.getFullYear();
        month = input.getMonth(); // 0-based
        day = input.getDate();
    } else if (typeof input === "string") {
        const m = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
        if (!m) throw new Error("Invalid date format, expected YYYY-MM-DD");
        year = Number(m[1]);
        month = Number(m[2]) - 1;
        day = Number(m[3]);
        // basic validation
        if (month < 0 || month > 11 || day < 1 || day > 31) throw new Error("Invalid date components");
    } else {
        throw new Error("Unsupported input type");
    }

    return `${months[month]} ${day}, ${year}`;
}

export function setUploadPresetPoC() {
    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign = `timestamp=${timestamp}${'5GC0OZK4rq2-QpX3_vRE08BnMW4'}`;
    const signature = crypto.createHash("sha1").update(paramsToSign).digest("hex");
    return JSON.stringify({ signature, timestamp, api_key: '874837874837487' });
}