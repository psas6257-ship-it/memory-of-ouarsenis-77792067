import { Outlet } from "react-router-dom";
import { PhoneFrame } from "@/components/PhoneFrame";
import { BottomNav } from "@/components/BottomNav";
import { InstallPrompt } from "@/components/InstallPrompt";

    }
  },
});

function AppLayout() {
  return (
    <PhoneFrame>
      <div className="relative flex-1 flex flex-col overflow-hidden">
        <div className="flex-1 overflow-y-auto no-scrollbar pb-28">
          <Outlet />
        </div>
        <InstallPrompt />
        <BottomNav />
      </div>
    </PhoneFrame>
  );
}

export default AppLayout;
