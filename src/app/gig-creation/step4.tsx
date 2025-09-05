import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';

interface ScreeningQuestion {
  id: string;
  question: string;
}

export default function GigCreationStep4() {
  const [questions, setQuestions] = useState<ScreeningQuestion[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Load data from session storage
    const loadStepData = () => {
      try {
        const savedData = sessionStorage.getItem('gigCreationData');
        if (savedData) {
          const data = JSON.parse(savedData);
          if (data.screeningQuestions) {
            setQuestions(data.screeningQuestions);
          }
        }
      } catch (error) {
        console.error('Error loading step data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadStepData();
  }, []);

  const addQuestion = () => {
    if (newQuestion.trim() === '') return;
    
    const question: ScreeningQuestion = {
      id: Math.random().toString(36).substr(2, 9),
      question: newQuestion.trim()
    };
    
    setQuestions(prev => [...prev, question]);
    setNewQuestion('');
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, question: string) => {
    setQuestions(prev => 
      prev.map(q => q.id === id ? { ...q, question } : q)
    );
  };

  const isValid = true; // Screening questions are optional

  const handleContinue = () => {
    // Update session storage with step 4 data
    const savedData = sessionStorage.getItem('gigCreationData');
    const data = savedData ? JSON.parse(savedData) : {};
    
    const updatedData = {
      ...data,
      screeningQuestions: questions
    };
    
    sessionStorage.setItem('gigCreationData', JSON.stringify(updatedData));
    navigate('/gig-creation/step5');
  };

  const handleBack = () => {
    navigate('/gig-creation/step3');
  };

  const handleSkip = () => {
    navigate('/gig-creation/step5');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </button>
            <div className="text-2xl font-bold text-[#012E46]">GigExecs</div>
            <div className="ml-auto text-sm text-slate-500">Step 4 of 5</div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4">
            Screening Questions
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Specify any questions that you would like responders to answer to assist you in screening potential candidates for your Gig.
          </p>
        </div>

        <Card className="max-w-2xl mx-auto">
          <CardContent className="p-6 sm:p-8">
            <div className="space-y-6">
              {/* Add New Question */}
              <div>
                <Label className="text-lg font-semibold text-slate-900">
                  Add Screening Questions (Optional)
                </Label>
                <p className="text-sm text-slate-600 mt-1 mb-4">
                  Help professionals understand your requirements better and filter responses
                </p>

                <div className="flex gap-2">
                  <Textarea
                    placeholder="e.g., What is your experience with React Native? How would you approach mobile app performance optimization?"
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    className="flex-1 min-h-[80px]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && e.ctrlKey) {
                        e.preventDefault();
                        addQuestion();
                      }
                    }}
                  />
                  <Button
                    onClick={addQuestion}
                    disabled={newQuestion.trim() === ''}
                    className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Press Ctrl+Enter to add question quickly
                </p>
              </div>

              {/* Questions List */}
              {questions.length > 0 && (
                <div className="space-y-3">
                  <h3 className="font-semibold text-slate-900">
                    Your Screening Questions ({questions.length})
                  </h3>
                  {questions.map((question, index) => (
                    <div
                      key={question.id}
                      className="flex items-start gap-3 p-4 bg-slate-50 rounded-lg border"
                    >
                      <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <Textarea
                          value={question.question}
                          onChange={(e) => updateQuestion(question.id, e.target.value)}
                          className="min-h-[60px] bg-white border-slate-200"
                          placeholder="Enter your question..."
                        />
                      </div>
                      <button
                        onClick={() => removeQuestion(question.id)}
                        className="flex-shrink-0 p-1 hover:bg-slate-200 rounded text-slate-500"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Guidelines */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">Question Guidelines</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Ask about specific technical skills or experience</li>
                  <li>• Inquire about their approach to similar projects</li>
                  <li>• Request examples of relevant work or case studies</li>
                  <li>• Ask about availability and timeline expectations</li>
                  <li>• Keep questions clear and specific to your project needs</li>
                </ul>
              </div>

              {/* Example Questions */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4">
                <h3 className="font-semibold text-slate-900 mb-2">Example Questions</h3>
                <div className="text-sm text-slate-700 space-y-2">
                  <p>• "What is your experience with [specific technology]?"</p>
                  <p>• "How would you approach [specific challenge] in this project?"</p>
                  <p>• "Can you provide examples of similar projects you've completed?"</p>
                  <p>• "What is your estimated timeline for this project?"</p>
                  <p>• "Do you have any questions about the project requirements?"</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mt-8 pt-6 border-t border-slate-200">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                Back to Attachments
              </Button>
              <Button
                onClick={handleSkip}
                variant="outline"
                className="flex-1 sm:flex-none"
              >
                Skip Questions
              </Button>
              <Button
                onClick={handleContinue}
                disabled={!isValid}
                className="flex-1 sm:flex-none bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Continue to Review
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
