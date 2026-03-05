const Footer = () => {
  return (
    <footer className="flex items-center justify-center border-t h-[35px] py-3 px-5">
      <p className="text-center text-xs font-normal">
        Made with &#10084; by Data Analyst &copy; {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
