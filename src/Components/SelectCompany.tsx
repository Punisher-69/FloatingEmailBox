import { useState } from "react";
import {
  Select,
  SelectItem,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Input,
} from "@heroui/react";
import { useCompanyStore } from "./companyStore";

export default function SelectCompany() {
  const { companies, addCompany } = useCompanyStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyWebsite, setNewCompanyWebsite] = useState("");

  const handleCreateCompany = () => {
    if (newCompanyName.trim() && newCompanyWebsite.trim()) {
      addCompany({ name: newCompanyName, website: newCompanyWebsite });
      setNewCompanyName("");
      setNewCompanyWebsite("");
      onOpenChange();
    }
  };

  return (
    <>
      <Select
        className="max-w-xs"
        placeholder="Search for a company"
        selectionMode="single"
        onSelectionChange={(keys) => {
          const key = Array.from(keys as Set<string>)[0];
          if (key === "__create__") {
            onOpen();
          } else if (key) {
            console.log("Selected company ID:", key);
          }
        }}
        classNames={{ selectorIcon: "hidden" }}
      >
        <>
          <SelectItem key="__create__" textValue="+ Create a new company">
            <span className="text-blue-700">+ Create a new company</span>
          </SelectItem>

          {companies.map((company) => (
            <SelectItem key={company.id} textValue={company.name}>
              {company.name}
            </SelectItem>
          ))}
        </>
      </Select>

      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create Company</ModalHeader>
              <ModalBody>
                <Input
                  label="Company Name"
                  value={newCompanyName}
                  onChange={(e) => setNewCompanyName(e.target.value)}
                  placeholder="Enter company name"
                  isRequired
                />
                <Input
                  className="mt-4"
                  label="Website"
                  value={newCompanyWebsite}
                  onChange={(e) => setNewCompanyWebsite(e.target.value)}
                  placeholder="Enter company website"
                  isRequired
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleCreateCompany();
                    onClose();
                  }}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
