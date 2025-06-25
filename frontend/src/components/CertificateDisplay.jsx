import { QRCodeSVG } from 'qrcode.react';

const CertificateDisplay = ({ certificate }) => {
  const downloadCertificate = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/certificates/${certificate.id}/download`
      );
      
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

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h1 className="text-3xl font-bold underline mb-2">CERTIFICATE</h1>
          <p className="italic">This is to certify that</p>
        </div>
        
        <div className="flex flex-col items-end">
          <QRCodeSVG 
            value={certificate.verificationUrl} 
            size={100}
            className="border border-gray-200 p-1"
          />
          <button
            onClick={downloadCertificate}
            className="mt-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm"
          >
            Download Certificate
          </button>
        </div>
      </div>

      <div className="text-center mb-8">
        <p className="text-xl font-semibold">{certificate.studentName}</p>
        <p>(ID: {certificate.idNumber})</p>
        <p className="mt-2">6th semester undergraduate student in the Department of Computer Science and Technology,</p>
        <p>Indian Institute of Engineering Science and Technology, Shibpur, Howrah, West Bengal, India</p>
      </div>

      <div className="text-center mb-8">
        <p>has successfully completed Summer Internship Program on</p>
        <p className="font-semibold">"{certificate.internshipTopic}"</p>
        <p>under the guidance of {certificate.guideName} in the Department of Computer Science and Technology,</p>
        <p>IIEST Shibpur during the period from {certificate.formattedStartDate} to {certificate.formattedEndDate}</p>
      </div>

      <div className="mt-12 text-right">
        <p className="mb-1">Dated: {certificate.formattedIssuedDate}</p>
        <p className="font-semibold">{certificate.issuerName}</p>
        <p>{certificate.issuerDesignation}</p>
        <p>Department of Computer Science and Technology</p>
        <p>IIEST Shibpur, Howrah -- 711103.</p>
      </div>

      <div className="mt-8 text-center text-sm text-gray-500">
        <p>Verify this certificate at: {certificate.verificationUrl}</p>
        <p>Scan the QR code to verify authenticity</p>
      </div>
    </div>
  );
};

export default CertificateDisplay;