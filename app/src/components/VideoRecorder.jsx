import { useState, useRef, useEffect } from 'react';

/**
 * VideoRecorder — allows guests to record a short video message
 * Uses the MediaRecorder API (supported in all modern browsers).
 * Records WebM (Chrome/Firefox) or MP4 (Safari).
 * Max duration: 60 seconds. Max file size enforced client-side.
 */

const MAX_DURATION_SECONDS = 60;
const MAX_FILE_SIZE_MB = 50;

const VideoRecorder = ({ onVideoReady, onCancel }) => {
  const [state, setState] = useState('idle'); // idle | requesting | preview | recording | recorded | error
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(MAX_DURATION_SECONDS);
  const [videoBlob, setVideoBlob] = useState(null);

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const recordedUrlRef = useRef(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopStream();
      if (timerRef.current) clearInterval(timerRef.current);
      if (recordedUrlRef.current) URL.revokeObjectURL(recordedUrlRef.current);
    };
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
  };

  const startCamera = async () => {
    setState('requesting');
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 720 }, height: { ideal: 720 } },
        audio: true,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        videoRef.current.play();
      }
      setState('preview');
    } catch (err) {
      console.error('Camera access error:', err);
      if (err.name === 'NotAllowedError') {
        setError('Camera access was denied. Please allow camera and microphone access to record a video message.');
      } else if (err.name === 'NotFoundError') {
        setError('No camera found. Please use a device with a camera.');
      } else {
        setError('Could not access camera. Please try again.');
      }
      setState('error');
    }
  };

  const startRecording = () => {
    if (!streamRef.current) return;
    chunksRef.current = [];
    setTimeLeft(MAX_DURATION_SECONDS);

    // Determine supported MIME type
    const mimeType = MediaRecorder.isTypeSupported('video/webm;codecs=vp9,opus')
      ? 'video/webm;codecs=vp9,opus'
      : MediaRecorder.isTypeSupported('video/webm')
        ? 'video/webm'
        : MediaRecorder.isTypeSupported('video/mp4')
          ? 'video/mp4'
          : '';

    const options = mimeType ? { mimeType } : {};

    try {
      const recorder = new MediaRecorder(streamRef.current, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: mimeType || 'video/webm',
        });

        // Check file size
        if (blob.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
          setError(`Video is too large (${(blob.size / 1024 / 1024).toFixed(1)}MB). Maximum is ${MAX_FILE_SIZE_MB}MB. Try a shorter recording.`);
          setState('preview');
          return;
        }

        setVideoBlob(blob);
        stopStream();

        // Set up playback
        if (recordedUrlRef.current) URL.revokeObjectURL(recordedUrlRef.current);
        const url = URL.createObjectURL(blob);
        recordedUrlRef.current = url;

        if (videoRef.current) {
          videoRef.current.srcObject = null;
          videoRef.current.src = url;
          videoRef.current.muted = false;
          videoRef.current.loop = false;
        }

        setState('recorded');
      };

      recorder.start(1000); // Collect data every second
      setState('recording');

      // Countdown timer
      let remaining = MAX_DURATION_SECONDS;
      timerRef.current = setInterval(() => {
        remaining--;
        setTimeLeft(remaining);
        if (remaining <= 0) {
          clearInterval(timerRef.current);
          recorder.stop();
        }
      }, 1000);
    } catch (err) {
      console.error('Recording error:', err);
      setError('Could not start recording. Your browser may not support video recording.');
      setState('error');
    }
  };

  const stopRecording = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
  };

  const retake = () => {
    setVideoBlob(null);
    if (recordedUrlRef.current) URL.revokeObjectURL(recordedUrlRef.current);
    recordedUrlRef.current = null;
    setState('idle');
    startCamera();
  };

  const handleSubmit = () => {
    if (videoBlob && onVideoReady) {
      onVideoReady(videoBlob);
    }
  };

  const handleCancel = () => {
    stopStream();
    stopRecording();
    if (onCancel) onCancel();
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-recorder">
      <style>{`
        .video-recorder {
          background: white;
          border: 1.5px solid #D4C8BA;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(61, 53, 48, 0.08);
        }

        .vr-title {
          font-family: 'Cormorant Garamond', Georgia, serif;
          font-size: 1.3rem;
          font-weight: 500;
          color: #3D3530;
          margin-bottom: 16px;
          text-align: center;
        }

        .vr-video-container {
          position: relative;
          width: 100%;
          max-width: 360px;
          margin: 0 auto 16px;
          border-radius: 10px;
          overflow: hidden;
          background: #1a1a1a;
          aspect-ratio: 1 / 1;
        }

        .vr-video-container video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .vr-timer {
          position: absolute;
          top: 12px;
          right: 12px;
          background: rgba(0, 0, 0, 0.6);
          color: white;
          padding: 4px 10px;
          border-radius: 16px;
          font-size: 0.8rem;
          font-weight: 500;
          font-family: 'DM Sans', sans-serif;
        }

        .vr-timer.recording { background: rgba(192, 57, 43, 0.85); }

        .vr-recording-dot {
          display: inline-block;
          width: 8px;
          height: 8px;
          background: #ff4444;
          border-radius: 50%;
          margin-right: 6px;
          animation: vr-pulse 1s ease-in-out infinite;
        }

        @keyframes vr-pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.3; }
        }

        .vr-buttons {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .vr-btn {
          padding: 12px 24px;
          border-radius: 6px;
          font-family: 'DM Sans', sans-serif;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          border: none;
        }

        .vr-btn-primary {
          background: #B8976A;
          color: white;
        }

        .vr-btn-primary:hover { background: #96784F; }

        .vr-btn-record {
          background: #c0392b;
          color: white;
          min-width: 140px;
        }

        .vr-btn-record:hover { background: #a93226; }

        .vr-btn-stop {
          background: #3D3530;
          color: white;
          min-width: 140px;
        }

        .vr-btn-secondary {
          background: transparent;
          color: #6B5E56;
          border: 1.5px solid #D4C8BA;
        }

        .vr-btn-secondary:hover { border-color: #B8976A; color: #3D3530; }

        .vr-error {
          text-align: center;
          color: #c0392b;
          font-size: 0.85rem;
          margin-bottom: 16px;
          line-height: 1.5;
        }

        .vr-hint {
          text-align: center;
          color: #9C8F87;
          font-size: 0.8rem;
          margin-top: 12px;
        }

        .vr-start-prompt {
          text-align: center;
          padding: 40px 20px;
        }

        .vr-start-prompt svg {
          width: 48px;
          height: 48px;
          color: #B8976A;
          margin-bottom: 16px;
        }

        .vr-start-prompt p {
          color: #6B5E56;
          font-size: 0.9rem;
          margin-bottom: 20px;
          line-height: 1.5;
        }

        .vr-file-size {
          text-align: center;
          color: #9C8F87;
          font-size: 0.75rem;
          margin-top: 8px;
        }
      `}</style>

      <h3 className="vr-title">Record a Video Message</h3>

      {error && <p className="vr-error">{error}</p>}

      {state === 'idle' && (
        <div className="vr-start-prompt">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="23 7 16 12 23 17 23 7" />
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
          </svg>
          <p>Record a short video message for the happy couple. Up to 60 seconds.</p>
          <div className="vr-buttons">
            <button className="vr-btn vr-btn-primary" onClick={startCamera}>
              Open Camera
            </button>
            <button className="vr-btn vr-btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {state === 'requesting' && (
        <div className="vr-start-prompt">
          <p>Requesting camera access...</p>
        </div>
      )}

      {state === 'error' && (
        <div className="vr-start-prompt">
          <div className="vr-buttons">
            <button className="vr-btn vr-btn-primary" onClick={startCamera}>
              Try Again
            </button>
            <button className="vr-btn vr-btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {(state === 'preview' || state === 'recording') && (
        <>
          <div className="vr-video-container">
            <video ref={videoRef} playsInline autoPlay muted={state === 'preview'} />
            {state === 'recording' && (
              <div className="vr-timer recording">
                <span className="vr-recording-dot" />
                {formatTime(timeLeft)}
              </div>
            )}
            {state === 'preview' && (
              <div className="vr-timer">
                {formatTime(MAX_DURATION_SECONDS)} max
              </div>
            )}
          </div>
          <div className="vr-buttons">
            {state === 'preview' && (
              <>
                <button className="vr-btn vr-btn-record" onClick={startRecording}>
                  Start Recording
                </button>
                <button className="vr-btn vr-btn-secondary" onClick={handleCancel}>
                  Cancel
                </button>
              </>
            )}
            {state === 'recording' && (
              <button className="vr-btn vr-btn-stop" onClick={stopRecording}>
                Stop Recording
              </button>
            )}
          </div>
          {state === 'preview' && (
            <p className="vr-hint">Position yourself and tap "Start Recording" when ready</p>
          )}
        </>
      )}

      {state === 'recorded' && videoBlob && (
        <>
          <div className="vr-video-container">
            <video ref={videoRef} playsInline controls />
          </div>
          <p className="vr-file-size">
            {(videoBlob.size / 1024 / 1024).toFixed(1)}MB · {MAX_DURATION_SECONDS - timeLeft}s
          </p>
          <div className="vr-buttons">
            <button className="vr-btn vr-btn-primary" onClick={handleSubmit}>
              Send Message
            </button>
            <button className="vr-btn vr-btn-secondary" onClick={retake}>
              Retake
            </button>
            <button className="vr-btn vr-btn-secondary" onClick={handleCancel}>
              Cancel
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default VideoRecorder;
