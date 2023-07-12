import { NoteColor } from "./noteColor";

export interface Note {
    title: string,
    content: string,
    timestamp: number,
    color: NoteColor
} 