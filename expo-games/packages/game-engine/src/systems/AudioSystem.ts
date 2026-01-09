import { Audio, AVPlaybackSource } from 'expo-av';

interface SoundOptions {
  volume?: number;
  rate?: number;
}

class AudioManagerClass {
  private sounds: Map<string, Audio.Sound> = new Map();
  private music: Audio.Sound | null = null;
  private musicVolume: number = 0.5;
  private sfxVolume: number = 1.0;
  private isMuted: boolean = false;

  async initialize(): Promise<void> {
    await Audio.setAudioModeAsync({
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  }

  async preload(manifest: Record<string, AVPlaybackSource>): Promise<void> {
    for (const [name, source] of Object.entries(manifest)) {
      try {
        const { sound } = await Audio.Sound.createAsync(source);
        this.sounds.set(name, sound);
      } catch (error) {
        console.warn(`Failed to load sound: ${name}`, error);
      }
    }
  }

  async playSFX(name: string, options: SoundOptions = {}): Promise<void> {
    if (this.isMuted) return;

    const sound = this.sounds.get(name);
    if (!sound) {
      console.warn(`Sound not found: ${name}`);
      return;
    }

    try {
      await sound.setVolumeAsync((options.volume ?? 1.0) * this.sfxVolume);
      if (options.rate) {
        await sound.setRateAsync(options.rate, true);
      }
      await sound.setPositionAsync(0);
      await sound.playAsync();
    } catch (error) {
      console.warn(`Failed to play sound: ${name}`, error);
    }
  }

  async playMusic(source: AVPlaybackSource, volume: number = 0.5): Promise<void> {
    await this.stopMusic();

    if (this.isMuted) return;

    try {
      const { sound } = await Audio.Sound.createAsync(source, {
        isLooping: true,
        volume: volume * this.musicVolume,
      });
      this.music = sound;
      await this.music.playAsync();
    } catch (error) {
      console.warn('Failed to play music', error);
    }
  }

  async stopMusic(): Promise<void> {
    if (this.music) {
      try {
        await this.music.stopAsync();
        await this.music.unloadAsync();
      } catch (error) {
        // Ignore cleanup errors
      }
      this.music = null;
    }
  }

  async duckMusic(duration: number = 200): Promise<void> {
    if (!this.music) return;

    const originalVolume = this.musicVolume;
    await this.music.setVolumeAsync(0.2);
    setTimeout(async () => {
      await this.music?.setVolumeAsync(originalVolume);
    }, duration);
  }

  async setMusicVolume(volume: number): Promise<void> {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.music) {
      await this.music.setVolumeAsync(this.musicVolume);
    }
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (muted) {
      this.stopMusic();
    }
  }

  async cleanup(): Promise<void> {
    await this.stopMusic();
    for (const sound of this.sounds.values()) {
      try {
        await sound.unloadAsync();
      } catch (error) {
        // Ignore cleanup errors
      }
    }
    this.sounds.clear();
  }
}

export const AudioManager = new AudioManagerClass();
export type { SoundOptions };
