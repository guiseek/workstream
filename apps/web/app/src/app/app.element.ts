import {
  css,
  html,
  listen,
  Connected,
  Component,
  Autonomous,
  query,
} from '@workstream/common/elements';

@Autonomous({
  selector: 'workstream-root',
  mode: 'open',
})
export class AppElement extends Component(HTMLElement) implements Connected {
  public static observed = [];

  mimeType: string;
  stream: MediaStream;
  mediaRecorder: MediaRecorder;
  recordedBlobs: Blob[] = [];

  button: Record<'play' | 'start' | 'record' | 'download', HTMLButtonElement>;
  video: Record<'recorder' | 'recorded', HTMLVideoElement>;
  link: HTMLAnchorElement;

  @query('#message')
  message: HTMLOutputElement;

  styles = css`
  `;

  template = html`
    <main>
      <demo-buttons></demo-buttons>
    </main>
  `;

  connected() {
  }
  // connected() {
  //   this.button = {
  //     play: this.shadowRoot.querySelector('#play'),
  //     start: this.shadowRoot.querySelector('#start'),
  //     record: this.shadowRoot.querySelector('#record'),
  //     download: this.shadowRoot.querySelector('#download'),
  //   };

  //   this.video = {
  //     recorder: this.shadowRoot.querySelector('#recorder'),
  //     recorded: this.shadowRoot.querySelector('#recorded'),
  //   };

  //   this.link = this.shadowRoot.querySelector('#downlink');

  //   this.button.start.focus();
  // }

  // @listen('input', 'change', true)
  // onCheckedChange({ checked }) {
  //   console.log(checked);
  //   this.video.recorder.muted = checked;
  // }

  // @listen('#start', 'click')
  // onStart() {
  //   const constraints = { video: true, audio: true };

  //   this.init(constraints)
  //     .then((stream) => {
  //       this.stream = stream;
  //       this.button.start.disabled = true;
  //       this.button.record.disabled = false;
  //       this.video.recorder.srcObject = stream;
  //     })
  //     .then(() => this.button.record.focus());
  // }

  // @listen('#play', 'click')
  // onPlay() {
  //   const blob = new Blob(this.recordedBlobs, { type: this.mimeType });
  //   this.video.recorded.src = URL.createObjectURL(blob);
  //   this.video.recorded.controls = true;
  //   this.video.recorded.play();
  //   this.button.download.focus();
  // }

  // @listen('#record', 'click')
  // onRecord() {
  //   const { state } = this.mediaRecorder ?? {};

  //   if (state && state === 'recording') {
  //     this.mediaRecorder.stop();
  //   } else {
  //     this.startRecording();
  //   }
  // }

  // @listen('#download', 'click')
  // onDownload() {
  //   const blob = new Blob(this.recordedBlobs, { type: this.mimeType });
  //   this.link.href = URL.createObjectURL(blob);
  //   this.link.download = 'video.webm';
  //   this.link.click();
  // }

  // // Core
  // startRecording() {
  //   this.recordedBlobs = [];

  //   const mimeTypes = [
  //     'video/webm;codecs=vp9,opus',
  //     'video/webm;codecs=vp8,opus',
  //     'video/webm',
  //     'video/mp4',
  //   ];

  //   this.mimeType = mimeTypes.find((type) => {
  //     return MediaRecorder.isTypeSupported(type);
  //   });

  //   if (!this.mimeType) {
  //     console.error('MediaRecorder support');
  //   }

  //   try {
  //     this.mediaRecorder = new MediaRecorder(this.stream, {
  //       mimeType: this.mimeType,
  //     });

  //     this.mediaRecorder.ondataavailable = ({ data }: BlobEvent) => {
  //       if (data && data.size > 0) {
  //         this.recordedBlobs.push(data);
  //       }
  //     };

  //     this.mediaRecorder.start();
  //     const icon = this.button.record.querySelector('bs-icon');

  //     this.mediaRecorder.onstart = () => {
  //       // icon.setState(pause);
  //       icon.classList.add('ping');
  //     };
  //     this.mediaRecorder.onstop = () => {
  //       // icon.setState(record);
  //       icon.classList.remove('ping');

  //       this.button.play.disabled = false;
  //       this.button.download.disabled = false;

  //       this.button.play.focus();
  //     };
  //   } catch (err) {
  //     console.error('Exception while creating MediaRecorder:', err);

  //     this.message.innerHTML = `Erro ao criar objeto MediaRecorder,
  //     por favor, abra uma issue por relatando o problema usando este
  //     <a href="https://github.com/DeveloperParana/recursos/issues/new">link</a>
  //   `;
  //   }
  // }

  // async init({ video, audio }: MediaStreamConstraints) {
  //   try {
  //     const display = await this.getDisplay(video as MediaTrackConstraints);
  //     const user = await this.getUser(audio as MediaTrackConstraints);

  //     const [track] = user.getAudioTracks();
  //     display.addTrack(track);

  //     return display;
  //   } catch (err) {
  //     alert(err);
  //   }
  // }

  // getUser(audio: MediaTrackConstraints) {
  //   return navigator.mediaDevices.getUserMedia({ audio });
  // }

  // getDisplay(video: MediaTrackConstraints) {
  //   return navigator.mediaDevices.getDisplayMedia({ video });
  // }
}
