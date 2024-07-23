import { useEffect, useRef, useState } from "react";
import { delayAction } from "../functions/eventsRelated";

const usePagination = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  const [defPageNumber, setDefPageNumber] = useState<number>(1);
  const [defPageSize, setDefPageSize] = useState<number>(6);
  const [totalItemsCount, setTotalItemsCount] = useState<number>(0);

  useEffect(() => {
    setPageNumber(defPageNumber);
  }, [defPageNumber]);
  useEffect(() => {
    setPageSize(defPageSize);
  }, [defPageSize]);

  const handleScroll = () => {
    const scrollingElement = scrollRef.current;
    if (scrollingElement) {
      if (scrollingElement.scrollHeight - 1.1 * scrollingElement.scrollTop <= scrollingElement.clientHeight) {
        if (pageSize < totalItemsCount) {
          setPageSize((prevPageSize) => prevPageSize + defPageSize);
        }
      }
    }
  };

  useEffect(() => {
    const scrollingElement = scrollRef.current;
    if (scrollingElement) {
      const delayedHandleScroll = () => delayAction(handleScroll, 100);

      scrollingElement.addEventListener("wheel", delayedHandleScroll);

      return () => {
        scrollingElement.removeEventListener("wheel", delayedHandleScroll);
      };
    }
  }, [pageSize, totalItemsCount]);

  return {
    scrollRef,
    pageNumber,
    pageSize,
    defPageNumber,
    setDefPageNumber,
    defPageSize,
    setDefPageSize,
    totalItemsCount,
    setTotalItemsCount,
  };
};

export default usePagination;
