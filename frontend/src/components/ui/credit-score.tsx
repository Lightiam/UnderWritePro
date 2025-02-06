'use client';

interface CreditScoreProps {
  score: number;
  details: string;
}

export function CreditScore({ score, details }: CreditScoreProps) {
  return (
    <div className="chat-score-card">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold text-gray-900">Credit Score Analysis</h3>
        <span className={`px-3 py-1 text-sm rounded-full font-medium ${
          score >= 700 ? 'bg-green-100 text-green-700' : 
          score >= 650 ? 'bg-blue-100 text-blue-700' :
          score >= 600 ? 'bg-yellow-100 text-yellow-700' : 
          'bg-red-100 text-red-700'
        }`}>
          {score >= 700 ? 'Excellent' : 
           score >= 650 ? 'Good' :
           score >= 600 ? 'Fair' : 'Poor'}
        </span>
      </div>
      <div className="flex items-center gap-4 mb-6">
        <div className="chat-score-value">
          {Math.round(score)}
        </div>
        <div className="text-sm text-gray-500">
          Credit Score Range: 300-850
        </div>
      </div>
      <div className="text-sm text-gray-700 whitespace-pre-line">
        {details}
      </div>
    </div>
  );
}
