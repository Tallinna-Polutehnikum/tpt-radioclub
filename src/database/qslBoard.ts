import type { QslMessage } from "../components/QslBoard";
import supabase from "../connection/supabase";

export const getAllQslMessages = async (): Promise<QslMessage[]> => {
    const { data: messages } = await supabase
        .from("qsl_messages")
        .select()
        .order("created_at", { ascending: false });

    if (!messages) return [];

    return messages as unknown as QslMessage[];
};

export const createQslMessage = async (message: Partial<QslMessage>): Promise<QslMessage> => {
    const { data: newActivity, error } = await supabase
        .from("qsl_messages")
        .insert(message)
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return (newActivity as unknown as QslMessage) ?? null;
}

export const deleteQslMessage = async (id: number) => {
    const { error } = await supabase.from("qsl_messages").delete().eq("id", id);

    return !error;
}