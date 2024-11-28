interface RecordingOptions {
  preferCurrentTab?: boolean;
  targetElement?: HTMLElement;
  audio?: boolean;
}

export class ScreenRecorder {
  private mediaRecorder: MediaRecorder | null = null;
  private recordedChunks: Blob[] = [];

  async startRecording(element: HTMLElement, options: RecordingOptions = {}): Promise<void> {
    try {
      if (!element) {
        throw new Error("Target element is required");
      }

      // 画面キャプチャのストリームを取得
      const displayStream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          displaySurface: "monitor",
          frameRate: 30,
        }
      });

      let combinedStream = displayStream;

      // 音声を含める場合
      if (options.audio) {
        // マイクからの音声ストリームを取得
        const audioStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          },
          video: false
        });

        // 画面キャプチャとマイク音声を結合
        const tracks = [
          ...displayStream.getVideoTracks(),
          ...audioStream.getAudioTracks()
        ];
        combinedStream = new MediaStream(tracks);
      }

      this.mediaRecorder = new MediaRecorder(combinedStream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      });
      
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

        // すべてのトラックを停止
        combinedStream.getTracks().forEach(track => track.stop());
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