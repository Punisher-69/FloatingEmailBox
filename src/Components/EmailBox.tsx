import { InputText } from "primereact/inputtext";
import { useEmail } from "./EmailContext";
import { Editor } from "primereact/editor";
import {
  IoIosArrowDropupCircle,
  IoIosArrowDropdownCircle,
  IoMdCloseCircle,
} from "react-icons/io";
import { useEffect, useState } from "react";
import { Button, Chip, Input } from "@heroui/react";

export default function EmailBox() {
  const { isVisible, isMinimized, setIsVisible, setIsMinimized } = useEmail();
  const [value, setValue] = useState<string>("");
  const [chips, setChips] = useState<string[]>([]);
  const [inValidEmails, setInValidEmails] = useState<string[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [duplicateEmail, setDuplicateEmail] = useState(false);
  const [inValid, setInvalid] = useState(false);
  const [inputValue, setInputValue] = useState<string>("");
  const [lastErrorType, setLastErrorType] = useState<
    "duplicate" | "invalid" | null
  >(null);

  useEffect(() => {
    if (lastErrorType === "duplicate" && duplicateEmail) {
      setErrorMessage("You have duplicate emails.");
    } else if (lastErrorType === "invalid") {
      setErrorMessage(`Some emails are invalid: ${inValidEmails.join(", ")}`);
    } else {
      setErrorMessage("");
    }
  }, [lastErrorType, duplicateEmail, inValidEmails]);

  if (!isVisible) return null;

  const isValidEmail = (email: string) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const recalculateErrorType = (chipsArr: string[], invalidArr: string[]) => {
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
  };

  const makeChip = (e: React.KeyboardEvent<HTMLInputElement>) => {
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
  };

  return (
    <div
      className={`fixed bottom-0 right-4  shadow-lg bg-white rounded-lg border border-gray-300 z-50 ${
        isMinimized ? "w-[15vw]" : "w-[35vw]"
      }`}
    >
      <div
        onClick={() => setIsMinimized(false)}
        className="bg-[#5a189a] text-white px-4 py-2 flex justify-between items-center rounded-t-lg"
      >
        <span>Email</span>
        <div className="space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsMinimized(!isMinimized);
            }}
          >
            {isMinimized ? (
              <IoIosArrowDropupCircle />
            ) : (
              <IoIosArrowDropdownCircle />
            )}
          </button>
          <button onClick={() => setIsVisible(false)}>
            <IoMdCloseCircle />
          </button>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-4 flex flex-col gap-2">
          <p className="text-sm">From : usman@gmail.com</p>
          <div>
            To: <InputText placeholder="search for contact" />
          </div>
          <div>
            <Input
              isInvalid={inValid}
              errorMessage={errorMessage}
              label="Cc :"
              labelPlacement="outside-left"
              className="w-full py-1"
              value={inputValue || ""}
              onChange={(e) => setInputValue(e.target.value)}
              startContent={
                <div className="flex  gap-1 items-center">
                  {chips.map((chip, index: number) => (
                    <Chip
                      key={index}
                      size="sm"
                      color="primary"
                      variant="shadow"
                      onClose={() => {
                        const updatedChips = chips.filter(
                          (_, i) => i !== index
                        );

                        const invalidIndex = inValidEmails.indexOf(chip);
                        let updatedInvalids = [...inValidEmails];
                        if (invalidIndex !== -1) {
                          updatedInvalids.splice(invalidIndex, 1);
                        }
                        setChips(updatedChips);
                        setInValidEmails(updatedInvalids);
                        recalculateErrorType(updatedChips, updatedInvalids);
                      }}
                    >
                      {chip}
                    </Chip>
                  ))}
                </div>
              }
              placeholder="Press Enter or Space to add email"
              onKeyDown={makeChip}
            />
          </div>
          <div>
            Subject: <InputText placeholder="Subject" />
          </div>
          <Editor
            value={value}
            onTextChange={(e) => setValue(e.htmlValue ?? "")}
            style={{ height: "260px" }}
          />
          <div className="flex justify-between">
            <Button
              className="bg-transparent border rounded border-gray-400"
              radius="none"
            >
              Discard
            </Button>
            <div className="flex gap-2">
              <Button
                className="bg-transparent border rounded border-gray-400"
                radius="none"
              >
                Send Email to myself
              </Button>
              <Button
                className="bg-transparent border rounded border-gray-400"
                radius="none"
              >
                Send Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
