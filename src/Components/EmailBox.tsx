import { InputText } from "primereact/inputtext";
import { useEmail } from "./EmailContext";
import { Editor } from "primereact/editor";
import {
  IoIosArrowDropupCircle,
  IoIosArrowDropdownCircle,
  IoMdCloseCircle,
} from "react-icons/io";
import { MdDelete } from "react-icons/md";

import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import ChipsInput from "./ChipsInput";
import { useEmailStore } from "./emailStore";

export default function EmailBox() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { isVisible, isMinimized, setIsVisible, setIsMinimized } = useEmail();
  const {
    to,
    cc,
    subject,
    editorValue,
    setTo,
    setCc,
    setSubject,
    setEditorValue,
    reset,
  } = useEmailStore();

  const setCcWrapper = (
    valueOrFn: string[] | ((prev: string[]) => string[])
  ) => {
    if (typeof valueOrFn === "function") {
      setCc(valueOrFn(cc));
    } else {
      setCc(valueOrFn);
    }
  };

  if (!isVisible) return null;

  return (
    <div
      className={`fixed bottom-0 right-4 shadow-lg bg-white rounded-lg border border-gray-300 z-50 overflow-auto ${
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
            onPress={onOpen}
          >
            <IoMdCloseCircle />
          </Button>
          <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
              {(onClose) => (
                <>
                  <ModalHeader className="flex text-red-600 flex-col justify-center items-center gap-1">
                    Delete <MdDelete className="text-3xl" />
                  </ModalHeader>
                  <ModalBody className="flex items-center">
                    <p>(Do you want ot delete all data?)</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="success" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      color="warning"
                      className="bg-red-600 text-white"
                      onPress={() => {
                        onClose(), setIsVisible(false),reset();
                      }}
                    >
                      Delete
                    </Button>
                  </ModalFooter>
                </>
              )}
            </ModalContent>
          </Modal>
        </div>
      </div>

      {!isMinimized && (
        <div className="p-4 flex flex-col gap-2">
          <p className="text-sm">From : usman@gmail.com</p>
          <div>
            To:{" "}
            <InputText
              placeholder="search for contact"
              value={to}
              onChange={(e) => setTo(e.target.value)}
            />
          </div>
          <div>
            <ChipsInput chips={cc} setChips={setCcWrapper} />
          </div>
          <div>
            Subject:{" "}
            <InputText
              placeholder="Subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <Editor
            value={editorValue}
            onTextChange={(e) => setEditorValue(e.htmlValue ?? "")}
            style={{ height: "260px" }}
          />
          <div className="flex justify-between">
            <Button
              className="bg-transparent border rounded border-gray-400"
              radius="none"
              onPress={() => reset()}
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
