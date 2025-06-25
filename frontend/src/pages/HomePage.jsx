import { useState } from 'react';
import CertificateForm from '../components/CertificateForm';
import CertificateDisplay from '../components/CertificateDisplay';
import { Toaster } from 'react-hot-toast';

const HomePage = () => {
  const [certificate, setCertificate] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <Toaster position="top-center" />
      {!certificate ? (
        <CertificateForm onCertificateGenerated={setCertificate} />
      ) : (
        <div className="space-y-6">
          <CertificateDisplay certificate={certificate} />
          <div className="text-center">
            <button
              onClick={() => setCertificate(null)}
              className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Generate Another Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HomePage;