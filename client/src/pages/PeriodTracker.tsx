import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
  X,
  Download,
} from "lucide-react";

interface PeriodDay {
  date: Date;
  isPeriod: boolean;
  flow: "light" | "medium" | "heavy" | null;
  symptoms: string[];
  mood: "happy" | "neutral" | "sad" | null;
  notes: string;
}

const PeriodTracker = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [periodDays, setPeriodDays] = useState<PeriodDay[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddingPeriod, setIsAddingPeriod] = useState(false);
  const [newFlow, setNewFlow] = useState<"light" | "medium" | "heavy" | null>(
    null
  );
  const [newMood, setNewMood] = useState<"happy" | "neutral" | "sad" | null>(
    null
  );
  const [newNotes, setNewNotes] = useState("");
  const [newSymptom, setNewSymptom] = useState("");

  // Calculate days in current month
  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  // Calculate first day of month
  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  // Generate calendar days
  const calendarDays: (Date | null)[] = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(
      new Date(currentDate.getFullYear(), currentDate.getMonth(), i)
    );
  }

  // Calculate cycle statistics
  const calculateCycleStatistics = () => {
    const periodDaysList = periodDays.filter((day) => day.isPeriod);
    if (periodDaysList.length < 2) {
      return {
        avgCycleLength: 0,
        avgPeriodLength: 0,
        nextPeriod: null,
      };
    }

    // Sort period days by date
    periodDaysList.sort((a, b) => a.date.getTime() - b.date.getTime());

    // Calculate average cycle length
    let totalDays = 0;
    for (let i = 1; i < periodDaysList.length; i++) {
      const days = Math.round(
        (periodDaysList[i].date.getTime() -
          periodDaysList[i - 1].date.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      totalDays += days;
    }
    const avgCycleLength = Math.round(totalDays / (periodDaysList.length - 1));

    // Calculate average period length
    const avgPeriodLength = Math.round(
      periodDaysList.length / (periodDaysList.length - 1)
    );

    // Predict next period
    const lastPeriod = periodDaysList[periodDaysList.length - 1];
    const nextPeriod = new Date(lastPeriod.date);
    nextPeriod.setDate(nextPeriod.getDate() + avgCycleLength);

    return {
      avgCycleLength,
      avgPeriodLength,
      nextPeriod,
    };
  };

  // Get statistics
  const { avgCycleLength, avgPeriodLength, nextPeriod } =
    calculateCycleStatistics();

  // Handle date selection
  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const existingDay = periodDays.find(
      (day) =>
        day.date.getDate() === date.getDate() &&
        day.date.getMonth() === date.getMonth() &&
        day.date.getFullYear() === date.getFullYear()
    );

    if (existingDay) {
      setNewFlow(existingDay.flow);
      setNewMood(existingDay.mood);
      setNewNotes(existingDay.notes);
      setIsAddingPeriod(existingDay.isPeriod);
    } else {
      setNewFlow(null);
      setNewMood(null);
      setNewNotes("");
      setIsAddingPeriod(false);
    }
  };

  // Handle period toggle
  const handlePeriodToggle = () => {
    setIsAddingPeriod(!isAddingPeriod);
    if (!isAddingPeriod) {
      setNewFlow("medium");
    } else {
      setNewFlow(null);
    }
  };

  // Handle symptom addition
  const handleAddSymptom = () => {
    if (!newSymptom.trim() || !selectedDate) return;

    const updatedDays = [...periodDays];
    const dayIndex = updatedDays.findIndex(
      (day) =>
        day.date.getDate() === selectedDate.getDate() &&
        day.date.getMonth() === selectedDate.getMonth() &&
        day.date.getFullYear() === selectedDate.getFullYear()
    );

    if (dayIndex >= 0) {
      if (!updatedDays[dayIndex].symptoms.includes(newSymptom)) {
        updatedDays[dayIndex].symptoms.push(newSymptom);
      }
    } else {
      updatedDays.push({
        date: new Date(selectedDate),
        isPeriod: isAddingPeriod,
        flow: newFlow,
        symptoms: [newSymptom],
        mood: newMood,
        notes: newNotes,
      });
    }

    setPeriodDays(updatedDays);
    setNewSymptom("");
  };

  // Handle symptom removal
  const handleRemoveSymptom = (symptom: string) => {
    if (!selectedDate) return;

    const updatedDays = [...periodDays];
    const dayIndex = updatedDays.findIndex(
      (day) =>
        day.date.getDate() === selectedDate.getDate() &&
        day.date.getMonth() === selectedDate.getMonth() &&
        day.date.getFullYear() === selectedDate.getFullYear()
    );

    if (dayIndex >= 0) {
      updatedDays[dayIndex].symptoms = updatedDays[dayIndex].symptoms.filter(
        (s) => s !== symptom
      );
      setPeriodDays(updatedDays);
    }
  };

  // Handle save day
  const handleSaveDay = () => {
    if (!selectedDate) return;

    const updatedDays = [...periodDays];
    const dayIndex = updatedDays.findIndex(
      (day) =>
        day.date.getDate() === selectedDate.getDate() &&
        day.date.getMonth() === selectedDate.getMonth() &&
        day.date.getFullYear() === selectedDate.getFullYear()
    );

    const dayData: PeriodDay = {
      date: new Date(selectedDate),
      isPeriod: isAddingPeriod,
      flow: newFlow,
      symptoms: dayIndex >= 0 ? updatedDays[dayIndex].symptoms : [],
      mood: newMood,
      notes: newNotes,
    };

    if (dayIndex >= 0) {
      updatedDays[dayIndex] = dayData;
    } else {
      updatedDays.push(dayData);
    }

    setPeriodDays(updatedDays);
    localStorage.setItem("periodDays", JSON.stringify(updatedDays));
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedPeriodDays = localStorage.getItem("periodDays");
    if (savedPeriodDays) {
      const parsedDays = JSON.parse(savedPeriodDays).map((day: any) => ({
        ...day,
        date: new Date(day.date),
      }));
      setPeriodDays(parsedDays);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-500/90 rounded-full flex items-center justify-center">
                <Calendar className="text-white" size={20} />
              </div>
              <h1 className="text-xl font-black text-pamoja-purple ">
                Period Tracker
              </h1>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const data = {
                    periodDays,
                    statistics: {
                      avgCycleLength,
                      avgPeriodLength,
                      nextPredictedPeriod: nextPeriod,
                    },
                  };
                  const dataStr = JSON.stringify(data, null, 2);
                  const dataUri =
                    "data:application/json;charset=utf-8," +
                    encodeURIComponent(dataStr);
                  const linkElement = document.createElement("a");
                  linkElement.setAttribute("href", dataUri);
                  linkElement.setAttribute(
                    "download",
                    `period-tracker-${
                      new Date().toISOString().split("T")[0]
                    }.json`
                  );
                  linkElement.click();
                }}
                className="p-2 text-gray-500 hover:text-purple-500 rounded-full hover:bg-gray-100"
                title="Export Data"
              >
                <Download size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Calendar Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-500">Calendar</h2>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() =>
                        setCurrentDate(
                          new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth() - 1,
                            1
                          )
                        )
                      }
                      className="p-2 text-gray-500 hover:text-purple-500 rounded-full hover:bg-gray-100"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <span className="font-medium">
                      {currentDate.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </span>
                    <button
                      onClick={() =>
                        setCurrentDate(
                          new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth() + 1,
                            1
                          )
                        )
                      }
                      className="p-2 text-gray-500 hover:text-purple-500 rounded-full hover:bg-gray-100"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-1 mb-2">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-sm font-medium text-gray-500"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((date, index) => {
                    if (!date) {
                      return (
                        <div key={`empty-${index}`} className="h-12"></div>
                      );
                    }

                    const dayData = periodDays.find(
                      (day) =>
                        day.date.getDate() === date.getDate() &&
                        day.date.getMonth() === date.getMonth() &&
                        day.date.getFullYear() === date.getFullYear()
                    );

                    const isToday =
                      date.getDate() === new Date().getDate() &&
                      date.getMonth() === new Date().getMonth() &&
                      date.getFullYear() === new Date().getFullYear();

                    return (
                      <button
                        key={index}
                        onClick={() => handleDateSelect(date)}
                        className={`h-12 flex items-center justify-center rounded-full relative ${
                          selectedDate &&
                          date.getDate() === selectedDate.getDate() &&
                          date.getMonth() === selectedDate.getMonth() &&
                          date.getFullYear() === selectedDate.getFullYear()
                            ? "ring-2 ring-purple-500"
                            : ""
                        } ${isToday ? "font-bold" : ""}`}
                      >
                        <span className={isToday ? "text-purple-500" : ""}>
                          {date.getDate()}
                        </span>

                        {dayData?.isPeriod && (
                          <div
                            className={`absolute bottom-1 w-1.5 h-1.5 rounded-full ${
                              dayData.flow === "light"
                                ? "bg-purple-200"
                                : dayData.flow === "medium"
                                ? "bg-purple-400"
                                : "bg-purple-500"
                            }`}
                          ></div>
                        )}

                        {dayData?.mood && (
                          <div className="absolute top-1 right-1 text-xs">
                            {dayData.mood === "happy"
                              ? "😊"
                              : dayData.mood === "neutral"
                              ? "😐"
                              : "😔"}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div>
            <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
              <div className="p-6">
                <h2 className="text-xl font-bold text-gray-500 mb-4">
                  Cycle Statistics
                </h2>

                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Average Cycle Length</span>
                    <span className="font-medium">
                      {avgCycleLength > 0
                        ? `${avgCycleLength} days`
                        : "Not enough data"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Average Period Length</span>
                    <span className="font-medium">
                      {avgPeriodLength > 0
                        ? `${avgPeriodLength} days`
                        : "Not enough data"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-gray-500">Next Predicted Period</span>
                    <span className="font-medium">
                      {nextPeriod
                        ? nextPeriod.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })
                        : "Not enough data"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Day Details Section */}
        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-xl shadow-md overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-500">
                  {selectedDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </h2>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <span className="text-gray-500">Period Day:</span>
                  <button
                    onClick={handlePeriodToggle}
                    className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                      isAddingPeriod
                        ? "bg-purple-500 text-white"
                        : "bg-gray-100 text-gray-500"
                    }`}
                  >
                    {isAddingPeriod ? <Check size={18} /> : <X size={18} />}
                    <span>{isAddingPeriod ? "Yes" : "No"}</span>
                  </button>
                </div>

                {isAddingPeriod && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-500 mb-2">
                        Flow Intensity
                      </label>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setNewFlow("light")}
                          className={`px-4 py-2 rounded-lg ${
                            newFlow === "light"
                              ? "bg-purple-200 text-purple-500"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          Light
                        </button>
                        <button
                          onClick={() => setNewFlow("medium")}
                          className={`px-4 py-2 rounded-lg ${
                            newFlow === "medium"
                              ? "bg-purple-400 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          Medium
                        </button>
                        <button
                          onClick={() => setNewFlow("heavy")}
                          className={`px-4 py-2 rounded-lg ${
                            newFlow === "heavy"
                              ? "bg-purple-500 text-white"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          Heavy
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Mood
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setNewMood("happy")}
                      className={`px-4 py-2 rounded-lg ${
                        newMood === "happy"
                          ? "bg-green-100 text-green-500"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      😊 Happy
                    </button>
                    <button
                      onClick={() => setNewMood("neutral")}
                      className={`px-4 py-2 rounded-lg ${
                        newMood === "neutral"
                          ? "bg-purple-100 text-purple-500"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      😐 Neutral
                    </button>
                    <button
                      onClick={() => setNewMood("sad")}
                      className={`px-4 py-2 rounded-lg ${
                        newMood === "sad"
                          ? "bg-blue-100 text-blue-500"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      😔 Sad
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Symptoms
                  </label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {periodDays
                      .find(
                        (day) =>
                          day.date.getDate() === selectedDate.getDate() &&
                          day.date.getMonth() === selectedDate.getMonth() &&
                          day.date.getFullYear() === selectedDate.getFullYear()
                      )
                      ?.symptoms.map((symptom, index) => (
                        <div
                          key={index}
                          className="bg-purple-100 text-purple-500 px-3 py-1 rounded-full text-sm flex items-center gap-1"
                        >
                          <span>{symptom}</span>
                          <button
                            onClick={() => handleRemoveSymptom(symptom)}
                            className="text-purple-500 hover:text-purple-500"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newSymptom}
                      onChange={(e) => setNewSymptom(e.target.value)}
                      placeholder="Add a symptom..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddSymptom}
                      disabled={!newSymptom.trim()}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      <Plus size={20} />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Notes
                  </label>
                  <textarea
                    value={newNotes}
                    onChange={(e) => setNewNotes(e.target.value)}
                    placeholder="Add notes for this day..."
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveDay}
                    className="bg-purple-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-500 transition-colors"
                  >
                    Save
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default PeriodTracker;
