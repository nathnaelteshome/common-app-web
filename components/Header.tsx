import Link from 'next/link';
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedin,
  FaYoutube,
} from 'react-icons/fa';
import { HiOutlinePhone } from 'react-icons/hi';
import { IoLocationOutline, IoMailOutline } from 'react-icons/io5';

const Header = () => {
  return (
    <div className="h-12 bg-primary text-sm lg:text-base text-white flex justify-around items-center ">
      <div className="flex justify-start gap-4">
        <span className="min-w-fit flex items-center gap-2">
          <Link href="/">
            <HiOutlinePhone />
          </Link>
          <span>(+251) 911 221 1221</span>
          <span>|</span>
        </span>
        <span className="min-w-fit flex items-center gap-2">
          <IoMailOutline />
          <span>commonapply@gmail.com</span>
          <span>|</span>
        </span>
        <span className="min-w-fit hidden sm:flex items-center gap-2">
          <IoLocationOutline />
          <span>Addis Ababa, Ethiopia</span>
          <span>|</span>
        </span>
      </div>
      <div className="hidden lg:flex h-full justify-around px-3 items-center gap-3 bg-white">
        <Link href="https://www.facebook.com">
          <FaFacebookF style={{ color: '#17254E' }} />
        </Link>

        <Link href="https://www.instagram.com/">
          <FaInstagram style={{ color: '#17254E' }} />
        </Link>

        <Link href="https://www.linkedin.com">
          <FaLinkedin style={{ color: '#17254E' }} />
        </Link>

        <Link href="https://www.youtube.com">
          <FaYoutube style={{ color: '#17254E' }} />
        </Link>
      </div>
    </div>
  );
};

export default Header;
