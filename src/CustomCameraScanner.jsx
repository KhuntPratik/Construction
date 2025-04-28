import { useState, useEffect, useRef } from "react";

function CustomCameraScanner() {
  const [stream, setStream] = useState(null);
  const [cameraFacingMode, setCameraFacingMode] = useState('environment');
  const [error, setError] = useState('');
  const [zoom, setZoom] = useState(1);
  const [torchOn, setTorchOn] = useState(false);

  const videoRef = useRef(null);
  const trackRef = useRef(null);

  const startCamera = async () => {
    try {
      const constraints = {
        video: {
          facingMode: cameraFacingMode,
          width: { ideal: 1280 },
          height: { ideal: 720 },
          focusMode: "continuous" // if supported
        }
      };

      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      const track = mediaStream.getVideoTracks()[0];
      trackRef.current = track;

    } catch (err) {
      console.error(err);
      setError("❌ Unable to access camera");
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const toggleCamera = () => {
    stopCamera();
    setCameraFacingMode(prev => prev === 'environment' ? 'user' : 'environment');
  };

  const toggleTorch = async () => {
    if (!trackRef.current) return;
    const capabilities = trackRef.current.getCapabilities();
    if (capabilities.torch) {
      const settings = { advanced: [{ torch: !torchOn }] };
      try {
        await trackRef.current.applyConstraints(settings);
        setTorchOn(prev => !prev);
      } catch (err) {
        console.error(err);
      }
    } else {
      alert("⚡ Torch not supported on this device!");
    }
  };

  const zoomIn = () => {
    if (!trackRef.current) return;
    const capabilities = trackRef.current.getCapabilities();
    if (capabilities.zoom) {
      const newZoom = Math.min(zoom + 0.5, capabilities.zoom.max);
      trackRef.current.applyConstraints({ advanced: [{ zoom: newZoom }] });
      setZoom(newZoom);
    } else {
      alert("🔍 Zoom not supported!");
    }
  };

  const zoomOut = () => {
    if (!trackRef.current) return;
    const capabilities = trackRef.current.getCapabilities();
    if (capabilities.zoom) {
      const newZoom = Math.max(zoom - 0.5, capabilities.zoom.min);
      trackRef.current.applyConstraints({ advanced: [{ zoom: newZoom }] });
      setZoom(newZoom);
    } else {
      alert("🔍 Zoom not supported!");
    }
  };

  useEffect(() => {
    startCamera();
    return () => stopCamera();
    // eslint-disable-next-line
  }, [cameraFacingMode]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>📷 Custom Camera Scanner</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <div style={{ position: "relative" }}>
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          style={{ width: "100%", maxWidth: "400px", borderRadius: "10px" }}
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <button onClick={toggleCamera} style={btnStyle}>🔄 Switch Camera</button>
        <button onClick={toggleTorch} style={btnStyle}>⚡ Toggle Torch</button>
        <button onClick={zoomIn} style={btnStyle}>➕ Zoom In</button>
        <button onClick={zoomOut} style={btnStyle}>➖ Zoom Out</button>
      </div>

      <p style={{ marginTop: "10px" }}>Current Zoom: {zoom.toFixed(1)}x</p>
    </div>
  );
}

const btnStyle = {
  margin: "5px",
  padding: "10px 15px",
  fontSize: "16px",
  cursor: "pointer",
  borderRadius: "8px",
  border: "none",
  background: "#4CAF50",
  color: "white"
};

export default CustomCameraScanner;
