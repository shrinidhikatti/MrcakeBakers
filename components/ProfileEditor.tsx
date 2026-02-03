"use client";

import { useState, useEffect } from "react";
import { Gift, Plus, Trash2, Heart, Loader2 } from "lucide-react";

interface SpecialDay {
  id: string;
  name: string;
  date: string;
  type: string;
  relationship: string;
}

const RELATIONSHIPS = [
  "Mother", "Father", "Brother", "Sister", "Wife", "Husband",
  "Son", "Daughter", "Grandparent", "Uncle", "Aunt", "Friend", "Other",
];

function formatDate(mmdd: string) {
  const [month, day] = mmdd.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return `${months[month - 1]} ${day}`;
}

export default function ProfileEditor() {
  const [birthday, setBirthday] = useState("");
  const [birthdaySaved, setBirthdaySaved] = useState(false);
  const [specialDays, setSpecialDays] = useState<SpecialDay[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newDay, setNewDay] = useState({ name: "", date: "", type: "BIRTHDAY", relationship: "Mother" });

  useEffect(() => {
    fetch("/api/profile")
      .then((res) => res.json())
      .then((data) => {
        // Prepend placeholder year so <input type="date"> can display it
        setBirthday(data.birthday ? `2000-${data.birthday}` : "");
        setSpecialDays(data.specialDays || []);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const saveBirthday = async () => {
    setSaving(true);
    const mmdd = birthday ? birthday.slice(5) : null; // YYYY-MM-DD → MM-DD
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ birthday: mmdd }),
    });
    if (res.ok) setBirthdaySaved(true);
    setSaving(false);
    setTimeout(() => setBirthdaySaved(false), 2500);
  };

  const addSpecialDay = async () => {
    if (!newDay.name || !newDay.date) return;
    const mmdd = newDay.date.slice(5);
    const res = await fetch("/api/profile/special-days", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newDay.name, date: mmdd, type: newDay.type, relationship: newDay.relationship }),
    });
    if (res.ok) {
      const created = await res.json();
      setSpecialDays((prev) => [...prev, created]);
      setNewDay({ name: "", date: "", type: "BIRTHDAY", relationship: "Mother" });
      setShowForm(false);
    }
  };

  const deleteSpecialDay = async (id: string) => {
    const res = await fetch(`/api/profile/special-days/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSpecialDays((prev) => prev.filter((d) => d.id !== id));
    }
  };

  if (loading) {
    return (
      <div className="space-y-4 mt-6">
        <div className="animate-pulse bg-slate-100 rounded-lg h-28"></div>
        <div className="animate-pulse bg-slate-100 rounded-lg h-44"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Birthday */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-bakery-chocolate mb-3 flex items-center gap-2">
          <Gift className="h-5 w-5 text-primary-600" />
          Your Birthday
        </h3>
        <div className="flex items-end gap-3 flex-wrap">
          <div className="flex-1" style={{ minWidth: 200 }}>
            <input
              type="date"
              className="input"
              value={birthday}
              onChange={(e) => { setBirthday(e.target.value); setBirthdaySaved(false); }}
            />
          </div>
          <button
            onClick={saveBirthday}
            disabled={saving || birthdaySaved}
            className={`btn-primary flex items-center gap-1 ${birthdaySaved ? "!bg-green-600" : ""}`}
          >
            {saving ? (
              <><Loader2 className="animate-spin h-4 w-4" /> Saving...</>
            ) : birthdaySaved ? (
              "Saved ✓"
            ) : (
              "Save"
            )}
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          We'll send you a special wish on your birthday! 🎂
        </p>
      </div>

      {/* Special Days */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-semibold text-bakery-chocolate mb-2 flex items-center gap-2">
          <Heart className="h-5 w-5 text-pink-500" />
          Loved Ones' Special Days
        </h3>

        {/* Disclaimer */}
        <div className="bg-pink-50 border border-pink-200 rounded-lg p-3 mb-4">
          <p className="text-sm text-pink-700">
            💝 You may forget, but we never forget! We'll remind you about your loved
            ones' birthdays and anniversaries — never miss a chance to celebrate with a
            sweet treat from Mr.Cake!
          </p>
        </div>

        {/* Existing entries */}
        {specialDays.length > 0 && (
          <div className="space-y-2 mb-4">
            {specialDays.map((day) => (
              <div
                key={day.id}
                className="flex items-center justify-between bg-slate-50 border border-slate-200 rounded-lg px-4 py-3"
              >
                <div>
                  <p className="font-medium text-bakery-chocolate">{day.name}</p>
                  <p className="text-sm text-gray-500">
                    {day.relationship} &middot; {day.type === "BIRTHDAY" ? "🎂 Birthday" : day.type === "ANNIVERSARY" ? "💐 Anniversary" : "🌟 Other"} &middot; {formatDate(day.date)}
                  </p>
                </div>
                <button
                  onClick={() => deleteSpecialDay(day.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add form */}
        {showForm ? (
          <div className="border border-gray-200 rounded-lg p-4 space-y-3 bg-white">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Name</label>
                <input
                  type="text"
                  className="input"
                  placeholder="e.g. Mum"
                  value={newDay.name}
                  onChange={(e) => setNewDay({ ...newDay, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Date</label>
                <input
                  type="date"
                  className="input"
                  value={newDay.date}
                  onChange={(e) => setNewDay({ ...newDay, date: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
                <select
                  className="input"
                  value={newDay.type}
                  onChange={(e) => setNewDay({ ...newDay, type: e.target.value })}
                >
                  <option value="BIRTHDAY">Birthday</option>
                  <option value="ANNIVERSARY">Anniversary</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Relationship</label>
                <select
                  className="input"
                  value={newDay.relationship}
                  onChange={(e) => setNewDay({ ...newDay, relationship: e.target.value })}
                >
                  {RELATIONSHIPS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={addSpecialDay} className="btn-primary text-sm">Add Special Day</button>
              <button onClick={() => setShowForm(false)} className="btn-secondary text-sm">Cancel</button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium text-sm"
          >
            <Plus className="h-4 w-4" /> Add a Special Day
          </button>
        )}
      </div>
    </div>
  );
}
