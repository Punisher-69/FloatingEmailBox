import { InputText } from "primereact/inputtext";
import { useEmail } from "./EmailContext";
import { Editor } from "primereact/editor";
import {
  IoIosArrowDropupCircle,
  IoIosArrowDropdownCircle,
  IoMdCloseCircle,
} from "react-icons/io";
import { useState } from "react";
import { Button, Chip, Input } from "@heroui/react";
import {
  makeChip,
  useEmailBoxEffects,
  handleChipClose,
  recalculateErrorType,
} from "./EmailBoxUtils";

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

  useEmailBoxEffects({
    lastErrorType,
    duplicateEmail,
    inValidEmails,
    setErrorMessage,
  });

  if (!isVisible) return null;

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
          <Button
            
            isIconOnly
            className="p-0 m-0 min-w-0 w-auto h-auto bg-transparent text-white"
            onPress={() => {
              setIsMinimized(!isMinimized);
            }}
          >
            {isMinimized ? (
              <IoIosArrowDropupCircle />
            ) : (
              <IoIosArrowDropdownCircle />
            )}
          </Button>
          <Button
            isIconOnly
            className="p-0 m-0 min-w-0 w-auto h-auto bg-transparent text-white"
            onPress={() => setIsVisible(false)}
          >
            <IoMdCloseCircle />
          </Button>
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
                      onClose={() =>
                        handleChipClose({
                          index,
                          chips,
                          chip,
                          inValidEmails,
                          setChips,
                          setInValidEmails,
                          recalculateErrorType: (chipsArr, invalidArr) =>
                            recalculateErrorType(
                              chipsArr,
                              invalidArr,
                              setLastErrorType,
                              setDuplicateEmail,
                              setInvalid
                            ),
                        })
                      }
                    >
                      {chip}
                    </Chip>
                  ))}
                </div>
              }
              placeholder="Press Enter or Space to add email"
              onKeyDown={(e) =>
                makeChip({
                  e,
                  inputValue,
                  setChips,
                  inValidEmails,
                  setInValidEmails,
                  recalculateErrorType: (chipsArr, invalidArr) =>
                    recalculateErrorType(
                      chipsArr,
                      invalidArr,
                      setLastErrorType,
                      setDuplicateEmail,
                      setInvalid
                    ),
                  setInputValue,
                  chips,
                })
              }
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
