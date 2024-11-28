interface RecordingOptions {
  preferCurrentTab?: boolean;
  targetElement?: HTMLElement;
}

declare global {
  interface MediaTrackConstraints {
    displaySurface?: string;
    preferCurrentTab?: boolean;
  }
}

export class ScreenRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  async startRecording(element: HTMLElement, options: RecordingOptions = {}): Promise<void> {
    try {
      if (!element) {
        throw new Error("Target element is required");
      }

      const displayMediaOptions: DisplayMediaStreamOptions = {
        video: {
          // 現在の画面を直接キャプチャするための設定
          displaySurface: "monitor",
          frameRate: 30,
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        }
      };

      const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
      const [videoTrack] = stream.getVideoTracks();

      this.mediaRecorder = new MediaRecorder(stream);
      this.recordedChunks = [];

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };

      this.mediaRecorder.onstop = () => {
        const blob = new Blob(this.recordedChunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.style.display = "none";
        a.href = url;
        a.download = "presentation-recording.webm";
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);

        stream.getTracks().forEach(track => track.stop());
      };

      this.mediaRecorder.start();
    } catch (err) {
      console.error("Error starting recording:", err);
      throw err;
    }
  }

  stopRecording(): void {
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
  }

  isRecording(): boolean {
    return this.mediaRecorder !== null && this.mediaRecorder.state === "recording";
  }
}