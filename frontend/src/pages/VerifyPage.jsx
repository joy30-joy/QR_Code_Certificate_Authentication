import VerificationResult from '../components/VerificationResult';
import { Toaster } from 'react-hot-toast';

const VerifyPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <Toaster position="top-center" />
      <VerificationResult />
    </div>
  );
};

export default VerifyPage;