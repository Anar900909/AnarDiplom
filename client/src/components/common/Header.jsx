import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";

// design
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import { Container, CustomNavLink, CustomNavLinkList, ProfileCard } from "../../router";
import { User1 } from "../hero/Hero";
import { menulists } from "../../utils/data";
import { ShowOnLogin, ShowOnLogout } from "../../utils/HiddenLink";
import { UseUserProfile } from "../../hooks/userProfile";
import { useDispatch } from "react-redux";
import { getuserProfile } from "../../redux/features/authSlice";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const menuRef = useRef(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenuOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };
  const handleScroll = () => {
    setIsScrolled(window.scrollY > 0);
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeMenuOutside);
    window.addEventListener("scroll", handleScroll);

    return () => {
      document.removeEventListener("mousedown", closeMenuOutside);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Check if it's the home page
  const isHomePage = location.pathname === "/";


  
  
    const { role } = UseUserProfile();
    const dispatch = useDispatch();
  
    useEffect(() =>{
      dispatch(getuserProfile());
    },[dispatch]);
  return (
    <>
      <header className={isHomePage ? `header py-1 bg-primary ${isScrolled ? "scrolled" : ""}` : `header bg-white shadow-s1 ${isScrolled ? "scrolled" : ""}`}>
        <Container>
          <nav className="p-4 flex justify-between items-center relative">
            <div className="flex items-center gap-14">
              <div>
                {isHomePage && !isScrolled ? (
                  <img src="../images/common/header-logo1.png" alt="LogoImg" className="h-12 w-full object-cover" />
                ) : (
                  <img src="../images/common/header-logo2.jpg" alt="LogoImg" className="h-11" />
                )}
              </div>
              <div className="hidden lg:flex items-center justify-between gap-8">
                {menulists.map((list) => (
                  <li key={list.id} className="capitalize list-none">
                    <CustomNavLinkList href={list.path} isActive={location.pathname === list.path} className={`${isScrolled || !isHomePage ? "text-black" : "text-white"}`}>
                      {list.link}
                    </CustomNavLinkList>
                  </li>
                ))}
              </div>
            </div>
            <div className="flex items-center gap-8 icons">
              <div className="hidden lg:flex lg:items-center lg:gap-8">
  <IoSearchOutline size={23} className={`${isScrolled || !isHomePage ? "text-black" : "text-white"}`} />

  {/* Show "Become a Seller" only if user is logged in AND role is buyer */}
  {role === "buyer" && (
    <ShowOnLogin>
      <CustomNavLink href="/seller/login" className={`${isScrolled || !isHomePage ? "text-black" : "text-white"}`}>
        Борлуулагч болох
      </CustomNavLink>
    </ShowOnLogin>
  )}

  {/* Show when NOT logged in */}
  <ShowOnLogout>
    <CustomNavLink href="/login" className={`${isScrolled || !isHomePage ? "text-black" : "text-white"}`}>
      Нэвтрэх
    </CustomNavLink>
    <CustomNavLink
      href="/register"
      className={`${!isHomePage || isScrolled ? "bg-green" : "bg-white"} px-8 py-2 rounded-full text-primary shadow-md`}
    >
      Бүртгүүлэх
            </CustomNavLink>
                </ShowOnLogout>

  {/* Show when logged in */}
                <ShowOnLogin>
                 <CustomNavLink href="/dashboard">
                  <ProfileCard>
                 <img src={User1} alt="User Profile" className="w-full h-full object-cover" />
                 </ProfileCard>
                 </CustomNavLink>
                </ShowOnLogin>
              </div>
              <div className={`icon flex items-center justify-center gap-6 ${isScrolled || !isHomePage ? "text-primary" : "text-white"}`}>
                <button onClick={toggleMenu} className="lg:hidden w-10 h-10 flex justify-center items-center bg-black text-white focus:outline-none">
                  {isOpen ? <AiOutlineClose size={24} /> : <AiOutlineMenu size={24} />}
                </button>
              </div>
            </div>

            {/* Responsive Menu if below 768px */}
            <div ref={menuRef} className={`lg:flex lg:items-center lg:w-auto w-full p-5 absolute right-0 top-full menu-container ${isOpen ? "open" : "closed"}`}>
              {menulists.map((list) => (
                <li href={list.path} key={list.id} className="uppercase list-none">
                  <CustomNavLink className="text-white">{list.link}</CustomNavLink>
                </li>
              ))}
            </div>
          </nav>
        </Container>
      </header>
    </>
  );
};
