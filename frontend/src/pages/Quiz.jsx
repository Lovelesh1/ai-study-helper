import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-toastify";

function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [quiz, setQuiz] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await api.get(`/ai/quiz/${id}`, {
          headers: { Authorization: token },
        });

        if (Array.isArray(res.data.quiz)) {
          setQuiz(res.data.quiz);
        } else {
          setQuiz([]);
        }
      } catch (error) {
       toast.error(error.response?.data?.message || "Failed to load quiz");
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [id, token]);

  const handleOptionSelect = (questionIndex, option) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionIndex]: option,
    }));
  };

  const calculateScore = () => {
    let score = 0;
    quiz.forEach((item, index) => {
      if (selectedAnswers[index] === item.answer) score += 1;
    });
    return score;
  };
  const getScoreLabel = () => {
  const score = calculateScore();

  if (score === quiz.length) return "Excellent";
  if (score >= Math.ceil(quiz.length * 0.7)) return "Good";
  if (score >= Math.ceil(quiz.length * 0.4)) return "Average";
  return "Try Again";
};

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto bg-white/5 border border-white/10 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={() => navigate("/dashboard")}
          className="mb-4 bg-slate-700 hover:bg-slate-600 px-4 py-2 rounded-lg"
        >
          Back
        </button>

        <h1 className="text-3xl font-bold mb-6">AI Quiz</h1>

        {loading ? (
          <p className="text-slate-400">Loading quiz...</p>
        ) : quiz.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-white/10 bg-white/5 p-8 text-center">
  <p className="text-lg font-medium text-white">No quiz available</p>
  <p className="mt-2 text-sm text-slate-400">
    Try again later or generate quiz from another note.
  </p>
</div>
        ) : (
          <>
            <div className="space-y-6">
              {quiz.map((item, index) => (
                <div
                  key={index}
                  className="bg-slate-900 border border-white/10 rounded-xl p-5"
                >
                  <h2 className="font-semibold mb-4 text-lg">
                    {index + 1}. {item.question}
                  </h2>

                  <div className="space-y-3">
                    {item.options.map((option, i) => {
                      const isSelected = selectedAnswers[index] === option;
                      const isCorrect = showScore && option === item.answer;
                      const isWrong =
                        showScore && isSelected && option !== item.answer;

                      return (
                        <button
                          key={i}
                          type="button"
                          onClick={() => handleOptionSelect(index, option)}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition
                            ${isCorrect ? "bg-green-600/30 border-green-500" : ""}
                            ${isWrong ? "bg-red-600/30 border-red-500" : ""}
                            ${
                              !isCorrect && !isWrong && isSelected
                                ? "bg-blue-600/30 border-blue-500"
                                : "bg-white/5 border-white/10 hover:bg-white/10"
                            }`}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {showScore && (
                    <p className="mt-4 text-sm text-slate-300">
                      Correct answer: <span className="font-semibold">{item.answer}</span>
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => setShowScore(true)}
                className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold"
              >
                Submit Quiz
              </button>

              <button
                onClick={() => {
                  setSelectedAnswers({});
                  setShowScore(false);
                }}
                className="bg-slate-700 hover:bg-slate-600 px-6 py-3 rounded-xl font-semibold"
              >
                Reset
              </button>
            </div>

            {showScore && (
  <div className="mt-6 bg-white/5 border border-white/10 rounded-2xl p-5">
    <h3 className="text-2xl font-bold mb-3">
      Score: {calculateScore()} / {quiz.length}
    </h3>

    <span
      className={`inline-block px-4 py-2 rounded-full text-sm font-semibold
        ${
          getScoreLabel() === "Excellent"
            ? "bg-emerald-500/20 text-emerald-400"
            : getScoreLabel() === "Good"
            ? "bg-blue-500/20 text-blue-400"
            : getScoreLabel() === "Average"
            ? "bg-yellow-500/20 text-yellow-400"
            : "bg-red-500/20 text-red-400"
        }`}
    >
      {getScoreLabel()}
    </span>
  </div>
)}
          </>
        )}
      </div>
    </div>
  );
}

export default Quiz;