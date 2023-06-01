
import { useEffect, useRef, useState } from "react";

const useLazyLoading = (): [boolean, React.RefObject<HTMLDivElement>] => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  // const searchParams = Object.fromEntries([...useSearchParams()]);
  // const client = useQueryClient();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return [isVisible, ref];
};

export default useLazyLoading;
