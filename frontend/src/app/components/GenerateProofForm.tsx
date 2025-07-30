"use client";

import { useState, ReactElement } from "react";
import { Card } from "./Card";
import { Button } from "./Button";

import { generateProof } from "../services/generateProof";

interface GenerateProofFormProps {
  onProofGenerated: (proofData: any) => void;
}

// Componente de calendário customizado
const DatePicker = ({ 
  value, 
  onChange, 
  maxDate 
}: { 
  value: string; 
  onChange: (date: string) => void; 
  maxDate: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(value ? new Date(value) : new Date());
  const [showYearSelector, setShowYearSelector] = useState(false);
  const [showMonthSelector, setShowMonthSelector] = useState(false);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const isDateDisabled = (date: Date) => {
    const currentYear = new Date().getFullYear();
    const age = currentYear - date.getFullYear();
    // Disable dates that would result in age < 18 or age > 100
    return age < 18 || age > 100;
  };

  const handleDateSelect = (day: number) => {
    const selectedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    onChange(formatDate(selectedDate));
    setIsOpen(false);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };





  const selectYear = (year: number) => {
    setCurrentDate(new Date(year, currentDate.getMonth(), 1));
    setShowYearSelector(false);
  };

  const selectMonth = (month: number) => {
    setCurrentDate(new Date(currentDate.getFullYear(), month, 1));
    setShowMonthSelector(false);
  };

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const MonthSelector = () => {
    return (
      <div className="absolute bottom-full left-0 right-0 mb-1 bg-black border border-gray-700 rounded p-4 z-20">
        <div className="flex items-center justify-between mb-4">
          <div className="text-white font-mono text-sm">Select Month</div>
          <button
            onClick={() => setShowMonthSelector(false)}
            className="text-white hover:text-gray-300 text-sm"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {months.map((month, index) => (
            <button
              key={month}
              onClick={() => selectMonth(index)}
              className={`
                p-2 rounded text-xs font-mono transition-all
                ${index === currentDate.getMonth()
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-gray-700'
                }
              `}
            >
              {month}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const YearSelector = () => {
    const currentYear = currentDate.getFullYear();
    const years: number[] = [];
    
    // Gera anos de 1900 até o ano atual + 10
    for (let year = 1900; year <= new Date().getFullYear() + 10; year++) {
      years.push(year);
    }

    return (
      <div className="absolute bottom-full left-0 right-0 mb-1 bg-black border border-gray-700 rounded p-4 z-20 max-h-64 overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="text-white font-mono text-sm">Select Year</div>
          <button
            onClick={() => setShowYearSelector(false)}
            className="text-white hover:text-gray-300 text-sm"
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          {years.map(year => (
            <button
              key={year}
              onClick={() => selectYear(year)}
              className={`
                p-2 rounded text-xs font-mono transition-all
                ${year === currentYear
                  ? 'bg-white text-black'
                  : 'text-white hover:bg-gray-700'
                }
              `}
            >
              {year}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const calendarDays: ReactElement[] = [];

    // Dias vazios no início
    for (let i = 0; i < firstDay; i++) {
      calendarDays.push(<div key={`empty-${i}`} className="h-8"></div>);
    }

         // Dias do mês
     for (let day = 1; day <= daysInMonth; day++) {
       const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
       const isSelected = value === formatDate(date);
       const isDisabled = isDateDisabled(date);
      
             calendarDays.push(
         <button
           key={day}
           onClick={() => !isDisabled && handleDateSelect(day)}
           disabled={isDisabled}
           className={`
             h-8 w-8 rounded text-xs font-mono transition-all
             ${isSelected
               ? 'bg-white text-black'
               : isDisabled
               ? 'text-gray-600 cursor-not-allowed'
               : 'text-white hover:bg-gray-700'
             }
           `}
         >
           {day}
         </button>
       );
    }

    return calendarDays;
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-3 bg-black border border-gray-700 rounded text-left text-white font-mono text-sm hover:border-gray-500 transition-colors"
      >
        {value ? (() => {
          const [year, month, day] = value.split('-').map(Number);
          const date = new Date(year, month - 1, day);
          return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        })() : 'Select your birth date'}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-black border border-gray-700 rounded p-4 z-10">
                                 {/* Header do calendário */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={previousMonth}
                className="text-white hover:text-gray-300 text-sm"
              >
                ←
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowMonthSelector(!showMonthSelector)}
                  className="text-white font-mono text-sm hover:text-gray-300 border-b border-gray-500"
                >
                  {months[currentDate.getMonth()]}
                </button>
                <button
                  onClick={() => setShowYearSelector(!showYearSelector)}
                  className="text-white font-mono text-sm hover:text-gray-300 border-b border-gray-500"
                >
                  {currentDate.getFullYear()}
                </button>
              </div>
              <button
                onClick={nextMonth}
                className="text-white hover:text-gray-300 text-sm"
              >
                →
              </button>
            </div>

            {showMonthSelector && <MonthSelector />}
            {showYearSelector && <YearSelector />}

          {/* Dias da semana */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map(day => (
              <div key={day} className="text-xs text-gray-500 font-mono text-center h-8 flex items-center justify-center">
                {day}
              </div>
            ))}
          </div>

          {/* Calendário */}
          <div className="grid grid-cols-7 gap-1">
            {renderCalendar()}
          </div>

          {/* Botão de fechar */}
          <div className="mt-4 pt-4 border-t border-gray-700">
            <Button
              onClick={() => setIsOpen(false)}
              className="w-full text-xs py-2"
            >
              CLOSE
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export const GenerateProofForm = ({
  onProofGenerated,
}: GenerateProofFormProps) => {
  const [birthDate, setBirthDate] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressText, setProgressText] = useState("");
  const [error, setError] = useState("");

  const handleGenerateProof = async () => {
    if (!birthDate) {
      return;
    }

    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();

    // Validate age constraints before generating proof
    if (age < 18) {
      setError("You must be at least 18 years old to generate a proof.");
      return;
    }

    if (age > 100) {
      setError("Age must be 100 years or less to generate a proof.");
      return;
    }

    setIsGenerating(true);
    setProgress(0);
    setProgressText("Setting up session...");
    setError("");

    let progressInterval: NodeJS.Timeout | null = null;
    
    try {
      const birthYear = birth.getFullYear();

      const progressUpdates = [
        { progress: 12, text: "Loading circuit..." },
        { progress: 25, text: "Generating witness..." },
        { progress: 37, text: "Generating cryptographic proof..." },
        { progress: 50, text: "Generating verification key..." },
        { progress: 62, text: "Verifying proof locally..." },
        { progress: 75, text: "Submitting to blockchain..." },
        { progress: 87, text: "Finalizing transaction..." },
        { progress: 100, text: "Proof generated successfully!" },
      ];

      let currentStep = 0;
      progressInterval = setInterval(() => {
        if (currentStep < progressUpdates.length) {
          const update = progressUpdates[currentStep];
          setProgress(update.progress);
          setProgressText(update.text);
          currentStep++;
        }
      }, 1000);

      const result = await generateProof(birthYear);

      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setProgress(100);
      setProgressText("Proof generated successfully!");

      const proofData = {
        nullifier:
          "0x" +
          Array.from({ length: 8 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join("") +
          "...abcd",
        proofHash:
          "0x" +
          Array.from({ length: 64 }, () =>
            Math.floor(Math.random() * 16).toString(16)
          ).join(""),
        verifiedDate: new Date().toISOString().split("T")[0],
        walletAddress: "UQB...7x2f",
        birthYear,
      };

      setTimeout(() => {
        setIsGenerating(false);
        onProofGenerated(proofData);
      }, 1000);
    } catch (error: any) {
      if (progressInterval) {
        clearInterval(progressInterval);
      }
      setIsGenerating(false);
      setError(error.message || "An unexpected error occurred");
    }
  };

  const eighteenYearsAgo = new Date();
  eighteenYearsAgo.setFullYear(eighteenYearsAgo.getFullYear() - 18);

  return (
    <Card>
      <div className="text-base font-medium mb-3">Generate Age Proof</div>
      <div className="text-sm text-gray-400 leading-relaxed mb-5">
        Select your birth date to generate a zero-knowledge age proof. You must be between 18 and 100 years old to proceed.
      </div>

      <div className="mb-5">
        <label
          htmlFor="birthDate"
          className="block text-xs text-white mb-2 uppercase tracking-wider"
        >
          Birth Date
        </label>

        <DatePicker
          value={birthDate}
          onChange={setBirthDate}
          maxDate={eighteenYearsAgo.toISOString().split("T")[0]}
        />
      </div>

      <Button onClick={handleGenerateProof} disabled={isGenerating}>
        {isGenerating ? "GENERATING..." : "GENERATE ZK PROOF"}
      </Button>

      {isGenerating && (
        <div className="mt-5">
          <div className="w-full h-0.5 bg-gray-700 rounded overflow-hidden">
            <div
              className="h-full bg-white transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="text-xs text-gray-500 mt-2 text-center">
            {progressText}
          </div>
        </div>
      )}

      {error && (
        <div className="mt-5 p-3 bg-red-900/20 border border-red-700 rounded">
          <div className="text-red-400 text-sm font-mono">
            Error: {error}
          </div>
        </div>
      )}
    </Card>
  );
};
