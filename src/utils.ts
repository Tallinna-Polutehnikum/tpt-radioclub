export function formatDate(input: string | Date): string {
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ];

    let year: number, month: number, day: number;

    if (input instanceof Date) {
        if (isNaN(input.getTime())) {
            throw new Error("Invalid Date");
        }

        year = input.getFullYear();
        month = input.getMonth(); // 0-based
        day = input.getDate();
    } else if (typeof input === "string") {
        const m = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);

        if (!m) {
            throw new Error("Invalid date format, expected YYYY-MM-DD");
        }

        year = Number(m[1]);
        month = Number(m[2]) - 1;
        day = Number(m[3]);

        if (month < 0 || month > 11 || day < 1 || day > 31)
            throw new Error("Invalid date components");
    } else {
        throw new Error("Unsupported input type");
    }

    return `${months[month]} ${day}, ${year}`;
}

export const checkToken = (): { isValid: boolean } => {
    const accessToken = document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.replace("access_token=", "");

    if (!accessToken) {
        return { isValid: false };
    }

    try {
        const payload = JSON.parse(atob(accessToken.split(".")[1]));
        const now = Math.floor(Date.now() / 1000);

        return { isValid: now < payload.exp };
    } catch (err) {
        console.warn("isTokenValid error:", err);
        return { isValid: false };
    }
};
