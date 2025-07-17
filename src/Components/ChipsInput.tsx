import { useState } from "react";
import { Chip } from "@heroui/react";

interface ChipsInputProps {
  chips: string[];
  setChips: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ChipsInput({ chips, setChips }: ChipsInputProps) {
  const [inValidEmails, setInValidEmails] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [inValid, setInvalid] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [isFocused, setIsFocused] = useState(false);

  const recalcErrorType = (chipsArr: string[], invalidArr: string[]) => {
    const validEmails = chipsArr.filter((email) =>
      /^[^\s@]+@[^-\s@]+\.[^\s@]+$/.test(email)
    );
    const hasDuplicates = validEmails.some(
      (item, idx, arr) => arr.indexOf(item) !== idx
    );

    if (hasDuplicates) {
      setInvalid(true);
      setErrorMessage("You have duplicate emails.");
      return;
    }

    if (invalidArr.length > 0) {
      setInvalid(true);
      setErrorMessage(`Some emails are invalid: ${invalidArr.join(", ")}`);
      return;
    }

    setInvalid(false);
    setErrorMessage("");
  };

  const handleChipRemove = (index: number, chip: string) => {
    const updatedChips = chips.filter((_, i) => i !== index);
    let updatedInvalids = [...inValidEmails];
    const invalidIndex = updatedInvalids.indexOf(chip);
    if (invalidIndex !== -1) {
      updatedInvalids.splice(invalidIndex, 1);
    }
    setChips(updatedChips);
    setInValidEmails(updatedInvalids);
    recalcErrorType(updatedChips, updatedInvalids);
  };

  const handleMakeChip = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const text = inputValue.trim();
    if ((e.key === "Enter" || e.code === "Space") && text) {
      e.preventDefault();
      let isInvalid = !/^[^\s@]+@[^-\s@]+\.[^\s@]+$/.test(text);
      const newChips = [...chips, text];
      let newInvalids = inValidEmails;
      if (isInvalid) {
        newInvalids = [...inValidEmails, text];
        setInValidEmails(newInvalids);
      }
      setChips(newChips);
      recalcErrorType(newChips, newInvalids);
      setInputValue("");
    }

    if (e.key === "Backspace" && !inputValue) {
      e.preventDefault();
      if (chips.length > 0) {
        const lastChip = chips[chips.length - 1];
        const updatedChips = chips.slice(0, -1);
        let updatedInvalids = [...inValidEmails];
        const invalidIndex = updatedInvalids.indexOf(lastChip);
        if (invalidIndex !== -1) {
          updatedInvalids.splice(invalidIndex, 1);
          setInValidEmails(updatedInvalids);
        }
        setChips(updatedChips);
        setInputValue(lastChip);
        recalcErrorType(updatedChips, updatedInvalids);
      }
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-start gap-3">
        <label className="text-sm font-medium text-foreground mt-3 min-w-[30px]">
          Cc:
        </label>
        <div className="flex-1">
          <div
            className={`group relative h-[80px] px-3 py-2 rounded-lg border-2 transition-colors duration-200 overflow-y-auto ${
              inValid 
                ? "border-danger bg-danger-50" 
                : isFocused 
                  ? "border-primary bg-default-100" 
                  : "border-default-300 bg-default-100 hover:border-default-400"
            }`}
          >
            <div className="h-full">
              <div className="flex gap-1 items-start flex-wrap content-start h-full">
              {chips.map((chip, index: number) => (
                <Chip
                  key={index}
                  size="sm"
                  color={inValidEmails.includes(chip) ? "danger" : "primary"}
                  variant="shadow"
                  onClose={() => handleChipRemove(index, chip)}
                  className="my-1"
                >
                  {chip}
                </Chip>
              ))}
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleMakeChip}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder={chips.length === 0 ? "Type and press Enter or Space to add email" : ""}
                className="flex-1 min-w-[200px] outline-none bg-transparent text-foreground placeholder:text-foreground-500 my-1"
              />
              </div>
            </div>
          </div>
          {inValid && errorMessage && (
            <p className="text-danger text-sm mt-1">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}