export interface Message {
    id: string;
    sourceSystem: string;
    destinationAddress: string;
    messageId: string;
    correlationId: string;
    messageRenderTechnology: string;
    payload: string;
}

export interface MessageState {
    messages: Message[];
    loading: boolean;
    error: string | null;
}

export const initialMessageState: MessageState = {
    messages: [],
    loading: false,
    error: null
}
