import HeaderMobileScreen from "./headermobilscreen/HeaderMobileScreen";
import HeaderPCScreen from "./headerpcscreen/HeaderPCScreen";

export default function Header() {
  return (
    <>
      {/* Mobile screen header, visible only on small screens */}
      <div className="block sm:hidden">
        <HeaderMobileScreen />
      </div>

      {/* PC screen header, hidden on small screens */}
      <div className="hidden sm:block">
        <HeaderPCScreen />
      </div>
    </>
  );
}
