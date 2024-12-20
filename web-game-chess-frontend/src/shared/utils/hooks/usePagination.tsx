import { useEffect, useRef, useState } from "react";
import { delayAction } from "../functions/events";

const usePagination = () => {
  // ref to scrollable container
  const scrollRef = useRef<HTMLDivElement>(null);

  // stats for pagination data
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(0);

  // default values
  const [defPageNumber, setDefPageNumber] = useState<number>(1);
  const [defPageSize, setDefPageSize] = useState<number>(10);

  // total items received
  const [totalItemsCount, setTotalItemsCount] = useState<number>(0);

  // set default values
  useEffect(() => {
    setPageNumber(defPageNumber);
  }, [defPageNumber]);
  useEffect(() => {
    setPageSize(defPageSize);
  }, [defPageSize]);

  // update values based on scroll position
  const handleScroll = (): void => {
    const scrollingElement = scrollRef.current;
    if (scrollingElement) {
      if (scrollingElement.scrollHeight - 1.1 * scrollingElement.scrollTop <= scrollingElement.clientHeight) {
        if (pageSize < totalItemsCount) {
          setPageSize((prevPageSize) => prevPageSize + defPageSize);
        }
      }
    }
  };

  // add scroll listener
  useEffect(() => {
    const scrollingElement = scrollRef.current;
    if (scrollingElement) {
      const delayedHandleScroll = (): void => {
        delayAction(handleScroll, 100);
      };

      scrollingElement.addEventListener("wheel", delayedHandleScroll, { passive: true });

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
