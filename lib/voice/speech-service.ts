import * as speechsdk from 'microsoft-cognitiveservices-speech-sdk';

export class SpeechService {
  private synthesizer: speechsdk.SpeechSynthesizer;
  private recognizer: speechsdk.SpeechRecognizer;

  constructor() {
    const speechConfig = speechsdk.SpeechConfig.fromSubscription(
      process.env.AZURE_SPEECH_KEY!,
      process.env.AZURE_SPEECH_REGION!
    );
    
    this.synthesizer = new speechsdk.SpeechSynthesizer(speechConfig);
    this.recognizer = new speechsdk.SpeechRecognizer(speechConfig);
  }

  async textToSpeech(text: string): Promise<ArrayBuffer> {
    return new Promise((resolve, reject) => {
      this.synthesizer.speakTextAsync(
        text,
        result => {
          if (result.reason === speechsdk.ResultReason.SynthesizingAudioCompleted) {
            resolve(result.audioData);
          } else {
            reject(new Error('Speech synthesis failed'));
          }
        },
        error => reject(error)
      );
    });
  }

  async startListening(onResult: (text: string) => void): Promise<void> {
    this.recognizer.recognized = (_, event) => {
      if (event.result.reason === speechsdk.ResultReason.RecognizedSpeech) {
        onResult(event.result.text);
      }
    };
    
    await this.recognizer.startContinuousRecognitionAsync();
  }

  async stopListening(): Promise<void> {
    await this.recognizer.stopContinuousRecognitionAsync();
  }
}