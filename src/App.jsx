import { useState, useRef, useEffect } from 'react';
import BarcodeScannerComponent from "react-qr-barcode-scanner";
import { jsPDF } from "jspdf";
import autoTable from 'jspdf-autotable'; // import autoTable for table support

function App() {
  const [scannedItem, setScannedItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [name, setName] = useState('');
  const [pricePerKg, setPricePerKg] = useState('');
  const [calculatedPrice, setCalculatedPrice] = useState(0);
  const [openCamera, setOpenCamera] = useState(false);
  const [error, setError] = useState('');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [zoom, setZoom] = useState(1);

  const lastScanResultRef = useRef(null);
  const videoRef = useRef(null);

  const handleCalculate = () => {
    const qty = parseFloat(quantity) || 0;
    const price = parseFloat(pricePerKg) || 0;
    setCalculatedPrice(qty * price);
  };

  // PDF generation with table
  const generatePDF = () => {
    const doc = new jsPDF();
    
    // Set document properties
    doc.setProperties({
      title: 'Invoice',
      subject: 'Product Purchase',
      author: 'Your Company Name',
      keywords: 'invoice, bill, purchase',
      creator: 'Your Company Name'
    });

    // Add company logo and header
    doc.setFontSize(24);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);
    doc.text("Your Company Name", 14, 20);
    
    // Add company details
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("123 Business Street", 14, 30);
    doc.text("City, State - 123456", 14, 35);
    doc.text("Phone: +91 1234567890", 14, 40);
    doc.text("Email: contact@company.com", 14, 45);

    // Add invoice details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", 150, 20, { align: "right" });
    doc.setFont("helvetica", "normal");
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 30, { align: "right" });
    doc.text(`Invoice #: ${Math.floor(Math.random() * 10000)}`, 150, 35, { align: "right" });

    // Add customer details
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("Bill To:", 14, 60);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${name}`, 14, 70);

    // Table styling
    const tableStyles = {
      headStyles: {
        fillColor: [41, 128, 185],
        textColor: 255,
        fontStyle: 'bold',
        halign: 'center'
      },
      bodyStyles: {
        textColor: 50,
        halign: 'center'
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245]
      },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
        3: { cellWidth: 40 }
      },
      margin: { top: 80 }
    };

    // Table data
    const qty = parseFloat(quantity) || 0;
    const unitPrice = parseFloat(pricePerKg) || 0;
    const totalPrice = qty * unitPrice;

    autoTable(doc, {
      ...tableStyles,
      head: [["Product", "Quantity", "Unit Price", "Total"]],
      body: [
        [scannedItem, qty.toString(), `₹${unitPrice.toFixed(2)}`, `₹${totalPrice.toFixed(2)}`],
      ],
    });

    // Add totals section
    const finalY = doc.lastAutoTable.finalY + 10;
    doc.setFont("helvetica", "bold");
    doc.text("Total Amount:", 120, finalY, { align: "right" });
    doc.text(`₹${totalPrice.toFixed(2)}`, 150, finalY, { align: "right" });

    // Add payment terms
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text("Payment Terms: Due upon receipt", 14, finalY + 10);
    doc.text("Thank you for your business!", 14, finalY + 20);

    // Add footer
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text("This is a computer generated invoice", 14, 280);
    doc.text("© 2024 Your Company Name. All rights reserved.", 14, 285);

    // Save the PDF
    doc.save("invoice.pdf");
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

  // Other functions for camera and zoom ...

  return (
    <div className="container">
      <h2>📦 Scan & Add Product</h2>

      <div className="card">
        {/* Camera and Barcode Scanner Section */}
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
              <button className="btn capture" onClick={() => { setScannedItem(lastScanResultRef.current); setOpenCamera(false); }}>
                🎯 Capture Barcode
              </button>
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

        <button className="btn pdf" onClick={generatePDF}>💾 Download PDF</button>

        <button className="btn whatsapp" onClick={handleSendWhatsApp}>
          📲 Send Bill to WhatsApp
        </button>
      </div>
    </div>
  );
}

export default App;
