interface Props {
  language: string;
  setLanguage: (value: string) => void;
}

export default function LanguageSelector({ language, setLanguage }: Props) {
  return (
    <div className="w-full sm:w-52">
      <label className="block text-xs font-medium text-gray-500 mb-1">
        Language
      </label>

      <div className="relative">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="
            w-full appearance-none
            px-4 py-2.5
            rounded-lg
            border border-gray-300
            bg-white
            text-sm font-medium text-gray-700
            focus:outline-none
            focus:ring-2 focus:ring-blue-500
            focus:border-blue-500
            transition
          "
        >
          <option value="python">Python</option>
          <option value="javascript">JavaScript</option>
          <option value="cpp">C++</option>
          <option value="java">Java</option>
        </select>

        {/* Custom Arrow */}
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-gray-400 text-sm">
          ▼
        </div>
      </div>
    </div>
  );
}
