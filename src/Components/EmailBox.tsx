import { InputText } from "primereact/inputtext";

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

export default function EmailBox({
  boxId,
  offset,
}: {
  boxId: string;
  offset: number;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const { boxes, removeBox, updateBox } = useEmailStore();

  const box = boxes.find((b) => b.id === boxId)!;
  const setCcWrapper = (value: React.SetStateAction<string[]>) => {
    const nextValue = typeof value === "function" ? value(box.cc) : value;
    updateBox(box.id, { cc: nextValue });
  };

  if (!box) return null;

  return (
    <div
      style={{
        right: `${offset}vw`,
      }}
      className={`fixed bottom-0  mr-2 shadow-lg bg-white rounded-lg border border-gray-300 z-50 overflow-auto ${
        box.isMinimized ? "w-[15vw]" : "w-[35vw]"
      }`}
    >
      <div
        onClick={() => updateBox(box.id, { isMinimized: false })}
        className="bg-[#5a189a] text-white px-4 py-2 flex justify-between items-center rounded-t-lg"
      >
        <strong>Email</strong>
        <div className="space-x-2">
          <Button
            isIconOnly
            className="p-0 m-0 min-w-0 w-auto h-auto bg-transparent text-white"
          >
            {box.isMinimized ? (
              <IoIosArrowDropupCircle
                onClick={() => updateBox(box.id, { isMinimized: false })}
              />
            ) : (
              <IoIosArrowDropdownCircle
                onClick={() => updateBox(box.id, { isMinimized: true })}
              />
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
                    <p>(Do you want to delete all data?)</p>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="success" variant="light" onPress={onClose}>
                      Close
                    </Button>
                    <Button
                      color="warning"
                      className="bg-red-600 text-white"
                      onPress={() => {
                        onClose(), removeBox(box.id);
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

      {!box.isMinimized && (
        <div className="p-4 flex flex-col gap-2">
          <p className="text-sm">From : usman@gmail.com</p>
          <div>
            To:
            <InputText
              value={box.to}
              placeholder="search for contact"
              onChange={(e) => updateBox(box.id, { to: e.target.value })}
            />
          </div>
          <div>
            <ChipsInput chips={box.cc} setChips={setCcWrapper} />
          </div>
          <div>
            Subject:{" "}
            <InputText
              placeholder="Subject"
              value={box.subject}
              onChange={(e) => updateBox(box.id, { subject: e.target.value })}
            />
          </div>
          <Editor
            value={box.editorValue}
            onTextChange={(e) =>
              updateBox(box.id, { editorValue: e.htmlValue ?? "" })
            }
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
