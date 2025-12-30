import type { Callsign } from "../components/Callbook";
import supabase from "../connection/supabase";

export const getAllCallSigns = async (): Promise<Callsign[]> => { 
    const { data: callsigns } = await supabase
        .from('callsigns')
        .select()
        .order('id', { ascending: true });

    if (!callsigns)
        return [];

    return callsigns as unknown as Callsign[];
}

export const getCallSignById = async (id: string): Promise<Callsign | null> => {
    const { data: callsign } = await supabase
        .from('callsigns')
        .select()
        .eq('id', id)
        .single();
        
    if (!callsign) 
        return null;

    return callsign as unknown as Callsign;
}

export const createCallSign = async (callsign: Partial<Callsign>): Promise<Callsign | null> => {
    const { data: newCallSign } = await supabase
        .from('callsigns')
        .insert(callsign)
        .select()
        .single();

    return newCallSign as unknown as Callsign ?? null;
}

export const updateCallSign = async (id: number, callsign: Partial<Callsign>): Promise<Callsign | null> => {
    const { data: updatedCallSign } = await supabase
        .from('callsigns')
        .update(callsign)
        .eq('id', id)
        .select()
        .single();

    return updatedCallSign as unknown as Callsign ?? null;
}

export const deleteCallSign = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('callsigns')
        .delete()
        .eq('id', id);

    return !error;
}