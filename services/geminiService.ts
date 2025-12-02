import { GoogleGenAI, LiveServerMessage, Modality, Type } from "@google/genai";
import { JobAnalysis } from "../types";

// Initialize Gemini Client
const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

// --- HELPER FUNCTIONS FOR LIVE API ---

function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): { data: string, mimeType: string } {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

// --- LIVE SESSION MANAGER ---

export class LiveSession {
  private inputContext: AudioContext | null = null;
  private outputContext: AudioContext | null = null;
  private nextStartTime = 0;
  private sources = new Set<AudioBufferSourceNode>();
  private sessionPromise: Promise<any> | null = null;
  private active = false;
  
  // Callbacks
  onStatusChange?: (status: 'connecting' | 'connected' | 'disconnected' | 'speaking') => void;

  async connect() {
    this.onStatusChange?.('connecting');
    this.active = true;

    // 1. Setup Audio Contexts
    this.inputContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 16000});
    this.outputContext = new (window.AudioContext || (window as any).webkitAudioContext)({sampleRate: 24000});

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    
    // 2. Setup Input Stream
    const source = this.inputContext.createMediaStreamSource(stream);
    const scriptProcessor = this.inputContext.createScriptProcessor(4096, 1, 1);
    
    scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
      if (!this.active || !this.sessionPromise) return;
      
      const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
      const pcmBlob = createBlob(inputData);
      
      this.sessionPromise.then((session) => {
        session.sendRealtimeInput({ media: pcmBlob });
      });
    };
    
    source.connect(scriptProcessor);
    scriptProcessor.connect(this.inputContext.destination);

    // 3. Connect to Gemini Live
    this.sessionPromise = ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-09-2025',
      callbacks: {
        onopen: () => {
          this.onStatusChange?.('connected');
        },
        onmessage: async (message: LiveServerMessage) => {
          const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
          
          if (base64Audio && this.outputContext) {
            this.onStatusChange?.('speaking');
            this.nextStartTime = Math.max(this.nextStartTime, this.outputContext.currentTime);
            
            const audioBuffer = await decodeAudioData(
              decode(base64Audio),
              this.outputContext,
              24000,
              1
            );
            
            const source = this.outputContext.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(this.outputContext.destination);
            
            source.addEventListener('ended', () => {
              this.sources.delete(source);
              if (this.sources.size === 0) {
                 this.onStatusChange?.('connected'); // Back to listening
              }
            });

            source.start(this.nextStartTime);
            this.nextStartTime += audioBuffer.duration;
            this.sources.add(source);
          }

          if (message.serverContent?.interrupted) {
            this.sources.forEach(s => s.stop());
            this.sources.clear();
            this.nextStartTime = 0;
            this.onStatusChange?.('connected');
          }
        },
        onerror: (e) => {
          console.error('Live API Error', e);
          this.disconnect();
        },
        onclose: () => {
          this.onStatusChange?.('disconnected');
        }
      },
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
        },
        systemInstruction: "You are the IncomeStack Wealth Coach. You are energetic, professional, and concise. You help the user with career advice and financial data."
      }
    });

    await this.sessionPromise;
  }

  async disconnect() {
    this.active = false;
    this.sessionPromise?.then(s => s.close());
    this.inputContext?.close();
    this.outputContext?.close();
    this.sources.forEach(s => s.stop());
    this.sources.clear();
    this.onStatusChange?.('disconnected');
  }
}


// --- FEATURE IMPLEMENTATIONS ---

/**
 * FEATURE: Google Search Grounding
 * Model: gemini-2.5-flash
 */
export const getMarketInsights = async (query: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Provide a concise market analysis for: ${query}. Focus on trends and actionable data.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    return { 
      text: response.text, 
      grounding: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [] 
    };
  } catch (error) {
    console.error("Market Insights Error:", error);
    return { text: "Unable to fetch market data at this moment.", grounding: [] };
  }
};

/**
 * FEATURE: Think more when needed (Thinking Mode)
 * Model: gemini-3-pro-preview
 * Config: thinkingBudget = 32768
 */
export const getMastermindAdvice = async (history: {role: string, content: string}[], newMessage: string) => {
  try {
    const chat = ai.chats.create({
      model: "gemini-3-pro-preview",
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        // Do not set maxOutputTokens when using thinkingBudget
        systemInstruction: "You are 'Wealth Coach', an elite financial and career advisor. You provide strategic advice. Use your thinking budget to deeply analyze the user's situation before responding.",
      }
    });

    // Note: In a real app we would load history into the chat context.
    // For this demo, we'll append the history to the prompt if needed, but a fresh message works for the demo.
    const response = await chat.sendMessage({ message: newMessage });
    return response.text;
  } catch (error) {
    console.error("Mastermind Error:", error);
    return "The Wealth Coach is currently offline (Rate Limit or Network Error).";
  }
};

/**
 * FEATURE: Gemini Intelligence (Analyze Content)
 * Model: gemini-3-pro-preview (Complex Task)
 */
export const analyzeJobMatch = async (jobTitle: string, jobDesc: string, userTags: string[]) => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-3-pro-preview",
            contents: `Analyze this job opportunity: "${jobTitle} - ${jobDesc}". My skills are: ${userTags.join(', ')}. 
            Return a JSON object with:
            - matchAnalysis (string, 1 sentence summary)
            - pros (array of strings)
            - cons (array of strings)
            - growthPotential (number 0-100)`,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        matchAnalysis: { type: Type.STRING },
                        pros: { type: Type.ARRAY, items: { type: Type.STRING } },
                        cons: { type: Type.ARRAY, items: { type: Type.STRING } },
                        growthPotential: { type: Type.NUMBER }
                    }
                }
            }
        });
        
        return JSON.parse(response.text) as JobAnalysis;
    } catch (e) {
        console.error("Analysis Failed", e);
        return null;
    }
}

/**
 * FEATURE: Generate images with Nano Banana Pro
 * Model: gemini-3-pro-image-preview
 * Size: Configurable (1K, 2K, 4K)
 */
export const generateVisionBoardImage = async (prompt: string, size: "1K" | "2K" | "4K") => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          imageSize: size,
          aspectRatio: "16:9"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    return null;
  } catch (error) {
    console.error("Image Gen Error:", error);
    return null;
  }
};
