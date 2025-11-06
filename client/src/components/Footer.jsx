const Footer = () => {
  return (
    <footer className="flex items-center justify-center h-[35px] bg-nav py-2">
      <p className="text-white text-xs font-normal">
        Made with &#10084; by Data Analyst &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
