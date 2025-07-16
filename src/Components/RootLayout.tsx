import { MdEmail } from "react-icons/md";
import { Button, Tooltip } from "@heroui/react";
import { useNavigate, Outlet } from "react-router";

import EmailBox from "./EmailBox";
import { useEmailStore } from "./emailStore";

export default function RootLayout() {
  const { boxes, addBox } = useEmailStore();

  const navigate = useNavigate();

  const handleAbout = () => {
    navigate("/about");
  };

  const handleContact = () => {
    navigate("/contact");
  };

  let rightOffset = 1;
  return (
    <div>
      <div className="flex justify-between px-10 h-12 items-center bg-[#e0aaff]">
        <h1 className="text-3xl">WaveNest</h1>
        <Tooltip content="Email" closeDelay={0}>
          <button>
            <MdEmail
              onClick={() => {
                addBox();
                console.log("box created");
              }}
              className="m-0 p-0 text-xl text-blue-700"
            />
          </button>
        </Tooltip>
      </div>
      <div className="flex">
        <div className="bg-[#9d4edd] flex flex-col w-[10vw] h-lvh">
          <Button
            onPress={handleAbout}
            className="bg-[#5a189a] text-white"
            radius="none"
          >
            About
          </Button>
          <Button
            onPress={handleContact}
            className="bg-[#5a189a] text-white"
            radius="none"
          >
            Contact
          </Button>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
      <div >
        {boxes.map((box) => {
          const offset = rightOffset;
          const width = box.isMinimized ? 15 : 35; 
          rightOffset += width + 1; 

          return <EmailBox key={box.id} boxId={box.id} offset={offset} />;
        })}
      </div>
      <div />
    </div>
  );
}
