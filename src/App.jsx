import { useState, useRef } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";

function App() {
  const [scannedItem, setScannedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [name, setName] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [openCamera, setOpenCamera] = useState(false);
  const [cameraFacingMode, setCameraFacingMode] = useState('environment');
  const [error, setError] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [zoom, setZoom] = useState(1); // 👈 Zoom state

  const lastScanResultRef = useRef(null);
  const videoRef = useRef(null); // 👈 To access video element

  const handleCalculate = () => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(pricePerKg) || 0;
    setCalculatedPrice(qty * price);
  };

  const handleSendToDatabase = () => {
    const data = {
      item: scannedItem,
      quantity,
      pricePerKg,
      totalPrice: calculatedPrice,
    };
    console.log('Sending to database:', data);
  };

  const handleCapture = () => {
    if (lastScanResultRef.current) {
      setScannedItem(lastScanResultRef.current);
      setOpenCamera(false);
      setError('');
    } else {
      setError('❌ No barcode detected. Please try again.');
    }
  };

  const handleSendWhatsApp = () => {
    if (!whatsappNumber) {
      alert("Please enter a WhatsApp number.");
      return;
    }

    const message = `🧾 *Your Bill Details:*\n\n` +
      `*Name:* ${name}\n` +
      `*Item:* ${scannedItem}\n` +
      `*Quantity:* ${quantity}\n` +
      `*Price per Kg:* ₹${pricePerKg}\n` +
      `*Total Price:* ₹${calculatedPrice}\n\n` +
      `Thank you for shopping with us!`;

    const phone = whatsappNumber.startsWith('+') ? whatsappNumber : `+91${whatsappNumber}`;
    const url = `https://wa.me/${phone.replace('+', '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const toggleCameraFacingMode = () => {
    setCameraFacingMode((prevMode) => prevMode === 'environment' ? 'user' : 'environment');
  };

  // 👉 Setup videoRef after component mounts
  const handleVideoRef = (video) => {
    if (video && video.srcObject) {
      const [track] = video.srcObject.getVideoTracks();
      if (track && track.getCapabilities) {
        const capabilities = track.getCapabilities();
        if (capabilities.zoom) {
          track.applyConstraints({ advanced: [{ zoom }] });
        }
      }
    }
    videoRef.current = video;
  };

  const handleZoomIn = () => {
    setZoom(prev => {
      const newZoom = Math.min(prev + 0.5, 5); // max zoom 5x
      applyZoom(newZoom);
      return newZoom;
    });
  };

  const handleZoomOut = () => {
    setZoom(prev => {
      const newZoom = Math.max(prev - 0.5, 1); // min zoom 1x
      applyZoom(newZoom);
      return newZoom;
    });
  };

  const applyZoom = (newZoom) => {
    if (videoRef.current && videoRef.current.srcObject) {
      const [track] = videoRef.current.srcObject.getVideoTracks();
      if (track && track.getCapabilities && track.getCapabilities().zoom) {
        track.applyConstraints({ advanced: [{ zoom: newZoom }] });
      }
    }
  };

  return (
    <div className="container">
      <h2>📦 Scan & Add Product</h2>

      <div className="card">
        {!openCamera && (
          <button className="btn open" onClick={() => { setOpenCamera(true); setError(''); }}>
            📷 Open Camera
          </button>
        )}

        {openCamera && (
          <div className="scanner">
            <BarcodeScannerComponent
              width="100%"
              height={250}
              facingMode={cameraFacingMode}
              onUpdate={(err, result) => {
                if (result) {
                  lastScanResultRef.current = result.text;
                }
              }}
              videoConstraints={{
                facingMode: cameraFacingMode,
              }}
              onLoaded={handleVideoRef} // 👈 get video ref
            />
            <div className="button-row">
              <button className="btn toggle" onClick={toggleCameraFacingMode}>
                🔄 Switch Camera
              </button>
              <button className="btn zoom-in" onClick={handleZoomIn}>➕ Zoom In</button>
              <button className="btn zoom-out" onClick={handleZoomOut}>➖ Zoom Out</button>
              <button className="btn capture" onClick={handleCapture}>🎯 Capture Barcode</button>
              <button className="btn close" onClick={() => { setOpenCamera(false); setError(''); }}>
                ❌ Close Camera
              </button>
            </div>
            <p>🔍 Zoom Level: {zoom.toFixed(1)}x</p>
          </div>
        )}

        {error && <p className="error">{error}</p>}

        <input 
          type="text" 
          placeholder="Enter Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input 
          type="text" 
          placeholder="Scanned Item"
          value={scannedItem}
          onChange={(e) => setScannedItem(e.target.value)}
        />

        <div className="row">
          <input 
            type="number" 
            placeholder="Quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
          <input 
            type="number" 
            placeholder="Price / kg"
            value={pricePerKg}
            onChange={(e) => setPricePerKg(e.target.value)}
          />
        </div>

        <button className="btn calculate" onClick={handleCalculate}>🧮 Calculate Price</button>

        <div className="calculated-price">
          {calculatedPrice ? `✅ Total Price: ₹${calculatedPrice}` : ''}
        </div>

        <input 
          type="text" 
          placeholder="WhatsApp Number (without +91)"
          value={whatsappNumber}
          onChange={(e) => setWhatsappNumber(e.target.value)}
        />

        <button className="btn send" onClick={handleSendToDatabase}>📤 Send to Database</button>

        <button className="btn whatsapp" onClick={handleSendWhatsApp}>
          📲 Send Bill to WhatsApp
        </button>
      </div>
    </div>
  );
}

export default App;
