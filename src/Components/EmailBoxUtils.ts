import {  useEffect } from "react";

export const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export function recalculateErrorType(
  chipsArr: string[],
  invalidArr: string[],
  setLastErrorType: (type: "duplicate" | "invalid" | null) => void,
  setDuplicateEmail: (val: boolean) => void,
  setInvalid: (val: boolean) => void
) {
  const validEmails = chipsArr.filter(isValidEmail);
  const hasDuplicates = validEmails.some(
    (item, idx, arr) => arr.indexOf(item) !== idx
  );
  if (hasDuplicates) {
    setLastErrorType("duplicate");
    setDuplicateEmail(true);
    setInvalid(invalidArr.length > 0);
    return;
  }
  if (invalidArr.length > 0) {
    setLastErrorType("invalid");
    setDuplicateEmail(false);
    setInvalid(true);
    return;
  }
  setLastErrorType(null);
  setDuplicateEmail(false);
  setInvalid(false);
}

export function useEmailBoxEffects({
  lastErrorType,
  duplicateEmail,
  inValidEmails,
  setErrorMessage,
}: {
  lastErrorType: "duplicate" | "invalid" | null;
  duplicateEmail: boolean;
  inValidEmails: string[];
  setErrorMessage: (msg: string) => void;
}) {
  useEffect(() => {
    if (lastErrorType === "duplicate" && duplicateEmail) {
      setErrorMessage("You have duplicate emails.");
    } else if (lastErrorType === "invalid") {
      setErrorMessage(`Some emails are invalid: ${inValidEmails.join(", ")}`);
    } else {
      setErrorMessage("");
    }
  }, [lastErrorType, duplicateEmail, inValidEmails, setErrorMessage]);
}

export function makeChip({
  e,
  inputValue,
  setChips,
  inValidEmails,
  setInValidEmails,
  recalculateErrorType,
  setInputValue,
  chips,
}: {
  e: React.KeyboardEvent<HTMLInputElement>;
  inputValue: string;
  setChips: React.Dispatch<React.SetStateAction<string[]>>;
  inValidEmails: string[];
  setInValidEmails: React.Dispatch<React.SetStateAction<string[]>>;
  recalculateErrorType: (chipsArr: string[], invalidArr: string[]) => void;
  setInputValue: (val: string) => void;
  chips: string[];
}) {
  const text = inputValue.trim();
  if ((e.key === "Enter" || e.code === "Space") && text) {
    e.preventDefault();
    let isInvalid = !isValidEmail(text);
    setChips((prev) => {
      const newChips = [...prev, text];
      let newInvalids = inValidEmails;
      if (isInvalid) {
        newInvalids = [...inValidEmails, text];
        setInValidEmails(newInvalids);
      }
      recalculateErrorType(newChips, newInvalids);
      return newChips;
    });
    setInputValue("");
  }
  if (e.key === "Backspace" && !inputValue) {
    e.preventDefault();
    if (chips.length > 0) {
      const lastChip = chips[chips.length - 1];
      setChips((prev) => {
        const updatedChips = prev.slice(0, -1);
        let updatedInvalids = [...inValidEmails];
        const invalidIndex = updatedInvalids.indexOf(lastChip);
        if (invalidIndex !== -1) {
          updatedInvalids.splice(invalidIndex, 1);
          setInValidEmails(updatedInvalids);
        }
        recalculateErrorType(updatedChips, updatedInvalids);
        return updatedChips;
      });
      setInputValue(lastChip);
    }
  }
}

export function handleChipClose({
  index,
  chips,
  chip,
  inValidEmails,
  setChips,
  setInValidEmails,
  recalculateErrorType,
}: {
  index: number;
  chips: string[];
  chip: string;
  inValidEmails: string[];
  setChips: React.Dispatch<React.SetStateAction<string[]>>;
  setInValidEmails: React.Dispatch<React.SetStateAction<string[]>>;
  recalculateErrorType: (chipsArr: string[], invalidArr: string[]) => void;
}) {
  const updatedChips = chips.filter((_, i) => i !== index);
  const invalidIndex = inValidEmails.indexOf(chip);
  let updatedInvalids = [...inValidEmails];
  if (invalidIndex !== -1) {
    updatedInvalids.splice(invalidIndex, 1);
  }
  setChips(updatedChips);
  setInValidEmails(updatedInvalids);
  recalculateErrorType(updatedChips, updatedInvalids);
}
