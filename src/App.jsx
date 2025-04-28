import { useState, useRef } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
function App() {
  const [scannedItem, setScannedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [name, setName] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [openCamera, setOpenCamera] = useState(false)
  const [error, setError] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  
  const lastScanResultRef = useRef(null);

  const handleCalculate = () => {
    const qty = parseFloat(quantity) || 0;
    const Name  = parseFloat(Name) || 0;
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
              onUpdate={(err, result) => {
                if (result) {
                  lastScanResultRef.current = result.text;
                }
              }}
            />
            <div className="button-row">
              <button className="btn capture" onClick={handleCapture}>🎯 Capture Barcode</button>
              <button className="btn close" onClick={() => { setOpenCamera(false); setError(''); }}>
                ❌ Close Camera
              </button>
            </div>
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
