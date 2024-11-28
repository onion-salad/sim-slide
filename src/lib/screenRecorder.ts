interface RecordingOptions {
  preferCurrentTab?: boolean;
}

// Chrome の MediaTrackConstraints に preferCurrentTab を追加する型定義
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
      const displayMediaOptions: DisplayMediaStreamOptions = {
        video: {
          displaySurface: options.preferCurrentTab ? "browser" : "window",
          preferCurrentTab: options.preferCurrentTab,
        },
        audio: true,
      };

      const stream = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);

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