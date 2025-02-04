import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import axios from 'axios';

const ReservationLetter = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await axios.get(`/api/resource/getUserBooking/${bookingId}`);
        setBooking(response.data);
      } catch (error) {
        console.error('Error fetching booking details:', error);
        setError('Error fetching booking details');
      } finally {
        setLoading(false);
      }
    };
    fetchBookingDetails();
  }, [bookingId]);

  useEffect(() => {
    if (booking) {
      generatePDF(booking);
    }
  }, [booking]);

  const generatePDF = (booking) => {
    const doc = new jsPDF();
    doc.setFont('times', 'bold');
    doc.setFontSize(18);
    doc.text('Resource Reservation Letter', 20, 20);
    doc.setFontSize(12);
    doc.setFont('times', 'normal');
    
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 150, 20);
    doc.text(`To: ${booking.user.name}`, 20, 40);
    doc.text(`Role: ${booking.userRole}`, 20, 50);
    
    doc.setFont('times', 'bold');
    doc.text('Resource Details:', 20, 65);
    doc.setFont('times', 'normal');
    doc.text(`Resource Name: ${booking.resource.name}`, 20, 75);
    doc.text(`Request Date: ${new Date(booking.requestDate).toLocaleDateString()}`, 20, 85);
    doc.text(`Taken Time: ${booking.takenTime}`, 20, 95);
    doc.text(`Handover Time: ${booking.handoverTime}`, 20, 105);
    doc.text(`Status: ${booking.status}`, 20, 115);
    
    doc.setFont('times', 'bold');
    doc.text('Terms and Conditions:', 20, 130);
    doc.setFont('times', 'normal');
    doc.text('1. The resource must be returned on or before the handover time.', 20, 140);
    doc.text('2. The user is responsible for any damages or losses incurred.', 20, 150);
    doc.text('3. The resource should be used strictly for the approved purpose.', 20, 160);
    doc.text('4. Late return of the resource may result in penalties or restrictions.', 20, 170);
    
    doc.setFont('times', 'bold');
    doc.text('Acknowledgment:', 20, 190);
    doc.setFont('times', 'normal');
    doc.text('By signing below, I confirm that I have received the resource and agree to the above conditions.', 20, 200);
    
    doc.text('_________________________', 20, 220);
    doc.text(`${booking.user.name} (Signature)`, 20, 230);
    
    const pdfDataUri = doc.output('datauristring');
    const iframe = document.getElementById('pdf-viewer');
    if (iframe) {
      iframe.src = pdfDataUri;
    }
  };

  const downloadPDF = () => {
    if (!booking) return;
    const doc = new jsPDF();
    generatePDF(booking);
    doc.save('reservation_letter.pdf');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

return (
    <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Reservation Letter</h1>
        <iframe id="pdf-viewer" title="PDF Viewer" className="w-4/5 h-[600px] border-2 border-gray-300 rounded-lg shadow-md"></iframe>
        <button
            onClick={downloadPDF}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
            Download PDF
        </button>
    </div>
);
};

export default ReservationLetter;
