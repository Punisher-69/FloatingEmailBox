import { MdEmail } from "react-icons/md";
import { Button, Tooltip } from "@heroui/react";
import { useNavigate, Outlet } from "react-router";
import { useEmail } from "./EmailContext";
import EmailBox from "./EmailBox";

export default function RootLayout() {
  const { setIsVisible, setIsMinimized } = useEmail();

  const navigate = useNavigate();

  const handleAbout = () => {
    navigate("/about");
  };

  const handleContact = () => {
    navigate("/contact");
  };
  return (
    <div>
      <div className="flex justify-between px-10 h-12 items-center bg-[#e0aaff]">
        <h1 className="text-3xl">WaveNest</h1>
        <Tooltip content="Email" closeDelay={0}>
          <button>
            <MdEmail
              onClick={() => {
                setIsVisible(true);
                setIsMinimized(false);
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
      <EmailBox />
    </div>
  );
}
