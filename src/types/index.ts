// types/index.ts
export interface AvatarProps {
    avatar_url: string;
    speak: boolean;
    setSpeak: (speak: boolean) => void;
    text: string;
    setAudioSource: (source: string | null) => void;
    playing: boolean;
  }
  
  export interface Message {
    type: 'user' | 'assistant';
    content: string;
  }