import {
  css,
  html,
  event,
  query,
  listen,
  Emitter,
  Connected,
  Component,
  Autonomous,
} from '@workstream/common/elements';

@Autonomous({
  selector: 'webrtc-audio',
  mode: 'open',
})
export class WebrtcAudioElement
  extends Component(HTMLElement)
  implements Connected {
  static observed = [];

  pc1: RTCPeerConnection;
  pc2: RTCPeerConnection;

  offerOptions = {
    offerToReceiveAudio: true,
    offerToReceiveVideo: false,
    voiceActivityDetection: false,
  };

  localStream: MediaStream;

  supportsSetCodecPreferences: any;
  useDtx = false;
  useFec = true;

  @event()
  onPlay: Emitter<MouseEvent>;

  @listen('audio', 'play')
  onPlayed(event: EventWithTarget) {
    this.onPlay.emit(event.target);
  }

  @query('select#codecPreferences')
  codecPreferences: HTMLSelectElement;

  @query('audio#audio2')
  audio2: HTMLAudioElement;

  @query('button#callButton')
  callButton: HTMLButtonElement;

  @query('button#hangupButton')
  hangupButton: HTMLButtonElement;

  @query('select#codec')
  codecSelector: HTMLSelectElement;

  styles = css``;

  template = html`
    <div id="audio">
      <div>
        <div class="label">Local audio:</div>
        <audio id="audio1" autoplay controls muted></audio>
      </div>
      <div>
        <div class="label">Remote audio:</div>
        <audio id="audio2" autoplay controls></audio>
      </div>
    </div>

    <div id="buttons">
      <select id="codec">
        <!-- Codec values are matched with how they appear in the SDP.
            For instance, opus matches opus/48000/2 in Chrome, and ISAC/16000
            matches 16K iSAC (but not 32K iSAC). -->
        <option value="opus">Opus</option>
        <option value="ISAC">iSAC 16K</option>
        <option value="G722">G722</option>
        <option value="PCMU">PCMU</option>
        <option value="red">RED</option>
      </select>
      <select id="codecPreferences" disabled>
        <option selected value="">Default</option>
      </select>
      <button id="callButton">Call</button>
      <button id="hangupButton">Hang Up</button>
    </div>
    <div class="graph-container" id="bitrateGraph">
      <div>Bitrate</div>
      <canvas id="bitrateCanvas"></canvas>
    </div>
    <div class="graph-container" id="packetGraph">
      <div>Packets sent per second</div>
      <canvas id="packetCanvas"></canvas>
    </div>
    <div class="graph-container" id="audioLevelGraph">
      <div>average audio level ([0..1])</div>
      <canvas id="audioLevelCanvas"></canvas>
    </div>
  `;

  connected() {
    WebrtcAudioElement.selector;

    queueMicrotask(() => {
      console.log(this.audio2);
      console.log(this.hangupButton);
      console.log(this.callButton);
      console.log(this.codecSelector);
      console.log(this.codecPreferences);

      this.hangupButton.disabled = true;
      this.callButton.onclick = this.call.bind(this);
      this.hangupButton.onclick = this.hangup.bind(this);
    });
  }

  call() {
    this.callButton.disabled = true;
    this.codecSelector.disabled = true;
    console.log('Starting call');
    const servers = null;
    this.pc1 = new RTCPeerConnection(servers);
    console.log('Created local peer connection object pc1');
    this.pc1.onicecandidate = (e) => this.onIceCandidate(this.pc1, e);
    this.pc2 = new RTCPeerConnection(servers);
    console.log('Created remote peer connection object pc2');
    this.pc2.onicecandidate = (e) => this.onIceCandidate(this.pc2, e);
    this.pc2.ontrack = this.gotRemoteStream;
    console.log('Requesting local stream');
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: false,
      })
      .then(this.gotStream.bind(this))
      .catch((e) => {
        console.log(e);

        alert(`getUserMedia() error: ${e.name}`);
      });
  }

  gotStream(stream) {
    this.hangupButton.disabled = false;
    console.log('Received local stream');
    this.localStream = stream;
    const audioTracks = this.localStream.getAudioTracks();
    if (audioTracks.length > 0) {
      console.log(`Using Audio device: ${audioTracks[0].label}`);
    }
    this.localStream
      .getTracks()
      .forEach((track) => this.pc1.addTrack(track, this.localStream));
    console.log('Adding Local Stream to peer connection');

    if (this.supportsSetCodecPreferences) {
      const preferredCodec = this.codecPreferences.options[
        this.codecPreferences.selectedIndex
      ];
      if (preferredCodec.value !== '') {
        const [mimeType, clockRate, sdpFmtpLine] = preferredCodec.value.split(
          ' '
        );
        const { codecs } = RTCRtpSender.getCapabilities('audio');
        console.log(mimeType, clockRate, sdpFmtpLine);
        console.log(JSON.stringify(codecs, null, ' '));
        const selectedCodecIndex = codecs.findIndex(
          (c) =>
            c.mimeType === mimeType &&
            c.clockRate === parseInt(clockRate, 10) &&
            c.sdpFmtpLine === sdpFmtpLine
        );
        const selectedCodec = codecs[selectedCodecIndex];
        codecs.splice(selectedCodecIndex, 1);
        codecs.unshift(selectedCodec);
        const transceiver = this.pc1
          .getTransceivers()
          .find(
            (t) =>
              t.sender &&
              t.sender.track === this.localStream.getAudioTracks()[0]
          );
        transceiver.setCodecPreferences(codecs);
        console.log('Preferred video codec', selectedCodec);
      }
    }

    this.pc1
      .createOffer(this.offerOptions)
      .then(
        this.gotDescription1.bind(this),
        this.onCreateSessionDescriptionError.bind(this)
      );

    // this.bitrateSeries = new TimelineDataSeries();
    // this.bitrateGraph = new TimelineGraphView('bitrateGraph', 'bitrateCanvas');
    // this.bitrateGraph.updateEndDate();

    // this.headerrateSeries = new TimelineDataSeries();
    // this.headerrateSeries.setColor('green');

    // this.packetSeries = new TimelineDataSeries();
    // this.packetGraph = new TimelineGraphView('packetGraph', 'packetCanvas');
    // this.packetGraph.updateEndDate();

    // this.audioLevelSeries = new TimelineDataSeries();
    // this.audioLevelGraph = new TimelineGraphView(
    //   'audioLevelGraph',
    //   'audioLevelCanvas'
    // );
    // this.audioLevelGraph.updateEndDate();
  }

  gotDescription1(desc) {
    console.log(`Offer from pc1\n${desc.sdp}`);
    this.pc1.setLocalDescription(desc).then(() => {
      if (!this.supportsSetCodecPreferences) {
        desc.sdp = this.forceChosenAudioCodec(desc.sdp);
      }
      this.pc2.setRemoteDescription(desc).then(() => {
        return this.pc2
          .createAnswer()
          .then(
            this.gotDescription2.bind(this),
            this.onCreateSessionDescriptionError.bind(this)
          );
      }, this.onSetSessionDescriptionError.bind(this));
    }, this.onSetSessionDescriptionError.bind(this));
  }

  onCreateSessionDescriptionError(reason: any): void | PromiseLike<void> {
    console.error(reason);
  }
  // onCreateSessionDescriptionError(
  //   gotDescription2: (desc: any) => void,
  //   onCreateSessionDescriptionError: any
  // ): void | PromiseLike<void> {
  //   throw new Error('Method not implemented.');
  // }

  gotDescription2(desc) {
    console.log(`Answer from pc2\n${desc.sdp}`);
    this.pc2.setLocalDescription(desc).then(() => {
      if (!this.supportsSetCodecPreferences) {
        desc.sdp = this.forceChosenAudioCodec(desc.sdp);
      }
      if (this.useDtx) {
        desc.sdp = desc.sdp.replace(
          'useinbandfec=1',
          'useinbandfec=1;usedtx=1'
        );
      }
      if (!this.useFec) {
        desc.sdp = desc.sdp.replace('useinbandfec=1', 'useinbandfec=0');
      }
      this.pc1
        .setRemoteDescription(desc)
        .then(() => {}, this.onSetSessionDescriptionError);
    }, this.onSetSessionDescriptionError);
  }

  hangup() {
    console.log('Ending call');
    this.localStream.getTracks().forEach((track) => track.stop());
    this.pc1.close();
    this.pc2.close();
    this.pc1 = null;
    this.pc2 = null;
    this.hangupButton.disabled = true;
    this.callButton.disabled = false;
    this.codecSelector.disabled = false;
  }

  gotRemoteStream(e) {
    if (this.audio2.srcObject !== e.streams[0]) {
      this.audio2.srcObject = e.streams[0];
      console.log('Received remote stream');
    }
  }

  getOtherPc(pc) {
    return pc === this.pc1 ? this.pc2 : this.pc1;
  }

  getName(pc) {
    return pc === this.pc1 ? 'pc1' : 'pc2';
  }

  onIceCandidate(pc, event) {
    this.getOtherPc(pc)
      .addIceCandidate(event.candidate)
      .then(
        () => this.onAddIceCandidateSuccess(pc),
        (err) => this.onAddIceCandidateError(pc, err)
      );
    console.log(
      `${this.getName(pc)} ICE candidate:\n${
        event.candidate ? event.candidate.candidate : '(null)'
      }`
    );
  }

  onAddIceCandidateSuccess(pc) {
    console.log('AddIceCandidate success.');
  }

  onAddIceCandidateError(pc, error) {
    console.log(`Failed to add ICE Candidate: ${error.toString()}`);
  }

  onSetSessionDescriptionError(error) {
    console.log(`Failed to set session description: ${error.toString()}`);
  }

  forceChosenAudioCodec(sdp) {
    return this.maybePreferCodec(
      sdp,
      'audio',
      'send',
      this.codecSelector.value
    );
  }

  maybePreferCodec(sdp, type, dir, codec) {
    const str = `${type} ${dir} codec`;
    if (codec === '') {
      console.log(`No preference on ${str}.`);
      return sdp;
    }

    console.log(`Prefer ${str}: ${codec}`);

    const sdpLines = sdp.split('\r\n');

    // Search for m line.
    const mLineIndex = this.findLine(sdpLines, 'm=', type);
    if (mLineIndex === null) {
      return sdp;
    }

    // If the codec is available, set it as the default in m line.
    const codecIndex = this.findLine(sdpLines, 'a=rtpmap', codec);
    console.log('codecIndex', codecIndex);
    if (codecIndex) {
      const payload = this.getCodecPayloadType(sdpLines[codecIndex]);
      if (payload) {
        sdpLines[mLineIndex] = this.setDefaultCodec(
          sdpLines[mLineIndex],
          payload
        );
      }
    }

    sdp = sdpLines.join('\r\n');
    return sdp;
  }

  findLine(sdpLines, prefix, substr) {
    return this.findLineInRange(sdpLines, 0, -1, prefix, substr);
  }

  findLineInRange(sdpLines, startLine, endLine, prefix, substr) {
    const realEndLine = endLine !== -1 ? endLine : sdpLines.length;
    for (let i = startLine; i < realEndLine; ++i) {
      if (sdpLines[i].indexOf(prefix) === 0) {
        if (
          !substr ||
          sdpLines[i].toLowerCase().indexOf(substr.toLowerCase()) !== -1
        ) {
          return i;
        }
      }
    }
    return null;
  }

  getCodecPayloadType(sdpLine) {
    const pattern = new RegExp('a=rtpmap:(\\d+) \\w+\\/\\d+');
    const result = sdpLine.match(pattern);
    return result && result.length === 2 ? result[1] : null;
  }

  setDefaultCodec(mLine, payload) {
    const elements = mLine.split(' ');

    // Just copy the first three parameters; codec order starts on fourth.
    const newLine = elements.slice(0, 3);

    // Put target payload first and copy in the rest.
    newLine.push(payload);
    for (let i = 3; i < elements.length; i++) {
      if (elements[i] !== payload) {
        newLine.push(elements[i]);
      }
    }
    return newLine.join(' ');
  }

  public emitPlay<D = unknown>(detail: D) {
    this.onPlay.emit(detail);
  }
}
