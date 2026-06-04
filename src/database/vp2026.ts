import supabase from "../connection/supabase";

export interface Vp2026Registration {
    id: number;
    callsign: string;
    name: string;
    county: string;
    created_at: string;
}

export const getAllRegistrations = async (): Promise<Vp2026Registration[]> => {
    const { data } = await supabase
        .from("vp2026_registrations")
        .select()
        .order("id", { ascending: true });

    if (!data) return [];

    return data as Vp2026Registration[];
};

export const createRegistration = async (
    callsign: string,
    name: string,
    county: string
): Promise<Vp2026Registration> => {
    const { data, error } = await supabase
        .from("vp2026_registrations")
        .insert({ callsign, name, county })
        .select()
        .single();

    if (error) {
        throw error;
    }

    return data as Vp2026Registration;
};
