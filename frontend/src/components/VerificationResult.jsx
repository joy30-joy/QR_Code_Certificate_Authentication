import { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { QRCodeSVG } from 'qrcode.react';

const VerificationResult = () => {
  const { id } = useParams();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyCertificate = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/certificates/${id}`);
        setCertificate(response.data.certificate);
      } catch (err) {
        toast.error(err.response?.data?.message || 'Certificate verification failed');
      } finally {
        setLoading(false);
      }
    };

    verifyCertificate();
  }, [id]);

  const downloadCertificate = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/certificates/${id}/download`);
      
      if (!response.ok) {
        throw new Error('Failed to download certificate');
      }
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `certificate-${certificate.idNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download certificate');
    }
  };

  if (loading) return <div className="text-center py-8">Verifying certificate...</div>;
  if (!certificate) return <div className="text-center py-8 text-red-600">Certificate not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6 border border-green-200">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-bold text-green-700">Certificate Verified</h1>
          <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
            Authentic
          </div>
        </div>

        <div className="mb-6 p-4 bg-gray-50 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Certificate Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p><span className="font-medium">Student Name:</span> {certificate.studentName}</p>
              <p><span className="font-medium">ID Number:</span> {certificate.idNumber}</p>
              <p><span className="font-medium">Department:</span> Computer Science and Technology</p>
            </div>
            <div>
              <p><span className="font-medium">Internship Topic:</span> {certificate.internshipTopic}</p>
              <p><span className="font-medium">Period:</span> {certificate.formattedStartDate} to {certificate.formattedEndDate}</p>
              <p><span className="font-medium">Issued On:</span> {certificate.formattedIssuedDate}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">Original Certificate Preview</h3>
            <button
              onClick={downloadCertificate}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
            >
              Download Certificate
            </button>
          </div>
          
          <div className="border border-gray-200 p-4 rounded-lg">
            <div className="flex justify-between items-start mb-4">
              <div>
                <p className="text-center text-xl font-bold underline mb-2">CERTIFICATE</p>
                <p className="italic text-center">This is to certify that</p>
              </div>
              <QRCodeSVG 
                value={certificate.verificationUrl} 
                size={80}
                className="border border-gray-200 p-1"
              />
            </div>
            
            <div className="text-center mb-4">
              <p className="font-semibold">{certificate.studentName}</p>
              <p>(ID: {certificate.idNumber})</p>
              <p>6th semester undergraduate student in the Department of Computer Science and Technology,</p>
              <p>Indian Institute of Engineering Science and Technology, Shibpur, Howrah, West Bengal, India</p>
            </div>
            
            <div className="text-center mb-4">
              <p>has successfully completed Summer Internship Program on</p>
              <p className="font-semibold">"{certificate.internshipTopic}"</p>
              <p>under the guidance of {certificate.guideName} in the Department of Computer Science and Technology,</p>
              <p>IIEST Shibpur during the period from {certificate.formattedStartDate} to {certificate.formattedEndDate}</p>
            </div>
            
            <div className="text-right mt-8">
              <p>Dated: {certificate.formattedIssuedDate}</p>
              <p className="font-semibold">{certificate.issuerName}</p>
              <p>{certificate.issuerDesignation}</p>
              <p>Department of Computer Science and Technology</p>
              <p>IIEST Shibpur, Howrah -- 711103.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationResult;