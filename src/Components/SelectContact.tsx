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
import { useContactStore } from "./contactStore";
import { useCompanyStore } from "./companyStore";
import { useState } from "react";

export default function SelectContact() {
  const { contacts, addContact } = useContactStore();
  const { companies, addCompany } = useCompanyStore();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();  
  const [newFirstName, setNewFirstName] = useState("");
  const [newLastName, setNewLastName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCompanyName, setNewCompanyName] = useState("");
  const [newCompanyWebsite, setNewCompanyWebsite] = useState("");
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(
    null
  );
  const [selectedContactId, setSelectedContactId] = useState<string | null>(
    null
  );
  const [isCreatingCompany, setIsCreatingCompany] = useState(false);

  const handleCreateContact = () => {
    if (newFirstName.trim() && newLastName.trim() && newEmail.trim()) {
      let companyId = selectedCompanyId;
      // If creating a new company
      if (
        isCreatingCompany &&
        newCompanyName.trim() &&
        newCompanyWebsite.trim()
      ) {
        const newCompany = {
          name: newCompanyName,
          website: newCompanyWebsite,
        };
        const company = addCompany(newCompany);
        companyId = company.id;
      }
      const newContact = {
        firstName: newFirstName,
        lastName: newLastName,
        email: newEmail,
        companyId: companyId || undefined,
      };
      const contact = addContact(newContact);
      setSelectedContactId(contact.id);
      setNewFirstName("");
      setNewLastName("");
      setNewEmail("");
      setNewCompanyName("");
      setNewCompanyWebsite("");
      setSelectedCompanyId(null);
      setIsCreatingCompany(false);
      onOpenChange();
    }
  };

  return (
    <>
      <Select
        className="max-w-xs"
        placeholder="Search for a contact"
        selectionMode="single"
        selectedKeys={selectedContactId ? [selectedContactId] : []}
        onSelectionChange={(keys) => {
          const key = Array.from(keys as Set<string>)[0];
          if (key === "__create__") {
            onOpen();
          } else if (key) {
            setSelectedContactId(key);
            console.log("Selected contact ID:", key);
          }
        }}
        classNames={{ selectorIcon: "hidden" }}
      >
        <>
          <SelectItem key="__create__" textValue="+ Create a new contact">
            <span className="text-blue-700">+ Create a new contact</span>
          </SelectItem>
          {contacts.map((contact) => (
            <SelectItem
              key={contact.id}
              textValue={`${contact.firstName} ${contact.lastName}`}
            >
              <span className="text-blue-700">
                {contact.firstName} {contact.lastName}
              </span>
            </SelectItem>
          ))}
        </>
      </Select>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        classNames={{ base: "max-w-2xl" }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Create Contact</ModalHeader>
              <ModalBody>
                <div className="flex gap-4 mb-4">
                  <Input
                    label="First Name"
                    value={newFirstName}
                    onChange={(e) => setNewFirstName(e.target.value)}
                    placeholder="Enter first name"
                    isRequired
                  />
                  <Input
                    label="Last Name"
                    value={newLastName}
                    onChange={(e) => setNewLastName(e.target.value)}
                    placeholder="Enter last name"
                    isRequired
                  />
                </div>
                <Input
                  className="mb-4"
                  label="Email"
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  placeholder="Enter email address"
                  isRequired
                />
                <div className="mb-4">
                  <label className="text-sm font-medium text-gray-700 mb-2 block">
                    Primary Company
                  </label>
                  <Select
                    placeholder="Select or create company"
                    selectedKeys={selectedCompanyId ? [selectedCompanyId] : []}
                    onSelectionChange={(keys) => {
                      const key = Array.from(keys as Set<string>)[0];
                      setSelectedCompanyId(
                        key === "__create__" ? null : key || null
                      );
                      setIsCreatingCompany(key === "__create__");
                      if (key !== "__create__") {
                        setNewCompanyName("");
                        setNewCompanyWebsite("");
                      }
                    }}
                    classNames={{ selectorIcon: "hidden" }}
                  >
                    <>
                      <SelectItem
                        key="__create__"
                        textValue="+ Create new company"
                      >
                        <span className="text-blue-700">
                          + Create new company
                        </span>
                      </SelectItem>
                      {companies.map((company) => (
                        <SelectItem key={company.id} textValue={company.name}>
                          <span className="text-blue-700">{company.name}</span>
                        </SelectItem>
                      ))}
                    </>
                  </Select>
                </div>
                {isCreatingCompany && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">
                      Create New Company
                    </h4>
                    <Input
                      className="mb-4"
                      label="Company Name"
                      value={newCompanyName}
                      onChange={(e) => setNewCompanyName(e.target.value)}
                      placeholder="Enter company name"
                      isRequired
                    />
                    <Input
                      label="Website"
                      value={newCompanyWebsite}
                      onChange={(e) => setNewCompanyWebsite(e.target.value)}
                      placeholder="Enter company website"
                      isRequired
                    />
                  </div>
                )}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleCreateContact();
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
