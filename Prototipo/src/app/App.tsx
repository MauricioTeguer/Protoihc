import { RouterProvider } from "react-router-dom";
import { router } from "./routes";

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {/* iPhone 16 dimensions: 393px x 852px */}
      <div className="w-full max-w-[393px] h-[852px] bg-white shadow-2xl rounded-[3rem] overflow-hidden">
        <div className="h-full overflow-y-auto relative">
          <RouterProvider router={router} />
        </div>
      </div>
    </div>
  );
}