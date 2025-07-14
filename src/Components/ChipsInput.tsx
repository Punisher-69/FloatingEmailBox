import { useState } from "react";
import { Chip, Input } from "@heroui/react";

interface ChipsInputProps {
  chips: string[];
  setChips: React.Dispatch<React.SetStateAction<string[]>>;
}

export default function ChipsInput({ chips, setChips }: ChipsInputProps) {
  const [inValidEmails, setInValidEmails] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [inValid, setInvalid] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");

  // Custom recalculateErrorType to update all error states
  const recalcErrorType = (chipsArr: string[], invalidArr: string[]) => {
    const validEmails = chipsArr.filter((email) =>
      /^[^\s@]+@[^-\s@]+\.[^\s@]+$/.test(email)
    );
    const hasDuplicates = validEmails.some(
      (item, idx, arr) => arr.indexOf(item) !== idx
    );
    if (hasDuplicates) {
      setInvalid(invalidArr.length > 0);
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
    <Input
      isInvalid={inValid}
      errorMessage={errorMessage}
      label="Cc :"
      labelPlacement="outside-left"
      className="w-full py-1 bg-white"
      value={inputValue || ""}
      onChange={(e) => setInputValue(e.target.value)}
      startContent={
        <div className="flex gap-1 items-center">
          {chips.map((chip, index: number) => (
            <Chip
              key={index}
              size="sm"
              color="primary"
              variant="shadow"
              onClose={() => handleChipRemove(index, chip)}
            >
              {chip}
            </Chip>
          ))}
        </div>
      }
      placeholder="Press Enter or Space to add email"
      onKeyDown={handleMakeChip}
    />
  );
}
