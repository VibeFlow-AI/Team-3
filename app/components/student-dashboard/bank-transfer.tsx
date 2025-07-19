"use client";

interface BankTransferProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => void;
  tutorName: string;
  selectedDate: number | null;
  selectedTime: string | null;
}

export default function BankTransfer({ 
  isOpen, 
  onClose, 
  onComplete, 
  tutorName, 
  selectedDate, 
  selectedTime 
}: BankTransferProps) {
  
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('Bank transfer file uploaded:', file.name);
    }
  };

  const handleComplete = () => {
    console.log(`Bank transfer completed for session with ${tutorName} on July ${selectedDate}, 2025 at ${selectedTime}`);
    onComplete();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 relative shadow-2xl border">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <h2 className="text-xl font-semibold mb-6">Bank Transfer</h2>

        <div className="mb-6">
          <p className="text-gray-600 text-sm mb-4">
            Session with <span className="font-medium">{tutorName}</span>
          </p>
          <p className="text-gray-600 text-sm mb-4">
            Date: <span className="font-medium">July {selectedDate}, 2025</span>
          </p>
          <p className="text-gray-600 text-sm mb-6">
            Time: <span className="font-medium">{selectedTime}</span>
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Upload Bank Transfer Receipt
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center relative">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p className="text-gray-600 text-sm mb-2">Click to upload or drag and drop</p>
            <p className="text-gray-400 text-xs">PNG, JPG, PDF up to 10MB</p>
            <input
              type="file"
              accept=".png,.jpg,.jpeg,.pdf"
              onChange={handleFileUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="py-3 px-6 text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button 
            onClick={handleComplete}
            className="py-3 px-6 bg-black text-white rounded-md hover:bg-gray-800 font-medium"
          >
            Complete Booking
          </button>
        </div>
      </div>
    </div>
  );
}
