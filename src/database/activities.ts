import type { Activity } from "../components/Activities";
import { formatDate } from "../utils";
import supabase from "../connection/supabase";

export const getAllActivities = async (): Promise<Activity[]> => {
    const { data: activities } = await supabase
        .from('activities')
        .select()
        .order('date', { ascending: false });

    if (!activities)
        return [];

    return activities.map(act => ({ ...act, date: formatDate(act.date) })) as unknown as Activity[];
}

export const getActivityById = async (id: string): Promise<Activity | null> => {
    const { data: activity } = await supabase
        .from('activities')
        .select()
        .eq('id', id)
        .single();
        
    if (!activity) 
        return null;

    return { ...activity, date: formatDate(activity.date) } as unknown as Activity;
}

export const createActivity = async (activity: Partial<Activity>): Promise<Activity | null> => {
    const { data: newActivity } = await supabase
        .from('activities')
        .insert(activity)
        .select()
        .single();

    return newActivity as unknown as Activity ?? null;
}

export const updateActivity = async (id: string, activity: Partial<Activity>): Promise<Activity | null> => {
    const { data: updatedActivity } = await supabase
        .from('activities')
        .update(activity)
        .eq('id', id)
        .select()
        .single();

    return updatedActivity as unknown as Activity ?? null;
}

export const deleteActivity = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('activities')
        .delete()
        .eq('id', id);

    return !error;
}

