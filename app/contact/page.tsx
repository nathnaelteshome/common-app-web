import ContactPage from '@/components/contact-page';
import TopBar from '@/components/TopBar';

export default function Home() {
  return (
    <>
      <TopBar title="Contact Us" pageName="contact us" />
      <ContactPage />
    </>
  );
}
