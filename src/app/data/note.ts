import { NoteColor } from "./noteColor";

export interface Note {
    id: number,
    title: string,
    content: string,
    timestamp: number,
    color: NoteColor
} 