import { useState, useEffect } from "react";

function useScroll() {
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = (): void => {
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const threshold = 230;
      //   Nếu người dùng scroll xuống hơn 200 thì set data
      const isScrollingDown = scrollTop > threshold;

      setIsScrolling(isScrollingDown);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return isScrolling;
}

export default useScroll;
