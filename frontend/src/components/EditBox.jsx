import { useState, useEffect, useRef } from "react";

export default function EditBox({ value, onSave }) {
  const [editing, setEditing] = useState(false);
  const [input, setInput] = useState(value);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (editing && textareaRef.current) {
      textareaRef.current.focus();
      textareaRef.current.select();
      autoResize();
    }
  }, [editing]);

  const autoResize = () => {
    const ta = textareaRef.current;
    if (ta) {
      ta.style.height = "auto"; // reset height
      ta.style.height = ta.scrollHeight + "px"; // fit content
    }
  };

  const handleChange = (e) => {
    setInput(e.target.value);
    autoResize();
  };

  const handleSave = () => {
    if (input&&input !== value) onSave(input);
    setEditing(false);
  };

  if (!editing) {
    return (
      <span
        className="cursor-pointer hover:underline"
        onClick={() => setEditing(true)}
      >
        {value}
      </span>
    );
  }

  return (
    <div className="flex gap-2 items-start">
  <textarea
    ref={textareaRef}
    value={input}
    onChange={handleChange}
    className="flex-1 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 resize-none text-sm min-h-[1.5em]"
  />
  <button
    onClick={handleSave}
    className="bg-blue-600 text-white px-3 py-1 rounded text-sm"
  >
    Save
  </button>
  <button
    onClick={() => setEditing(false)}
    className="bg-gray-300 px-3 py-1 rounded text-sm"
  >
    Cancel
  </button>
</div>

  );
}
