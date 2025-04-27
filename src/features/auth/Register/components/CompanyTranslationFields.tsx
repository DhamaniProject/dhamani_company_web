import AuthInput from "../../common/AuthInput";

interface TranslationProps {
  index: number;
  data: {
    language: string;
    name: string;
    description: string;
    terms: string;
  };
  onChange: (updated: TranslationProps["data"]) => void;
}

const CompanyTranslationFields = ({
  index,
  data,
  onChange,
}: TranslationProps) => {
  const handleChange = (
    field: keyof TranslationProps["data"],
    value: string
  ) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="mt-4 border rounded-lg p-4 bg-gray-50 space-y-4">
      <h3 className="text-sm font-medium text-gray-700">
        Translation {index + 1}
      </h3>

      <div>
        <label htmlFor={`language-${index}`} className="block text-sm mb-2">
          Language
        </label>
        <select
          id={`language-${index}`}
          value={data.language}
          onChange={(e) => handleChange("language", e.target.value)}
          className="block w-full border-gray-300 rounded-lg sm:text-sm"
        >
          <option value="">Select Language</option>
          <option value="en">English</option>
          <option value="ar">Arabic</option>
        </select>
      </div>

      <AuthInput
        id={`translatedName-${index}`}
        label="Translated Company Name"
        value={data.name}
        required={false}
        onChange={(e) => handleChange("name", e.target.value)}
      />

      <AuthInput
        id={`companyDescription-${index}`}
        label="Company Description"
        value={data.description}
        required={false}
        onChange={(e) => handleChange("description", e.target.value)}
      />

      <div>
        <label htmlFor={`terms-${index}`} className="block text-sm mb-2">
          Translated Terms & Conditions
        </label>
        <textarea
          id={`terms-${index}`}
          value={data.terms}
          onChange={(e) => handleChange("terms", e.target.value)}
          className="w-full border-gray-300 rounded-lg p-3 sm:text-sm"
          rows={4}
        />
      </div>
    </div>
  );
};

export default CompanyTranslationFields;
